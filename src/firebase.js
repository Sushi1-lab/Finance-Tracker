// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA3XoYnEczSrbxEBOETCI8jNKHaFDKyG4",
  authDomain: "finance-e8fff.firebaseapp.com",
  projectId: "finance-e8fff",
  storageBucket: "finance-e8fff.firebasestorage.app",
  messagingSenderId: "94240937524",
  appId: "1:94240937524:web:3c87cce4b5f7c6bea51c61",
  measurementId: "G-S6MWJJ1Q4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

