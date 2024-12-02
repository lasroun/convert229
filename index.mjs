import fs from "fs";
import path from "path";
import utils from "./utils/index.mjs";

const phoneKeys = ["Phone 1 - Value", "Phone 2 - Value", "Phone 3 - Value"];
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

const main = async () => {
  utils.createFolder("output");
  utils.createFolder("csv");

  const csvPath = path.join("csv", "contacts.csv");

  if (!fs.existsSync(csvPath)) {
    console.log(`Fichier manquant : ${csvPath}. Le script est annulé.`);
    return;
  }

  try {
    const data = await utils.csv2json(csvPath);
    if (data.length === 0) {
      console.log("Le fichier CSV est vide. Le script est annulé.");
      return;
    }
    console.log("Nombre de contacts initiaux : " + data.length);

    const realContacts = data.filter((contact) => {
      return phoneKeys.some((key) => contact[key]?.trim() !== "");
    });
    console.log("Nombre de contacts réels : " + realContacts.length);

    realContacts.forEach((contact) => {
      phoneKeys.forEach((key) => {
        if (contact[key]?.trim()) {
          contact[key] = utils.formatPhoneNumbers(contact[key]);
        }
      });
    });

    const duplicatedContacts = utils.duplicateAndAddPrefix(
      realContacts,
      NameKeys
    );
    const finalContacts = utils.addBeninPrefix(
      duplicatedContacts,
      NameKeys,
      phoneKeys
    );

    const finalContactsWithVariations = utils.addLocalNumberVariations(
      finalContacts,
      phoneKeys
    );
    console.log("Nombre contacts finaux avec variations locales ajoutées : " + finalContactsWithVariations.length);

    const cleanedContacts = utils.cleanData(finalContactsWithVariations, phoneKeys);

    utils.json2csv(cleanedContacts, path.join("output", "contacts.csv"));
    console.log("Fichier CSV final généré dans le dossier 'output'.");
  } catch (error) {
    console.error("Erreur lors de l'exécution :", error.message);
  }
};

main();
