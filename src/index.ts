import 'dotenv/config';
import express from 'express';
import getRank from './utils/getRank';
import FirebaseClass from './firebase/index';
import WorkerSchedule from './cron/index';
import cors from 'cors';
import { crawlApprovedRequest } from './cron/schedule';
import FireBaseClass from './firebase/index';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

// vercel does not work with cron
WorkerSchedule.start();

app.get('/api/rank/', async (req, res) => {
  try {
    const { faculty, semester, year, k, idStudent } = req.query;

    if(!faculty || !semester || !year || !k || !idStudent) {
      return res.status(404).send({
        success: false,
        error: 'Query is not valid',
        data: null,
      });
    }
  
    // check if server has data of this query
    const fileName = `${String(faculty).toLocaleUpperCase()}_${semester}_${year}_${k}`;
    let errorCodeFirebase: string = null;
    let file = null;
    try {
      file = await FirebaseClass.getFileDataByName(`${fileName}.json`);
    } catch (error) {
      errorCodeFirebase = error.code;
    }

    if(errorCodeFirebase === 'storage/object-not-found') {
      return res.status(404).send({
        success: false,
        error: 'Không có cơ sở dữ liệu này',
        data: null,
        query: {
          faculty,
          semester,
          year,
          k,
        }
      });
    }

    if(errorCodeFirebase) {
      throw new Error('Unknow error from firebase');
    }
  
    const result = getRank(JSON.parse(file), idStudent as unknown as string);

    if(!result) {
      return res.status(404).send({
        success: false,
        error: 'Không tìm thấy mã sinh viên',
        data: null,
      });
    }
  
    return res.status(200).send({
      success: true,
      error: null,
      data: result,
    });
  } catch (error) {
    console.log('Error', error);

    res.status(500).send({
      success: false,
      error: 'Server internal',
      data: null
    });
  }
});

app.get('/api/all-points', async (req, res) => {
  try {
    const result = await FirebaseClass.getAllPoints().then((data) => data);
    res.status(200).send({
      success: true,
      data: result.map((item) => {
        const splits = item.name.split('_');

        return {
          displayName: splits[0] + ' K' + splits[3],
          faculty: splits[0],
          k: splits[3],
          ...item,
        };
      })
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: 'Server internal',
      data: null
    });
  }
});

app.get('/api/all-available-points', async (req, res) => {
  try {
    const result = await FirebaseClass.getApprovedPointAvailable().then((data) => data);
    res.status(200).send({
      success: true,
      data: result.map((item) => {
        const splits = item.name.split('_');

        return {
          displayName: splits[0] + ' K' + splits[3],
          faculty: splits[0],
          k: splits[3],
          ...item,
        };
      })
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: 'Server internal',
      data: null
    });
  }
});

app.post('/api/point', async (req, res) => {
  try {
    const { faculty, k, prefixId } = req.body;

    if(!faculty || !k) {
      return res.status(500).send({
        success: false,
        error: 'Missing fields',
        data: null
      });
    }

    const fileName = `${String(faculty).toLocaleUpperCase()}_${'2'}_${'20212022'}_${k}`;
    const existence = await FirebaseClass.checkItemPointExist(`${faculty.toLocaleUpperCase()}_2_20212022_${k}`);

    if(existence.isExist) {
      await FirebaseClass.addItemToPointsCollection(fileName, {
        createdTime: existence.data.createdTime,
        k: k as string,
        name: fileName,
        requestedTime: existence.data.requestedTime,
        semester: '2' as string,
        year: '20212022' as string,
        isApproved: existence.data.isApproved,
        isAvailable: existence.data.isAvailable,
        foundCount: existence.data.foundCount+1,
        prefixId: existence.data.prefixId || prefixId || '',
      });

      return res.status(500).send({
        success: false,
        error: 'Đã có dữ liệu này rồi',
      });
    }

    await FirebaseClass.addItemToPointsCollection(fileName, {
      createdTime: new Date().toISOString(),
      k: k as string,
      name: fileName,
      requestedTime: new Date().toISOString(),
      semester: '2' as string,
      year: '20212022' as string,
      isApproved: false,
      isAvailable: false,
      foundCount: 0,
      prefixId: prefixId || ''
    });

    return res.status(201).send({
      success: false
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: 'Server internal',
      data: null
    });
  }
});

app.get('/api/approve-point', async (req, res) => {
  try {
    // docName = DAN_2_20212022_20;
    const { docName } = req.query;

    if(!docName) {
      return res.status(400).send({
        success: false,
        error: 'Missing docName query'
      });
    }

    const existence = await FireBaseClass.checkItemPointExist(docName as string);

    if(!existence.isExist) {
      return res.status(500).send({
        success: false,
        error: 'You need to create request first',
      });
    }

    const task = existence.data;

    if(task.isAvailable) {
      return res.status(500).send({
        success: false,
        error: 'This point is available !!',
      });
    }

    crawlApprovedRequest(task).then(() => {
      console.log('Maybe it should sent mail to admin');
    });

    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log('Error');
  }
});

app.listen(PORT, () => {
  console.log('Server is opened port ' + PORT);
});

export default app;