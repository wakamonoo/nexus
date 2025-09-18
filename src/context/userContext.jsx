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
    const unsubscribe = auth.onAuthStateChanged(async (logged) => {
      setIsLogged(!!logged);
      if (logged) {
        try {
          const res = await fetch(
            `${BASE_URL}/api/users/userGet/${logged.uid}`
          );
          const resData = await res.json();
          setUser(resData.result);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(null);
      }
      if (logged && logged.email === "joven.serdanbataller21@gmail.com") {
        setAdminBtn(true);
      } else {
        setAdminBtn(false);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ isLogged, user, adminBtn, loading }}>
      {children}
    </UserContext.Provider>
  );
};
