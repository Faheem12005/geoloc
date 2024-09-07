// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';// TODO: Add SDKs for Firebase products that you want to use
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import 'dotenv/config'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "geoloc-2f504.firebaseapp.com",
  projectId: "geoloc-2f504",
  storageBucket: "geoloc-2f504.appspot.com",
  messagingSenderId: "403225222655",
  appId: "1:403225222655:web:c4a1beb0193c25e0f15bca",
  measurementId: "G-JKCBRGW26J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore();
