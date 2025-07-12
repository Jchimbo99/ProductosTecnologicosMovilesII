// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBZ34SH-dbg23uVZurcKrL9XzX9gGplf8",
  authDomain: "prueba-4d501.firebaseapp.com",
  databaseURL: "https://prueba-4d501-default-rtdb.firebaseio.com",
  projectId: "prueba-4d501",
  storageBucket: "prueba-4d501.firebasestorage.app",
  messagingSenderId: "341420298461",
  appId: "1:341420298461:web:42d6623d7a5336972c0b34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 export const auth = getAuth(app);
 export const db = getDatabase(app);