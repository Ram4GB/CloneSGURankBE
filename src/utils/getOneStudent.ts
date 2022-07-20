import fetch from 'request';
import { load } from 'cheerio';
import { IStudent } from '../interface/student';

const getPointText = (text: string) => {
  try {
    const specialCase = ['dtbhk_10/100', 'dtbhk_4', 'dtbtl', 'dtbtls'];
    let index = -1;
    for(let i = 0 ; i < specialCase.length; i++) {
      if(text.includes(specialCase[i])) {
        index = i;
        break;
      }
    }

    if(index !== -1) {
      return text.split(specialCase[index])[1];
    }

    const arrReg = /\d+(\.?\d+)?$/.exec(text);
    
    if(!arrReg) {
      return '0';
    }

    return arrReg[0];
  } catch (error) {
    console.log(text);
    throw new Error('Stop');
  }
};

const getOneStudent = async (id: string):Promise<IStudent> => {
  try {
    return new Promise((resolve, reject) => {
      fetch('http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=' + id, (error, response) => {
        if(error) {
          // instead of reject, we return default
          // return reject(error);

          return resolve({
            id: id,
            semester: '',
            accumulatedCreditsRaw: '0',
            creditsRaw: '0',
            aveAccumulatedType4Raw: '0',
            aveAccumulatedType10Raw: '0',
            aveSemesterType4Raw: '0',
            aveSemesterType10Raw: '0',
            isError: true,
          });
        }

        const $ = load(response.body);
        const semester = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.title-hk-diem').last().text().trim();
        let aveSemesterType10Raw: string|null = null;
        let aveSemesterType4Raw: string|null = null;
        let aveAccumulatedType10Raw: string|null = null;
        let aveAccumulatedType4Raw: string|null = null;
        let creditsRaw: string|null = null;
        let accumulatedCreditsRaw: string|null = null;
        if(semester !== 'Học kỳ 2 - Năm học 2021-2022') {
          // instead of reject, we return default
          // return reject('A student currently does not have this semester');

          return resolve({
            id: id,
            semester,
            accumulatedCreditsRaw: '0',
            creditsRaw: '0',
            aveAccumulatedType4Raw: '0',
            aveAccumulatedType10Raw: '0',
            aveSemesterType4Raw: '0',
            aveSemesterType10Raw: '0',
            isError: true,
          });
        }

        accumulatedCreditsRaw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().text().trim();
        creditsRaw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().prev().text().trim();
        aveAccumulatedType4Raw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().prev().prev().text().trim();
        aveAccumulatedType10Raw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().prev().prev().prev().text().trim();
        aveSemesterType4Raw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().prev().prev().prev().prev().text().trim();
        aveSemesterType10Raw = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.row-diemTK').last().prev().prev().prev().prev().prev().text().trim();

        accumulatedCreditsRaw = getPointText(accumulatedCreditsRaw);
        creditsRaw = getPointText(creditsRaw);
        aveAccumulatedType4Raw = getPointText(aveAccumulatedType4Raw);
        aveAccumulatedType10Raw = getPointText(aveAccumulatedType10Raw);
        aveSemesterType4Raw = getPointText(aveSemesterType4Raw);
        aveSemesterType10Raw = getPointText(aveSemesterType10Raw);

        if(
          accumulatedCreditsRaw === '' ||
          creditsRaw === '' ||
          aveAccumulatedType4Raw === '' ||
          aveAccumulatedType10Raw === '' ||
          aveSemesterType4Raw === '' ||
          aveSemesterType10Raw === ''
        ) {
          return reject('One of fields is empty');
        }

        if(
          parseFloat(aveAccumulatedType4Raw) > 10 ||
          parseFloat(aveAccumulatedType10Raw) > 10 ||
          parseFloat(aveSemesterType4Raw) > 10 ||
          parseFloat(aveSemesterType10Raw) > 10
        ) {
          return reject('point is greater than 10');
        }

        return resolve({
          id: id,
          semester,
          accumulatedCreditsRaw,
          creditsRaw,
          aveAccumulatedType4Raw,
          aveAccumulatedType10Raw,
          aveSemesterType4Raw,
          aveSemesterType10Raw,
          isError: false,
        });
      });
    });
  } catch (error) {
    throw Error(error);
  }
};

export default getOneStudent;
