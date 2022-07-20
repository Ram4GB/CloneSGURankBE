/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/express/lib sync recursive":
/*!****************************************!*\
  !*** ./node_modules/express/lib/ sync ***!
  \****************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/express/lib sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./src/cron/index.ts":
/*!***************************!*\
  !*** ./src/cron/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var node_cron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-cron */ "./node_modules/node-cron/src/node-cron.js");
/* harmony import */ var node_cron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_cron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _schedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schedule */ "./src/cron/schedule.ts");


const worker = {
    isDone: true
};
class WorkerSchedule {
    static start() {
        node_cron__WEBPACK_IMPORTED_MODULE_0___default().schedule('*/1 * * * *', () => {
            if (worker.isDone === true) {
                worker.isDone = false;
                (0,_schedule__WEBPACK_IMPORTED_MODULE_1__.crawlApprovedRequest)().then(() => {
                    console.log('Cool! Done worker');
                    worker.isDone = true;
                });
            }
            else {
                console.log('Not yet, just waiting...');
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WorkerSchedule);


/***/ }),

/***/ "./src/cron/schedule.ts":
/*!******************************!*\
  !*** ./src/cron/schedule.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "crawlApprovedRequest": () => (/* binding */ crawlApprovedRequest)
/* harmony export */ });
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../firebase */ "./src/firebase/index.ts");
/* harmony import */ var _utils_getAllStudents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getAllStudents */ "./src/utils/getAllStudents.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const crawlApprovedRequest = (curTask) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let task = curTask;
        if (!curTask) {
            const result = yield _firebase__WEBPACK_IMPORTED_MODULE_0__["default"].getApprovedPointNotAvailable();
            if (result.length === 0) {
                console.log('Happy day without any works');
                return Promise.resolve();
            }
            task = result[0];
        }
        if (task.prefixId.length !== 6) {
            Promise.resolve();
            console.log('Current task', task.prefixId, ' has wrong prefixId');
            return Promise.resolve();
        }
        const students = yield (0,_utils_getAllStudents__WEBPACK_IMPORTED_MODULE_1__["default"])(task.prefixId);
        yield _firebase__WEBPACK_IMPORTED_MODULE_0__["default"].uploadFileWithString(JSON.stringify(students), `${task.name}.json`);
        yield _firebase__WEBPACK_IMPORTED_MODULE_0__["default"].addItemToPointsCollection(task.name, Object.assign(Object.assign({}, task), { isAvailable: true, isApproved: true }));
        console.log(task.name + ' is available now');
        return Promise.resolve();
    }
    catch (error) {
        console.log(error);
    }
});


/***/ }),

/***/ "./src/firebase/index.ts":
/*!*******************************!*\
  !*** ./src/firebase/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "firebaseClass": () => (/* binding */ firebaseClass)
/* harmony export */ });
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/index.mjs");
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/storage */ "./node_modules/firebase/storage/dist/index.mjs");
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ "./node_modules/firebase/firestore/dist/index.mjs");
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! request */ "./node_modules/request/index.js");
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_3__);




const POINTS_COLLECTION = 'POINTS';
const FEEDBACKS_COLLECTION = 'FEEDBACKS';
class FireBaseClass {
    constructor() {
        this.firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        };
        FireBaseClass.firebase = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(this.firebaseConfig);
        FireBaseClass.storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getStorage)(FireBaseClass.firebase);
        FireBaseClass.db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)(FireBaseClass.firebase);
        FireBaseClass.rootRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(FireBaseClass.storage);
        FireBaseClass.pointsColRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.collection)(FireBaseClass.db, POINTS_COLLECTION);
        FireBaseClass.feedbacksColRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.collection)(FireBaseClass.db, FEEDBACKS_COLLECTION);
        FireBaseClass.pointsDocRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(FireBaseClass.pointsColRef);
    }
    static getFileByItemRef(itemRef) {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getMetadata)(itemRef);
    }
    static getAllFiles() {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.listAll)(this.rootRef);
    }
    static getFileDataByRef(fileRef) {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getDownloadURL)(fileRef).then((url) => {
            return new Promise((resolve, reject) => {
                request__WEBPACK_IMPORTED_MODULE_3___default()(url, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data.body);
                });
            });
        });
    }
    static getFileDataByName(fileName) {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getDownloadURL)((0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(this.storage, fileName)).then((url) => {
            return new Promise((resolve, reject) => {
                request__WEBPACK_IMPORTED_MODULE_3___default()(url, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data.body);
                });
            });
        });
    }
    static uploadFileWithString(string, filename) {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.uploadString)((0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(this.storage, filename), string);
    }
    static uploadFile(file, filename) {
        return (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.uploadBytes)((0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(this.storage, filename), file);
    }
    static addItemToPointsCollection(docName, value) {
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.setDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(this.pointsColRef, docName), value);
    }
    static addItemToFeedbacksCollection(docName, value) {
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.setDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(this.feedbacksColRef, docName), value);
    }
    static checkItemPointExist(docName) {
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(this.pointsColRef, docName)).then((docSnap) => {
            if (docSnap.exists()) {
                return {
                    isExist: true,
                    data: docSnap.data()
                };
            }
            return {
                isExist: false,
                data: null
            };
        });
    }
    static getApprovedPointNotAvailable() {
        const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.query)(this.pointsColRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('prefixId', '!=', ''), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('isApproved', '==', true), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('isAvailable', '==', false));
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDocs)(q).then((querySnapshot) => {
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push(doc.data());
            });
            return arr;
        });
    }
    static getApprovedPointAvailable() {
        const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.query)(this.pointsColRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('prefixId', '!=', ''), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('isApproved', '==', true), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.where)('isAvailable', '==', true));
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDocs)(q).then((querySnapshot) => {
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push(doc.data());
            });
            return arr;
        });
    }
    static getAllPoints() {
        const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.query)(this.pointsColRef);
        return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDocs)(q).then((querySnapshot) => {
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push(doc.data());
            });
            return arr;
        });
    }
}
FireBaseClass.firebase = null;
FireBaseClass.storage = null;
FireBaseClass.rootRef = null;
FireBaseClass.db = null;
FireBaseClass.pointsColRef = null;
FireBaseClass.feedbacksColRef = null;
FireBaseClass.pointsDocRef = null;
let firebaseClass;
if (!process.env.FIREBASE_API_KEY ||
    !process.env.FIREBASE_AUTH_DOMAIN ||
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_STORAGE_BUCKET ||
    !process.env.FIREBASE_MESSAGE_SENDER_ID ||
    !process.env.FIREBASE_APP_ID ||
    !process.env.FIREBASE_MEASUREMENT_ID) {
    throw new Error('Please replace these value with your Firebase API');
}
else {
    firebaseClass = new FireBaseClass();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FireBaseClass);



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv/config */ "./node_modules/dotenv/config.js");
/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv_config__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "./node_modules/express/index.js");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_getRank__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/getRank */ "./src/utils/getRank.ts");
/* harmony import */ var _firebase_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./firebase/index */ "./src/firebase/index.ts");
/* harmony import */ var _cron_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cron/index */ "./src/cron/index.ts");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! cors */ "./node_modules/cors/lib/index.js");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _cron_schedule__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cron/schedule */ "./src/cron/schedule.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
const PORT = process.env.PORT || 3000;
app.use(express__WEBPACK_IMPORTED_MODULE_1___default().json());
app.use(express__WEBPACK_IMPORTED_MODULE_1___default().urlencoded({ extended: false }));
app.use(express__WEBPACK_IMPORTED_MODULE_1___default()["static"]('public'));
app.use(cors__WEBPACK_IMPORTED_MODULE_5___default()());
_cron_index__WEBPACK_IMPORTED_MODULE_4__["default"].start();
app.get('/api/rank/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { faculty, semester, year, k, idStudent } = req.query;
        if (!faculty || !semester || !year || !k || !idStudent) {
            return res.status(404).send({
                success: false,
                error: 'Query is not valid',
                data: null,
            });
        }
        const fileName = `${String(faculty).toLocaleUpperCase()}_${semester}_${year}_${k}`;
        let errorCodeFirebase = null;
        let file = null;
        try {
            file = yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].getFileDataByName(`${fileName}.json`);
        }
        catch (error) {
            errorCodeFirebase = error.code;
        }
        if (errorCodeFirebase === 'storage/object-not-found') {
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
        if (errorCodeFirebase) {
            throw new Error('Unknow error from firebase');
        }
        const result = (0,_utils_getRank__WEBPACK_IMPORTED_MODULE_2__["default"])(JSON.parse(file), idStudent);
        if (!result) {
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
    }
    catch (error) {
        console.log('Error', error);
        res.status(500).send({
            success: false,
            error: 'Server internal',
            data: null
        });
    }
}));
app.get('/api/all-points', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].getAllPoints().then((data) => data);
        res.status(200).send({
            success: true,
            data: result.map((item) => {
                const splits = item.name.split('_');
                return Object.assign({ displayName: splits[0] + ' K' + splits[3], faculty: splits[0], k: splits[3] }, item);
            })
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: 'Server internal',
            data: null
        });
    }
}));
app.get('/api/all-available-points', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].getApprovedPointAvailable().then((data) => data);
        res.status(200).send({
            success: true,
            data: result.map((item) => {
                const splits = item.name.split('_');
                return Object.assign({ displayName: splits[0] + ' K' + splits[3], faculty: splits[0], k: splits[3] }, item);
            })
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: 'Server internal',
            data: null
        });
    }
}));
app.post('/api/point', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { faculty, k, prefixId } = req.body;
        if (!faculty || !k) {
            return res.status(500).send({
                success: false,
                error: 'Missing fields',
                data: null
            });
        }
        const fileName = `${String(faculty).toLocaleUpperCase()}_${'2'}_${'20212022'}_${k}`;
        const existence = yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].checkItemPointExist(`${faculty.toLocaleUpperCase()}_2_20212022_${k}`);
        if (existence.isExist) {
            yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].addItemToPointsCollection(fileName, {
                createdTime: existence.data.createdTime,
                k: k,
                name: fileName,
                requestedTime: existence.data.requestedTime,
                semester: '2',
                year: '20212022',
                isApproved: existence.data.isApproved,
                isAvailable: existence.data.isAvailable,
                foundCount: existence.data.foundCount + 1,
                prefixId: existence.data.prefixId || prefixId || '',
            });
            return res.status(500).send({
                success: false,
                error: 'Đã có dữ liệu này rồi',
            });
        }
        yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].addItemToPointsCollection(fileName, {
            createdTime: new Date().toISOString(),
            k: k,
            name: fileName,
            requestedTime: new Date().toISOString(),
            semester: '2',
            year: '20212022',
            isApproved: false,
            isAvailable: false,
            foundCount: 0,
            prefixId: prefixId || ''
        });
        return res.status(201).send({
            success: false
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: 'Server internal',
            data: null
        });
    }
}));
app.get('/api/approve-point', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { docName } = req.query;
        if (!docName) {
            return res.status(400).send({
                success: false,
                error: 'Missing docName query'
            });
        }
        const existence = yield _firebase_index__WEBPACK_IMPORTED_MODULE_3__["default"].checkItemPointExist(docName);
        if (!existence.isExist) {
            return res.status(500).send({
                success: false,
                error: 'You need to create request first',
            });
        }
        const task = existence.data;
        if (task.isAvailable) {
            return res.status(500).send({
                success: false,
                error: 'This point is available !!',
            });
        }
        (0,_cron_schedule__WEBPACK_IMPORTED_MODULE_6__.crawlApprovedRequest)(task).then(() => {
            console.log('Maybe it should sent mail to admin');
        });
        res.status(200).send({
            success: true,
        });
    }
    catch (error) {
        console.log('Error');
    }
}));
app.listen(PORT, () => {
    console.log('Server is opened port ' + PORT);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);


/***/ }),

/***/ "./src/utils/generateId.ts":
/*!*********************************!*\
  !*** ./src/utils/generateId.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const generateId = (prefixId, index) => {
    while (index.length < 4) {
        index = '0' + index;
    }
    return prefixId.concat(index);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateId);


/***/ }),

/***/ "./src/utils/getAllStudents.ts":
/*!*************************************!*\
  !*** ./src/utils/getAllStudents.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _generateId__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generateId */ "./src/utils/generateId.ts");
/* harmony import */ var _getOneStudent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getOneStudent */ "./src/utils/getOneStudent.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const totalItem = 20;
const percentToBreak = 1;
const getAllStudents = (prefixId) => __awaiter(void 0, void 0, void 0, function* () {
    let isBreak = false;
    let currentIndex = 1;
    let requests = [];
    const finalResult = [];
    while (!isBreak) {
        try {
            for (let i = 1; i <= totalItem; i++) {
                const id = (0,_generateId__WEBPACK_IMPORTED_MODULE_0__["default"])(prefixId, String(currentIndex + i));
                console.log('Getting student', id);
                requests.push((0,_getOneStudent__WEBPACK_IMPORTED_MODULE_1__["default"])(id));
            }
            const result = yield Promise.all(requests);
            finalResult.push(...result);
            let errorCount = 0;
            for (let i = 0; i < result.length; i++) {
                if (result[i].isError) {
                    errorCount++;
                }
            }
            if (errorCount / result.length >= percentToBreak) {
                console.log('The worker was finish, because error count is', errorCount * 100 / result.length);
                isBreak = true;
            }
            else {
                requests = [];
                currentIndex += totalItem;
            }
        }
        catch (error) {
            console.log('error', error);
            isBreak = true;
        }
    }
    return finalResult;
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAllStudents);


/***/ }),

/***/ "./src/utils/getOneStudent.ts":
/*!************************************!*\
  !*** ./src/utils/getOneStudent.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! request */ "./node_modules/request/index.js");
/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cheerio */ "./node_modules/cheerio/lib/esm/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const getPointText = (text) => {
    try {
        const specialCase = ['dtbhk_10/100', 'dtbhk_4', 'dtbtl', 'dtbtls'];
        let index = -1;
        for (let i = 0; i < specialCase.length; i++) {
            if (text.includes(specialCase[i])) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            return text.split(specialCase[index])[1];
        }
        const arrReg = /\d+(\.?\d+)?$/.exec(text);
        if (!arrReg) {
            return '0';
        }
        return arrReg[0];
    }
    catch (error) {
        console.log(text);
        throw new Error('Stop');
    }
};
const getOneStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            request__WEBPACK_IMPORTED_MODULE_0___default()('http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=' + id, (error, response) => {
                if (error) {
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
                const $ = (0,cheerio__WEBPACK_IMPORTED_MODULE_1__.load)(response.body);
                const semester = $('#ctl00_ContentPlaceHolder1_ctl00_div1 table tbody tr.title-hk-diem').last().text().trim();
                let aveSemesterType10Raw = null;
                let aveSemesterType4Raw = null;
                let aveAccumulatedType10Raw = null;
                let aveAccumulatedType4Raw = null;
                let creditsRaw = null;
                let accumulatedCreditsRaw = null;
                if (semester !== 'Học kỳ 2 - Năm học 2021-2022') {
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
                if (accumulatedCreditsRaw === '' ||
                    creditsRaw === '' ||
                    aveAccumulatedType4Raw === '' ||
                    aveAccumulatedType10Raw === '' ||
                    aveSemesterType4Raw === '' ||
                    aveSemesterType10Raw === '') {
                    return reject('One of fields is empty');
                }
                if (parseFloat(aveAccumulatedType4Raw) > 10 ||
                    parseFloat(aveAccumulatedType10Raw) > 10 ||
                    parseFloat(aveSemesterType4Raw) > 10 ||
                    parseFloat(aveSemesterType10Raw) > 10) {
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
    }
    catch (error) {
        throw Error(error);
    }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getOneStudent);


/***/ }),

/***/ "./src/utils/getRank.ts":
/*!******************************!*\
  !*** ./src/utils/getRank.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const sortArray = (data, sortBy) => {
    return data.sort((a, b) => {
        if (isNaN(parseFloat(b[sortBy]) - parseFloat(a[sortBy]))) {
            console.log(parseFloat(b[sortBy]) - parseFloat(a[sortBy]), b[sortBy], a[sortBy], b, a);
        }
        return parseFloat(b[sortBy]) - parseFloat(a[sortBy]);
    });
};
const getRank = (data, idStudent) => {
    data = sortArray(data, 'aveSemesterType4Raw');
    const index = data.findIndex((student) => student.id === idStudent);
    if (index === -1) {
        return null;
    }
    return Object.assign(Object.assign({ rank: (index + 1) + '/' + data.length }, data[index]), { top5: data.slice(0, 5) });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRank);


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cors_lib_index_js-node_modules_dotenv_config_js-node_modules_express_ind-6f403b"], () => (__webpack_require__("./src/index.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"index": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("vendors-node_modules_cors_lib_index_js-node_modules_dotenv_config_js-node_modules_express_ind-6f403b");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map