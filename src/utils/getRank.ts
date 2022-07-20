import { IStudent } from '../interface/student';

/**
 * 
 * @param data array of object item
 * @param sortBy sort object was followed by key which user provided
 */

const sortArray = (data: Array<any>, sortBy: string) => {
  return data.sort((a, b) => {
    if(isNaN(parseFloat(b[sortBy]) - parseFloat(a[sortBy]))) {
      console.log(parseFloat(b[sortBy]) - parseFloat(a[sortBy]), b[sortBy], a[sortBy], b, a);
    }
    return parseFloat(b[sortBy]) - parseFloat(a[sortBy]);
  });
};

/**
 * 
 * @param data array of students
 * @param idStudent the id of student who want to get a rank
 * @returns position of this student in given array
 */
const getRank = (data: Array<IStudent>, idStudent: string) => {
  data = sortArray(data, 'aveSemesterType4Raw');

  const index = data.findIndex((student) => student.id === idStudent);

  if(index === -1) {
    return null;
  }

  return {
    rank: (index + 1) + '/' + data.length,
    ...data[index],
    top5: data.slice(0, 5),
  };
};

export default getRank;