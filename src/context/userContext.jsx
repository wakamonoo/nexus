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

  const fetchUserData = async (uid) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/userGet/${uid}`);
      const data = await res.json();

      setUser(data.result);
      setIsLogged(true);
      setAdminBtn(
        auth.currentUser.email === "joven.serdanbataller21@gmail.com"
      );
    } catch (err) {
      console.error("error fetching user data:", err);
      setUser(null);
      setIsLogged(false);
      setAdminBtn(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ isLogged, user, adminBtn, loading, fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
