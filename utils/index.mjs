import fs from "fs";
import csv2json from "./csv2json.mjs";
import json2csv from "./json2csv.mjs";

// Fonction pour créer un dossier
const createFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

// Fonction pour formater les numéros de telephone
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

// Fonction pour dupliquer les contacts et ajouter le prefixe "old"
const duplicateAndAddPrefix = (contacts, NameKeys) => {
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

// Fonction pour ajouter le prefixe "01" aux numéros béninois
const addBeninPrefix = (contacts, NameKeys, phoneKeys) => {
  contacts.forEach((contact) => {
    const isOldContact = NameKeys.some((key) =>
      contact[key]?.trim().startsWith("old ")
    );

    if (!isOldContact) {
      phoneKeys.forEach((key) => {
        if (contact[key]) {
          contact[key] = contact[key].map((num) => {
            if (num.startsWith("+229")) {
              if (num.slice(4, 6) === "01") {
                return num;
              } else {
                return `+22901${num.slice(4)}`;
              }
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

// Fonction pour ajouter les variations de numéros locaux
const addLocalNumberVariations = (contacts, phoneKeys) => {
  contacts.forEach((contact) => {
    phoneKeys.forEach((key) => {
      if (contact[key]) {
        const originalNumbers = Array.isArray(contact[key]) ? contact[key] : [];
        const numbersWithLocalVariations = originalNumbers.flatMap((num) => {
          if (num.startsWith("+22901")) {
            return [num, num.replace("+229", "")];
          }
          return num;
        });

        contact[key] = [...new Set(numbersWithLocalVariations)];
      }
    });
  });

  return contacts;
};

// Fonction pour nettoyer les données et separer les contacts a un format csv
const cleanData = (contacts, phoneKeys) => {
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

// Fonction pour supprimer les contacts avec la mention "old"
const deletedOldContacts = (contacts, NameKeys) => {
  return contacts.filter((contact) => {
    return !NameKeys.some((key) => contact[key]?.trim().startsWith("old "));
  });
};

export default {
  formatPhoneNumbers,
  duplicateAndAddPrefix,
  addBeninPrefix,
  addLocalNumberVariations,
  cleanData,
  deletedOldContacts,
  csv2json,
  json2csv,
  createFolder
};
