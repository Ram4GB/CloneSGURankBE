import Client from 'ftp';
import { IPoint } from '../interface/point';

let ftp:Client | undefined = new Client();

class FTPClient {
  public static connect() {
    ftp = new Client();
    console.log(process.env.FTP_HOST_URL);
    ftp.connect({
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      host: process.env.FTP_HOST_URL,
    });
  }

  public static getAllPoints(): Promise<Array<IPoint>> {
    return new Promise((resolve) => {
      try {
        this.connect();

        ftp.on('ready', () => {
          let points:Array<IPoint> = [];

          // Sometimes FTP splits file content to multiple parts
          // Example: If your file is 9000 buffer length -> 4k + 5k || 2k + 7k
          // This summary of buffer parts;
          const partOfFile:any = [];
          ftp.get('/sgu-rank/points.json', (error, stream) => {
            if(error) {
              ftp.end();
              return resolve([]);
            }
    
            stream.once('finish', async () => {
              const concatenated = Buffer.concat(partOfFile);

              try {
                points = JSON.parse(concatenated.toString());
              } catch (error) {
                console.log(error, 'error');
              }

              ftp.end();
              resolve(points);
            });

            stream.on('data', (arrayBuffer) => {
              partOfFile.push(arrayBuffer);
            });
          });
        });
      } catch (error) {
        console.log('error', error);
        ftp.end();
        resolve([]);
      }
    });
  }

  public static syncPointsFromFirebase(jsonData: string) {
    return new Promise((resolve) => {
      try {
        this.connect();

        ftp.on('ready', () => {
          ftp.put(jsonData, '/sgu-rank/points.json', (error) => {
            if(error) {
              console.log(error);
            }
  
            ftp.end();
            return resolve(null);
          });
        });
      } catch (error) {
        console.log('error', error);
        ftp.end();
        resolve(null);
      }
    });
  }
}

export default FTPClient;