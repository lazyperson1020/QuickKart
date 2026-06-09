import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJIA7-fqrbo22r8NMiiEjOIGKu0tQVkfc",
  authDomain: "quickkart-76b4d.firebaseapp.com",
  projectId: "quickkart-76b4d",
  storageBucket: "quickkart-76b4d.firebasestorage.app",
  messagingSenderId: "293274003857",
  appId: "1:293274003857:web:4414e03a67183c112b5230",
  measurementId: "G-31KMZF29V2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);