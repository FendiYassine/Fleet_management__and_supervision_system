import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: '__change this',
  authDomain: '__change this',
  databaseURL: '__change this',
  projectId: '__change this',
  storageBucket: '__change this',
  messagingSenderId: '__change this',
  appId: '__change this',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
