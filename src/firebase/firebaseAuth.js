// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAyNV41r0NQbnaRFJfNvt1cbXFmDKzx5Q",
  authDomain: "beyond-bruno.firebaseapp.com",
  projectId: "beyond-bruno",
  storageBucket: "beyond-bruno.appspot.com",
  messagingSenderId: "898940656285",
  appId: "1:898940656285:web:0835127acfcb4366b5d274",
  measurementId: "G-P7S2RNXWVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db, app}

