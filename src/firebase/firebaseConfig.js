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

const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

export const googleSignUp = async () => {
  try {
    if (isMobile) {
      await signInWithRedirect(auth, provider);
      const result = await getRedirectResult(auth);
      if (!result) return;
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    } else {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("signin failed:", error);
    return { user: null, token: null, error };
  }
};

export { auth };
