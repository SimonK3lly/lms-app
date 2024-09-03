// Firebase Credentials
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB9TOlQJucqSj1s5visJGRVJ2vqak4dJ3c",
    authDomain: "lms-app-2f048.firebaseapp.com",
    projectId: "lms-app-2f048",
    storageBucket: "lms-app-2f048.appspot.com",
    messagingSenderId: "993789287488",
    appId: "1:993789287488:web:ed0e88c670fe30296b13a5",
    measurementId: "G-117FJS5XYT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

