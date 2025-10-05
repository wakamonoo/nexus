"use client";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

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
provider.setCustomParameters({
  prompt: "select_account",
});

// Detect if the device is mobile
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Google Sign-Up function (popup on desktop, redirect on mobile)
export const googleSignUp = async () => {
  try {
    if (isMobileDevice()) {
      // Mobile browsers → redirect flow
      await signInWithRedirect(auth, provider);
      return { user: null, token: null, error: null, redirecting: true };
    } else {
      // Desktop browsers → popup flow
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null, redirecting: false };
    }
  } catch (error) {
    console.error("signin failed:", error);
    return { user: null, token: null, error, redirecting: false };
  }
};

// Handle redirect result after user returns from Google
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
    return { user: null, token: null, error: null };
  } catch (error) {
    console.error("redirect sign-in failed:", error);
    return { user: null, token: null, error };
  }
};

export { auth };
