// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl5_mUaN4m4NlUFnsGEIpWqGrgCDs9EtM",
  authDomain: "daily-work-tracker-7c1ad.firebaseapp.com",
  projectId: "daily-work-tracker-7c1ad",
  storageBucket: "daily-work-tracker-7c1ad.firebasestorage.app",
  messagingSenderId: "592772394980",
  appId: "1:592772394980:web:d698af6428987a5d3e61f1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
