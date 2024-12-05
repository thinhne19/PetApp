// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "demomyapp-3e05d.firebaseapp.com",
  projectId: "demomyapp-3e05d",
  storageBucket: "demomyapp-3e05d.firebasestorage.app",
  messagingSenderId: "49123136113",
  appId: "1:49123136113:web:33599b1d93ad343b6381d0",
  measurementId: "G-QT2GZZRTCR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
