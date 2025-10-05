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
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // e.g. nexus-616.firebaseapp.com
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // e.g. nexus-616.appspot.com
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

// ✅ Trigger Google Sign-In
export const googleSignUp = async () => {
  try {
    if (isMobile) {
      console.log("📱 Mobile device detected — using redirect flow");
      await signInWithRedirect(auth, provider);
      // ⛔️ No return — user leaves the page
    } else {
      console.log("💻 Desktop detected — using popup flow");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      return { user, token, error: null };
    }
  } catch (error) {
    console.error("❌ Google sign-in failed:", error);
    return { user: null, token: null, error };
  }
};

// ✅ Handle Redirect Result (MUST run on page load)
export const handleRedirectLogin = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return { user: null, token: null, error: null };

    const user = result.user;
    const token = await user.getIdToken(true);
    console.log("✅ Redirect login successful:", user.email);
    return { user, token, error: null };
  } catch (error) {
    console.error("❌ Redirect login failed:", error);
    return { user: null, token: null, error };
  }
};

export { auth, provider };
