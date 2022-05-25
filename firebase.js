
import { initializeApp } from "firebase/app";
import { initializeFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0X--zBioVLq5paXTKKzqqCL6V564S_jE",
  authDomain: "parking-lot-management-5116b.firebaseapp.com",
  databaseURL: "https://parking-lot-management-5116b-default-rtdb.firebaseio.com",
  projectId: "parking-lot-management-5116b",
  storageBucket: "parking-lot-management-5116b.appspot.com",
  messagingSenderId: "255962890252",
  appId: "1:255962890252:web:e7bc4624cf965f34506e29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export { db };