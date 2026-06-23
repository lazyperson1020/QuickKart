import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfAAz6b0g7frOkbv2lNI8mKbEzZsLY8Ew",
  authDomain: "quickkart-c7286.firebaseapp.com",
  projectId: "quickkart-c7286",
  storageBucket: "quickkart-c7286.firebasestorage.app",
  messagingSenderId: "841977073445",
  appId: "1:841977073445:web:baae4c1a35444e9ce994cc",
  measurementId: "G-J5EMB370WZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
