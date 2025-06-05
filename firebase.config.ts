import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  // Vos clés de configuration Firebase
  apiKey: "your-api-key",
  authDomain: "baye-zale-cutt.firebaseapp.com",
  projectId: "baye-zale-cutt",
  storageBucket: "baye-zale-cutt.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);