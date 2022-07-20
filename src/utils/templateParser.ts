import ejs from 'ejs';

const templateParser = (filename: string, data: any = {}) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile('src/views/' + filename + '.ejs', data, (err, str) => {
      if(err) {
        reject(err);
      }
  
      resolve(str);
    });
  });
};

export default templateParser;