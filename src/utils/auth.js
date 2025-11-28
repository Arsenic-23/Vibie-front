// src/utils/auth.js
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Store user in Firestore
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

  // Store in localStorage for your app layout
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
