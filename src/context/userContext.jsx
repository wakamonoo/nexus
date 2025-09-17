"use client";
import { createContext, useState, useEffect, Children } from "react";
import { auth } from "@/firebase/firebaseConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null);
  const [adminBtn, setAdminBtn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (logged) => {
      setIsLogged(logged);
      if (logged) {
        try {
          const res = await fetch(
            `http://localhost:4000/api/users/userGet/${logged.uid}`
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
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ isLogged, user, adminBtn}}>
      {children}
    </UserContext.Provider>
  )
};
