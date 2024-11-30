import csv from 'csv-parser';
import fs from 'fs';

const csv2json = (path) => {
  return new Promise((resolve, reject) => {
    const results = []; 

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => results.push(data)) 
      .on('end', () => resolve(results)) 
      .on('error', (err) => reject(err)); 
  });
};

export default csv2json;
