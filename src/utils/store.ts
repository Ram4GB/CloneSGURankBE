import fs from 'fs';

const writeFileToSystem = (faculty: string, semester: string, year: string, k: string, data: any) => {
  fs.writeFileSync(`./src/data/${faculty}_${semester}_${year}_${k}.json`, JSON.stringify(data), { encoding: 'utf8', flag: 'w' });
};

export default writeFileToSystem;