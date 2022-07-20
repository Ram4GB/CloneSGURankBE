https://vercel.com/docs/project-configuration#project-configuration/public

## Example code

### Get one student 

<pre>
import getOneStudent from './utils/getOneStudent';

getOneStudent('3119410416').then((data) => console.log(data));
</pre>

### Get all students

<pre>
import getAllStudents from './utils/getAllStudents';
import writeFileToSystem from './utils/store';

getAllStudents('311941')
  .then((data) => {
    writeFileToSystem('DCT', '2', '20212022', '19', data);
    console.log('Done everything !!!');
  })
  .catch((e) => e);
</pre>
 
### Check enough field students
<pre>
import data from './data/data';
import checkFields from './utils/checkField';
import { IStudent } from './interface/student';

for(let i = 0 ; i < data.length; i++) {
  if(!checkFields(data[i] as IStudent)) {
    throw new Error('Oops');
  }
}
</pre>

### Get file content from  firebase

<pre>
import { ref } from 'firebase/storage';
import FireBaseClass from './firebase'; './firebase/index';

FireBaseClass.getFileDataByRef(ref(FireBaseClass.storage, 'DCT_2_20212022_19.json')).then((data) => {
  console.log(data);
});
</pre>

### Demo upload and get json 

<pre>
FireBaseClass.uploadFileWithString(JSON.stringify([{ name: 'cuong' }]), 'test.json').then(() => {
  console.log('update ');
}).catch((e) => {
  console.log(e);
});

FireBaseClass.getFileDataByName('test.json').then((data: string) => {
  console.log(JSON.parse(data));
}).catch((e) => {
  console.log(e);
});
</pre>

### Add doc to collection

<pre>
FireBaseClass.addItemToPointsCollection('DCT_2_20212022_19', {
  name: 'DCT_2_20212022_19',
  createdTime: new Date().toISOString(),
  isAvailable: true,
  k: '19',
  requestedTime: new Date().toISOString(),
  semester: '2',
  year: '20212022',
  isApproved: true,
}).then((value) => {
  console.log(value);
}).catch((error) => {
  console.log(error);
});
</pre>

### Check doc if it exists

<pre>
FireBaseClass.checkItemPointExist('DCT_2_20212022_19').then((value) => {
  console.log(value);
}).catch((error) => {
  console.log(error);
});
</pre>

### Check point is approved & not available to crawl

<pre>
FireBaseClass.getApprovedPointNotAvailable().then((value) => {
  console.log(value);
}).catch((error) => {
  console.log(error);
});
</pre>

### New point request example

<pre>
FireBaseClass.addItemToPointsCollection('DCT_2_20212022_21', {
  createdTime: new Date().toISOString(),
  k: '21', // chỉnh
  name: 'DCT_2_20212022_21', // chỉnh
  prefixId: '312141', // chỉnh
  requestedTime: new Date().toISOString(),
  semester: '2',
  year: '20212022',
  isApproved: false,
  isAvailable: false,
  foundCount: 0,
}).then(() => {
  console.log('Done');
}).catch((e) => e);
</pre>