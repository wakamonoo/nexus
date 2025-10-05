"use client";
import { createContext, useState, useEffect } from "react";
import { auth, handleRedirectLogin } from "@/firebase/firebaseConfig";
import SignIn from "@/components/signIn";

export const UserContext = createContext();

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [adminBtn, setAdminBtn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchUserData = async (uid) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/userGet/${uid}`);
      const data = await res.json();

      setUser(data.result);
      setIsLogged(true);
      setAdminBtn(
        auth.currentUser?.email === "joven.serdanbataller21@gmail.com"
      );
    } catch (err) {
      console.error("error fetching user data:", err);
      setUser(null);
      setIsLogged(false);
      setAdminBtn(false);
    }
  };

  // ✅ Handle Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      }
      await delay(1500);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Handle Redirect Login (mobile)
  useEffect(() => {
    const checkRedirectLogin = async () => {
      const { user, token, error } = await handleRedirectLogin();
      if (user && token) {
        console.log("Handling redirect login...");
        try {
          await fetch(`${BASE_URL}/api/users/signup`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ token }),
          });
          await fetchUserData(user.uid);
        } catch (err) {
          console.error("redirect signup error:", err);
        }
      }
    };
    checkRedirectLogin();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        user,
        adminBtn,
        loading,
        fetchUserData,
        setShowSignIn,
        showSignIn,
      }}
    >
      {children}
      {showSignIn && <SignIn />}
    </UserContext.Provider>
  );
};
