import utils from "./utils/index.mjs";

const NameKeys = [
  "First Name",
  "Middle Name",
  "Last Name",
  "Phonetic First Name",
  "Phonetic Middle Name",
  "Phonetic Last Name",
  "Name Prefix",
  "Name Suffix",
  "Nickname",
  "Organization Name",
];
const phoneKeys = ["Phone 1 - Value", "Phone 2 - Value", "Phone 3 - Value"];

const main = async () => {
  const csvPath = "csv/contacts.csv";
  if (!fs.existsSync(csvPath)) {
    console.log(`Fichier manquant : ${csvPath}. Le script est annulé.`);
    return;
  }
  const data = await utils.csv2json(csvPath);
  if (data.length === 0) {
    console.log("Le fichier CSV est vide. Le script est annulé.");
    return;
  }
  console.log("Nombre de contacts initiaux " + data.length);
  const realContacts = data.filter((contact) => {
    return phoneKeys.some((key) => contact[key]?.trim() !== "");
  });
  realContacts.forEach((contact) => {
    phoneKeys.forEach((key) => {
      if (contact[key]?.trim()) {
        contact[key] = utils.formatPhoneNumbers(contact[key]);
      }
    });
  });
  const cleanedData = utils.deletedOldContacts(realContacts, NameKeys);
  const contacts = utils.cleanData(cleanedData, phoneKeys);
  console.log("Nombre de contacts finaux " + contacts.length);
  utils.json2csv(contacts, "output/contacts_clean.csv");
};

main();
