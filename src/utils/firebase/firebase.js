// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
