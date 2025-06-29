// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF5ijb0t68YRIsa_65vI9BLakdisVScsg",
  authDomain:"eventx-cb434.firebaseapp.com",
  projectId: "eventx-cb434",
  storageBucket: "eventx-cb434.firebasestorage.app",
  messagingSenderId: "875549144180",
  appId: "1:875549144180:web:3bc71862fea008de070d21",
  measurementId: "G-6MXQX4FR43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);