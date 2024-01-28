// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCnnY5sw6mHs9plBTyNvedMiq4YxTMaskI",
    authDomain: "pftreact.firebaseapp.com",
    projectId: "pftreact",
    storageBucket: "pftreact.appspot.com",
    messagingSenderId: "790640878337",
    appId: "1:790640878337:web:bb094c63328af13e897100",
    measurementId: "G-NREM3RLWS7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { db, auth, provider, doc, setDoc }