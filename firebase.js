import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlb8LPp4rg_yoRfe0zMF4JLkaZuL3l4Lk",
  authDomain: "ship-it-aafd7.firebaseapp.com",
  projectId: "ship-it-aafd7",
  storageBucket: "ship-it-aafd7.appspot.com",
  messagingSenderId: "44873209771",
  appId: "1:44873209771:web:db6d7d11629bc85ce0a4ee",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
