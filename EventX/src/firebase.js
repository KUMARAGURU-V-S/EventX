// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF5ijb0t68YRIsa_65vI9BLakdisVScsg",
  authDomain: "eventx-cb434.firebaseapp.com",
  projectId: "eventx-cb434",
  storageBucket: "eventx-cb434.appspot.com",
  messagingSenderId: "875549144180",
  appId: "1:875549144180:web:3bc71862fea008de070d21",
  measurementId: "G-6MXQX4FR43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
