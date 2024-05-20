import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBCw06q_uCE7oheJEquse49sClINCW1-lI',
  authDomain: 'fir-test-364d7.firebaseapp.com',
  databaseURL: 'https://fir-test-364d7-default-rtdb.firebaseio.com',
  projectId: 'fir-test-364d7',
  storageBucket: 'fir-test-364d7.appspot.com',
  messagingSenderId: '842960228253',
  appId: '1:842960228253:web:88e9f47662f633f14f2974',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
