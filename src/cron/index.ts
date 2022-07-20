import cron from 'node-cron';
import { IWorker } from '../interface/schedule';
import { crawlApprovedRequest } from './schedule';

const worker:IWorker = {
    isDone: true
};

class WorkerSchedule {
  public static start() {
    cron.schedule('*/1 * * * *', () => {
      if(worker.isDone === true) {
        worker.isDone = false;
        crawlApprovedRequest().then(() => {
          console.log('Cool! Done worker');
          worker.isDone = true;
        });
      } else {
        console.log('Not yet, just waiting...');
      }
    });
  }
}

export default WorkerSchedule;