// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATPtL3hwZqblJ0V9HLo5rrL2uuyI48QZM",
  authDomain: "fir-auth-f6d2a.firebaseapp.com",
  projectId: "fir-auth-f6d2a",
  storageBucket: "fir-auth-f6d2a.appspot.com",
  messagingSenderId: "692597935517",
  appId: "1:692597935517:web:9c53a8edb4c6bf91a57374"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);