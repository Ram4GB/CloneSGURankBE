import FireBaseClass from '../firebase';
import FTPClient from '../ftp';
import { IPoint } from '../interface/point';
import getAllStudents from '../utils/getAllStudents';

export const crawlApprovedRequest = async (curTask?: IPoint) => {
  try {
    let task = curTask; // undefined | has a value

    if(!curTask) {
      const result = await FireBaseClass.getApprovedPointNotAvailable();

      if(result.length === 0) {
        console.log('Happy day without any works');
        return Promise.resolve();
      }

      task = result[0];
    }

    if(task.prefixId.length !== 6) {
      Promise.resolve();
      console.log('Current task', task.prefixId, ' has wrong prefixId');
      return Promise.resolve();
    }

    const students = await getAllStudents(task.prefixId);

    await FireBaseClass.uploadFileWithString(JSON.stringify(students), `${task.name}.json`);

    await FireBaseClass.addItemToPointsCollection(task.name, {
      ...task,
      isAvailable: true,
      isApproved: true,
    });

    const points = await FireBaseClass.getAllPoints();

    await FTPClient.syncPointsFromFirebase(JSON.stringify(points));

    console.log(task.name + ' is available now');

    return Promise.resolve();
  } catch (error) {
    console.log(error);
  }
};