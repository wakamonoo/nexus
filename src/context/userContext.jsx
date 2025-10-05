"use client";
import { createContext, useState, useEffect } from "react";
import { auth, getRedirectResult } from "@/firebase/firebaseConfig";
import SignIn from "@/components/signIn";
import Swal from "sweetalert2";

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
      setAdminBtn(auth.currentUser?.email === "joven.serdanbataller21@gmail.com");
    } catch (err) {
      console.error("error fetching user data:", err);
      setUser(null);
      setIsLogged(false);
      setAdminBtn(false);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          const token = await user.getIdToken(true);

          await fetch(`${BASE_URL}/api/users/signup`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ token }),
          });

          await fetchUserData(user.uid);

          Swal.fire({
            title: "Success",
            text: "User login complete!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-hulk)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold !text-[var(--color-hulk)]",
              htmlContainer: "text-sm",
            },
          });
        }
      } catch (error) {
        if (error?.code !== "auth/no-auth-event") {
          console.error("Redirect login failed:", error);
          Swal.fire({
            title: "Error",
            text: `Failed: ${error.code} kindly try again!`,
            icon: "error",
            timer: 2000,
            showConfirmButton: true,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold !text-[var(--color-accent)]",
              htmlContainer: "text-sm",
            },
          });
        }
      }
    };

    handleRedirectResult();

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      }
      await delay(2000);
      setLoading(false);
    });

    return () => unsubscribe();
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
