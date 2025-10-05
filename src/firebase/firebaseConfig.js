"use client";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const googleSignUp = async () => {
  try {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // 👇 Use redirect flow for mobile
      await signInWithRedirect(auth, provider);
    } else {
      // 👇 Use popup for desktop
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("Sign-in failed:", error);
    alert(`Login failed:\n${error.code}\n${error.message}`);
    return { user: null, token: null, error };
  }
};

// After redirect, handle result
export const handleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result) {
    const user = result.user;
    const token = await user.getIdToken(true);
    return { user, token, error: null };
  }
  return { user: null, token: null, error: null };
};

export { auth };
