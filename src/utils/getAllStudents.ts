import generateId from './generateId';
import getOneStudent from './getOneStudent';

const totalItem = 20;
const percentToBreak = 1;

const getAllStudents = async (prefixId: string) => {
  let isBreak = false;
  let currentIndex = 1;
  let requests = [];
  const finalResult = [];
  while(!isBreak) {
    try {
      for(let i = 1; i <= totalItem; i++) {
        const id = generateId(prefixId, String(currentIndex + i));
        console.log('Getting student', id);
        requests.push(getOneStudent(id));
      }

      const result = await Promise.all(requests);

      finalResult.push(...result);

      // try to break while loop if percent of error is greater than percentToBreak
      let errorCount = 0;
      for(let i = 0 ; i < result.length; i++) {
        if(result[i].isError) {
          errorCount++;
        }
      }

      if(errorCount/result.length >= percentToBreak) {
        console.log('The worker was finish, because error count is', errorCount*100/result.length);
        isBreak = true;
      } else {
        requests = [];
        currentIndex += totalItem;
      }
    } catch (error) {
      console.log('error', error);
      isBreak = true;
    }
  }

  return finalResult;
};

export default getAllStudents;