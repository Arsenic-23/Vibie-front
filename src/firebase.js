import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjRbuM6-WgnVxZbpBxmf9W8VYbxKeqC8E",
  authDomain: "vibie-7886e.firebaseapp.com",
  projectId: "vibie-7886e",
  storageBucket: "vibie-7886e.firebasestorage.app",
  messagingSenderId: "782920025516",
  appId: "1:782920025516:web:176f713c9ae1498e3da609",
  measurementId: "G-GJZ755ENVS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
