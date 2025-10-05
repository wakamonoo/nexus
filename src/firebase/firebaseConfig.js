"use client";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // nexus-616.firebaseapp.com
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // nexus-616.appspot.com
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();

// ✅ Detect if running on mobile
const isMobile =
  typeof window !== "undefined" &&
  /Mobi|Android|iPhone/i.test(navigator.userAgent);

// ✅ Sign-in function (popup for desktop, redirect for mobile)
export const googleSignUp = async () => {
  try {
    if (isMobile) {
      console.log("Mobile device detected — using redirect flow");
      await signInWithRedirect(auth, provider);
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        const token = await user.getIdToken(true);
        return { user, token, error: null };
      } else {
        return { user: null, token: null, error: null };
      }
    } else {
      console.log("Desktop detected — using popup flow");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return { user: null, token: null, error };
  }
};

export { auth, provider };
