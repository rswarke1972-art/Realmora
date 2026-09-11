// auth.js

import { auth } from "./firebase.js";

import {
  signInAnonymously,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Login player anonymously
export async function loginPlayer() {
  try {
    const result = await signInAnonymously(auth);

    console.log("👑 Player Logged In");
    console.log("🆔 UID:", result.user.uid);

    return result.user;
  } catch (error) {
    console.error("❌ Login Error:", error);
  }
}

// Listen to auth state changes
export function watchPlayerAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("🟢 Authenticated:", user.uid);

      window.playerId = user.uid;
      callback(user);
    } else {
      console.log("🔴 No user logged in");
      callback(null);
    }
  });
}

// Logout player (future use)
export async function logoutPlayer() {
  try {
    await signOut(auth);
    console.log("👋 Player Logged Out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}