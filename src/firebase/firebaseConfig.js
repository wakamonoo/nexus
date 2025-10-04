"use client";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

// Your Firebase config from .env.local
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

// Detect mobile
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

/**
 * 🔹 Trigger Google Sign-In
 */
export const googleSignUp = async () => {
  try {
    if (isMobile) {
      // Redirect-based login (mobile browsers block popups)
      await signInWithRedirect(auth, provider);
      return { redirecting: true };
    } else {
      // Popup-based login (desktop)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("Google Sign-In failed:", error);
    return { user: null, token: null, error };
  }
};

/**
 * 🔹 Handle Redirect Result (after returning from Google login)
 * Call this in a useEffect() in your login page component.
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null; // No redirect happened
    const user = result.user;
    const token = await user.getIdToken(true);
    return { user, token, error: null };
  } catch (error) {
    console.error("Redirect Sign-In failed:", error);
    return { user: null, token: null, error };
  }
};

export { auth };
