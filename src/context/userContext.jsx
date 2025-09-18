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

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${BASE_URL}/api/users/userGet/${firebaseUser.uid}`
        );
        const data = await res.json();

        setUser(data.result);
        setIsLogged(true);
        setAdminBtn(firebaseUser.email === "joven.serdanbataller21@gmail.com");
        setRefresh((prev) => prev + 1);
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

  return (
    <UserContext.Provider
      value={{ isLogged, user, adminBtn, loading, refresh }}
    >
      {children}
    </UserContext.Provider>
  );
};
