import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDrSyGZcbGbiy99WAzF2QVl3XylRTxpPFI",
  authDomain: "sharon-paz.firebaseapp.com",
  projectId: "sharon-paz",
  storageBucket: "sharon-paz.firebasestorage.app",
  messagingSenderId: "349367723940",
  appId: "1:349367723940:web:0a35cd923c58044c0a4331"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Firebase Storage
export const db = getFirestore(app);  // Firestore
export const storage = getStorage(app);  // Firebase Storage
