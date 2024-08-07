// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwy-EHKxzKj4pYP1_HxWYt8GVdGB1AEg8",
  authDomain: "headstarter-project-2.firebaseapp.com",
  projectId: "headstarter-project-2",
  storageBucket: "headstarter-project-2.appspot.com",
  messagingSenderId: "522009545263",
  appId: "1:522009545263:web:08b7e5af58850aefe594da",
  measurementId: "G-T20262P26Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }