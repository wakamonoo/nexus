"use client";
import { createContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import SignIn from "@/components/modals/signIn";
import Loader from "@/components/loaders/loader";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
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
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
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

  useEffect(() => {
    const fethAllUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/allUsersGet`, {
          method: "GET",
          headers: {
            "Content-Type": "appplication/json",
          },
        });
        const data = await res.json();
        setAllUsers(data.result);
      } catch (err) {
        console.error(err);
      }
    };

    fethAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        user,
        firebaseUser,
        adminBtn,
        fetchUserData,
        setShowSignIn,
        showSignIn,
        allUsers,
        loading,
      }}
    >
      {children}
      {showSignIn && <SignIn />}
    </UserContext.Provider>
  );
};
