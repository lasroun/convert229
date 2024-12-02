import { Parser } from "json2csv";
import fs from "fs";

const json2csv = (data, outputPath) => {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);

    fs.writeFileSync(outputPath, csv, "utf-8");
    console.log(`Fichier CSV généré avec succès`);
  } catch (err) {
    console.error("Erreur lors de la conversion JSON → CSV :", err);
  }
};

export default json2csv;
