import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB9TOlQJucqSj1s5visJGRVJ2vqak4dJ3c",
    authDomain: "lms-app-2f048.firebaseapp.com",
    projectId: "lms-app-2f048",
    storageBucket: "lms-app-2f048.appspot.com",
    messagingSenderId: "993789287488",
    appId: "1:993789287488:web:ed0e88c670fe30296b13a5",
    measurementId: "G-117FJS5XYT",
    googleClientId: "811664410630-7fg7b4scipk7d8pdbo5kgaoo1rnqgnt7.apps.googleusercontent.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export { db, auth };