import csv2json from "./utils/csv2json.mjs";
import json2csv from "./utils/json2csv.mjs";

const main = async () => {
  const data = await csv2json("csv/contacts.csv");
  console.log("Nombre de contacts initiaux " + data.length);
  // const allKeys = [...new Set(data.flatMap(Object.keys))];
  // console.log(allKeys.length);
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

  const realContacts = data.filter((contact) => {
    return phoneKeys.some((key) => contact[key]?.trim() !== "");
  });
  console.log("Nombre de contacts réels " + realContacts.length);
  const formatPhoneNumbers = (raw, countryCode = "+229") => {
    const numbers = raw.split(" ::: ");
    const cleanedNumbers = numbers
      .map(
        (num) => num.replace(/[^+\d]/g, "") // Supprimer tout sauf les chiffres et le "+"
      )
      .map((num) => (num.startsWith("+") ? num : `${countryCode}${num}`));
    const uniqueNumbers = [...new Set(cleanedNumbers)];
    return uniqueNumbers;
  };

  realContacts.forEach((contact) => {
    phoneKeys.forEach((key) => {
      if (contact[key] && contact[key].trim() !== "") {
        contact[key] = formatPhoneNumbers(contact[key]);
      }
    });
  });
  // console.log(realContacts);

  const manageContacts = (contacts, NameKeys, phoneKeys) => {
    const duplicateAndAddPrefix = (contacts) => {
      const updatedContacts = [];
  
      contacts.forEach((contact) => {
        const firstNameKey = NameKeys.find((key) => contact[key]?.trim() !== "");
  
        if (firstNameKey) {
          const oldContact = { ...contact };
          oldContact[firstNameKey] = `old ${contact[firstNameKey]}`;
  
          updatedContacts.push(contact, oldContact);
        } else {
          updatedContacts.push(contact);
        }
      });
  
      return updatedContacts;
    };
  
    const addBeninPrefix = (contacts) => {
      contacts.forEach((contact) => {
        const isOldContact = NameKeys.some((key) =>
          contact[key]?.trim().startsWith("old ")
        );
  
        if (!isOldContact) {
          phoneKeys.forEach((key) => {
            if (contact[key]) {
              contact[key] = contact[key].map((num) => {
                if (num.startsWith("+229")) {
                  return `+22901${num.slice(4)}`;
                } else if (num.length === 8) {
                  return `01${num}`;
                }
                return num;
              });
            }
          });
        }
      });
  
      return contacts;
    };
  
    const duplicatedContacts = duplicateAndAddPrefix(contacts);
    return addBeninPrefix(duplicatedContacts);
  };
  
  const finalContacts = manageContacts(realContacts, NameKeys, phoneKeys);
  console.log("Nombre de contacts finaux " + finalContacts.length);
  const cleanData = (contacts) => {
    return contacts.map((contact) => {
      const cleanedContact = { ...contact };
  
      phoneKeys.forEach((key) => {
        if (cleanedContact[key]) {
          cleanedContact[key] = Array.isArray(cleanedContact[key])
            ? cleanedContact[key].join(" ::: ") 
            : cleanedContact[key];
        }
      });
  
      return cleanedContact;
    });
  };

  const cleanedContacts = cleanData(finalContacts);
  
  json2csv(cleanedContacts, "output/contacts.csv");
};

main();
