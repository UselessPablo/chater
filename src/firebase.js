// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from '@firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLFO8abwTc08Gi7lGO2_HjTsQ4pnfbqig",
  authDomain: "react-chat-eb606.firebaseapp.com",
  projectId: "react-chat-eb606",
  storageBucket: "react-chat-eb606.appspot.com",
  messagingSenderId: "1037513021972",
  appId: "1:1037513021972:web:25e95cd753c0747e27e501"
};


 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);