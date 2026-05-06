import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Replace these values with your Firebase project config
// Firebase Console → Project Settings → General → Your apps
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCKOiIzSIerxQJ3Hzk3K-igeBTaHrdSiFc",
  authDomain: "quiz-app-9bcbb.firebaseapp.com",
  databaseURL: "https://quiz-app-9bcbb-default-rtdb.firebaseio.com",
  projectId: "quiz-app-9bcbb",
  storageBucket: "quiz-app-9bcbb.firebasestorage.app",
  messagingSenderId: "925519358194",
  appId: "1:925519358194:web:60d1302cff9ec72aa3086b",
  measurementId: "G-JC5LHF93H0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const API_URL = 'http://localhost:3001/api';
