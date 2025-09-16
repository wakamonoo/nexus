"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import Hero from "../sections/hero";
import Main from "../sections/main.jsx";

export default function Page() {
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
    <>
      <Hero isLogged={isLogged} adminBtn={adminBtn} user={user} />

      <Main />
    </>
  );
}
