// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5jD58u6X8GOtH58VxB1EztdJEpNAXB50",
  authDomain: "realmora-3ec8c.firebaseapp.com",
  projectId: "realmora-3ec8c",
  storageBucket: "realmora-3ec8c.firebasestorage.app",
  messagingSenderId: "1056480211016",
  appId: "1:1056480211016:web:39a97f0f959bae8ef4e87d",
  measurementId: "G-46Q7DXLS3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Anonymous login

// Export Firebase
export {
  db,
  auth,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  increment
};