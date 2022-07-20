import { IStudent } from '../interface/student';

const checkFields = (obj: IStudent) => {
  const keys = [
    'id',
    'semester',
    'accumulatedCreditsRaw',
    'creditsRaw',
    'aveAccumulatedType4Raw',
    'aveAccumulatedType10Raw',
    'aveSemesterType4Raw',
    'aveSemesterType10Raw',
    'isError',
  ];

  for(let i = 0 ; i < keys.length; i++) {
    if(typeof obj[keys[i]] === 'undefined') {
      console.log(obj);
      return false;
    }
  }

  return true;
};

export default checkFields;