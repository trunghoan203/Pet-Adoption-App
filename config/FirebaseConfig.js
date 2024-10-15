// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-app-53662.firebaseapp.com",
  projectId: "pet-adopt-app-53662",
  storageBucket: "pet-adopt-app-53662.appspot.com",
  messagingSenderId: "365689380928",
  appId: "1:365689380928:web:17816bce3a74dc92637fa5",
  measurementId: "G-5M9YLZ72WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
// const analytics = getAnalytics(app);