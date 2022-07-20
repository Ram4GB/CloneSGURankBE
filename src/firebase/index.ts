import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getDownloadURL, getMetadata, getStorage, listAll, ref, StorageReference, uploadBytes, uploadString } from 'firebase/storage';
import { collection, CollectionReference, doc, DocumentReference, Firestore, getDoc, getDocs, getFirestore, setDoc, query, where, DocumentData } from 'firebase/firestore';
import request from 'request';
import { IPoint } from '../interface/point';

const POINTS_COLLECTION = 'POINTS';
const FEEDBACKS_COLLECTION = 'FEEDBACKS';

class FireBaseClass {
  private firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  public static firebase:FirebaseApp = null;
  public static storage:FirebaseStorage = null;
  public static rootRef:StorageReference = null;
  public static db:Firestore = null;
  public static pointsColRef:CollectionReference = null;
  public static feedbacksColRef:CollectionReference = null;
  public static pointsDocRef:DocumentReference = null;

  constructor() {
    FireBaseClass.firebase = initializeApp(this.firebaseConfig);
    FireBaseClass.storage = getStorage(FireBaseClass.firebase);
    FireBaseClass.db = getFirestore(FireBaseClass.firebase);
    FireBaseClass.rootRef = ref(FireBaseClass.storage);
    FireBaseClass.pointsColRef = collection(FireBaseClass.db, POINTS_COLLECTION);
    FireBaseClass.feedbacksColRef = collection(FireBaseClass.db, FEEDBACKS_COLLECTION);
    FireBaseClass.pointsDocRef = doc(FireBaseClass.pointsColRef);
  }

  public static getFileByItemRef(itemRef: StorageReference) {
    return getMetadata(itemRef);
  }

  public static getAllFiles() {
    return listAll(this.rootRef);
  }

  public static getFileDataByRef(fileRef: StorageReference): Promise<string> {
    return getDownloadURL(fileRef).then((url) => {
      return new Promise((resolve, reject) => {
        request(url, (error, data) => {
          if(error) {
            return reject(error);
          }

          return resolve(data.body);
        });
      });
    });
  }

  public static getFileDataByName(fileName: string): Promise<string> {
    return getDownloadURL(ref(this.storage, fileName)).then((url) => {
      return new Promise((resolve, reject) => {
        request(url, (error, data) => {
          if(error) {
            return reject(error);
          }

          return resolve(data.body);
        });
      });
    });
  }

  public static uploadFileWithString(string: string, filename: string) {
    return uploadString(ref(this.storage, filename), string);
  }

  public static uploadFile(file: File | Blob, filename: string) {
    return uploadBytes(ref(this.storage, filename), file);
  }

  public static addItemToPointsCollection(docName: string, value: IPoint) {
    return setDoc(doc(this.pointsColRef, docName), value);
  }

  public static addItemToFeedbacksCollection(docName: string, value: any) {
    return setDoc(doc(this.feedbacksColRef, docName), value);
  }

  public static checkItemPointExist(docName: string): Promise<{ isExist: boolean, data: IPoint | null }> {
    return getDoc(doc(this.pointsColRef, docName)).then((docSnap) => {
      if(docSnap.exists()) {
        return {
          isExist: true,
          data: docSnap.data() as IPoint
        };
      }

      return {
        isExist: false,
        data: null
      };
    });
  }

  public static getApprovedPointNotAvailable(): Promise<Array<IPoint>> {
    const q = query(this.pointsColRef, 
      where('prefixId', '!=', ''),
      where('isApproved', '==', true), 
      where('isAvailable', '==', false), 
    );
    return getDocs(q).then((querySnapshot) => {
      const arr: Array<DocumentData> = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });

      return arr as IPoint[];
    });
  }

  public static getApprovedPointAvailable(): Promise<Array<IPoint>> {
    const q = query(this.pointsColRef, 
      where('prefixId', '!=', ''),
      where('isApproved', '==', true), 
      where('isAvailable', '==', true), 
    );
    return getDocs(q).then((querySnapshot) => {
      const arr: Array<DocumentData> = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });

      return arr as IPoint[];
    });
  }

  public static getAllPoints() {
    const q = query(this.pointsColRef);
    return getDocs(q).then((querySnapshot) => {
      const arr: Array<DocumentData> = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });

      return arr as IPoint[];
    });
  }
}

let firebaseClass;

if(
  !process.env.FIREBASE_API_KEY ||
  !process.env.FIREBASE_AUTH_DOMAIN ||
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_STORAGE_BUCKET ||
  !process.env.FIREBASE_MESSAGE_SENDER_ID ||
  !process.env.FIREBASE_APP_ID ||
  !process.env.FIREBASE_MEASUREMENT_ID
) {
  throw new Error('Please replace these value with your Firebase API');
} else {
  firebaseClass = new FireBaseClass();
}

export default FireBaseClass;
export {
  firebaseClass
};