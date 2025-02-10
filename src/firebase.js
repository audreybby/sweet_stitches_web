// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFbzXUqrbM4yxUaDrE4lkzY0G1T_kkD6k",
  authDomain: "sweet-stitches-website.firebaseapp.com",
  projectId: "sweet-stitches-website",
  storageBucket: "sweet-stitches-website.firebasestorage.app",
  messagingSenderId: "823983715814",
  appId: "1:823983715814:web:f6e478c6e78c69c6e29227",
  measurementId: "G-S8SFR2V32J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
const auth = getAuth(app);

  setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence enabled"))
  .catch(error => console.error("Persistence error:", error));

export {auth};