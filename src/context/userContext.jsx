"use client";
import { createContext, useState, useEffect } from "react";
import { auth, handleRedirectResult } from "@/firebase/firebaseConfig";
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
    const handleAuth = async () => {
      // Handle redirect result for mobile users
      const redirectResult = await handleRedirectResult();
      if (redirectResult?.user && redirectResult?.token) {
        try {
          // Complete the backend signup
          await fetch(`${BASE_URL}/api/users/signup`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              token: redirectResult.token,
            }),
          });
          
          await fetchUserData(redirectResult.user.uid);
          
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
        } catch (err) {
          console.error("Backend signup error:", err);
          Swal.fire({
            title: "Error",
            text: "Internal error, kindly try again!",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
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
        setLoading(false);
        return;
      } else if (redirectResult?.error) {
        Swal.fire({
          title: "Error",
          text: "Login attempt failed, kindly try again!",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
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
    };

    handleAuth();

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

    return () => {
      unsubscribe();
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