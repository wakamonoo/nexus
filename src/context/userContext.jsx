"use client";
import { createContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";

export const UserContext = createContext();

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null);
  const [adminBtn, setAdminBtn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      try {
        if (!firebaseUser) {
          setUser(null);
          setIsLogged(false);
          setAdminBtn(false);
          return;
        } else {
          const res = await fetch(
            `${BASE_URL}/api/users/userGet/${firebaseUser.uid}`
          );
          const data = await res.json();

          setUser(data.result);
          setIsLogged(true);
          setAdminBtn(
            firebaseUser.email === "joven.serdanbataller21@gmail.com"
          );
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await refreshUserData();
        }
      } catch (err) {
        console.error("error fetching user data:", err);
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/users/userGet/${currentUser.uid}`
        );
        const data = await res.json();
        setUser(data.result);
      } catch (err) {
        console.error("error refreshing data:", err);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{ isLogged, user, adminBtn, loading, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
