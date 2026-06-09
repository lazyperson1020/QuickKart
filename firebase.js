import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJIA7-fqrbo22r8NMiiEjOIGKu0tQVkfc",
  authDomain: "quickkart-76b4d.firebaseapp.com",
  projectId: "quickkart-76b4d",
  storageBucket: "quickkart-76b4d.firebasestorage.app",
  messagingSenderId: "293274003857",
  appId: "1:293274003857:web:4414e03a67183c112b5230",
  measurementId: "G-31KMZF29V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);