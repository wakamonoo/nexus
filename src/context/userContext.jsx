"use client";
import { createContext, useState, useEffect } from "react";
import { auth, handleRedirectResult } from "@/firebase/firebaseConfig";
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
      console.error("Error fetching user data:", err);
      setUser(null);
      setIsLogged(false);
      setAdminBtn(false);
    }
  };

  useEffect(() => {
    let unsubscribe;

    const initAuth = async () => {
      setLoading(true);

      try {
        // First handle redirect results (for mobile)
        const redirectResult = await handleRedirectResult();
        if (redirectResult?.user) {
          await fetchUserData(redirectResult.user.uid);
          setLoading(false);
          return;
        }

        // Then listen for normal auth changes
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            await fetchUserData(firebaseUser.uid);
          } else {
            setUser(null);
            setIsLogged(false);
            setAdminBtn(false);
          }

          await delay(1000); // small delay for smooth loading
          setLoading(false);
        });
      } catch (err) {
        console.error("Auth init error:", err);
        setLoading(false);
      }
    };

    initAuth();

    // Proper cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
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
