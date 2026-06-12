// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfAAz6b0g7frOkbv2lNI8mKbEzZsLY8Ew",
  authDomain: "quickkart-c7286.firebaseapp.com",
  projectId: "quickkart-c7286",
  storageBucket: "quickkart-c7286.firebasestorage.app",
  messagingSenderId: "841977073445",
  appId: "1:841977073445:web:baae4c1a35444e9ce994cc",
  measurementId: "G-J5EMB370WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);