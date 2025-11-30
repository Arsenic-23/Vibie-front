// src/utils/auth.js
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// LOGIN WITH GOOGLE
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: Date.now(),
    });
  }

  const profile = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  };

  localStorage.setItem("profile", JSON.stringify(profile));

  return profile;
}

// FOR STREAM AUTH
export async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  return await user.getIdToken(true);
}

// GET FIREBASE USER (SAFE, WAITING FOR AUTH INIT)
export async function getFirebaseUser() {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve, reject) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      if (user) resolve(user);
      else reject(new Error("No user"));
    });

    setTimeout(() => {
      try { unsub(); } catch (_) {}
      reject(new Error("auth timeout"));
    }, 3000);
  });
}
