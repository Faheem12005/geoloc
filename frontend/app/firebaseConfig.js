// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZYWiUi2x_hHaqcR1IIXuMe_GRP7Yp3vI",
  authDomain: "geoloc-2f504.firebaseapp.com",
  projectId: "geoloc-2f504",
  storageBucket: "geoloc-2f504.appspot.com",
  messagingSenderId: "403225222655",
  appId: "1:403225222655:web:c4a1beb0193c25e0f15bca",
  measurementId: "G-JKCBRGW26J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app)
