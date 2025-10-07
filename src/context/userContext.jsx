"use client";
import { createContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import SignIn from "@/components/signIn";
import Loader from "@/components/loader";
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
  const [userLoading, setUserLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const router = useRouter();
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
      setUserLoading(true);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      }
      await delay(2000);
      setUserLoading(false);
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
            "Content-Type": "appplication/type",
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

  const handleProfileNav = (userId) => {
    router.push(`/profile/${userId}`);
    setUserLoading(true);
  };

  return (
    <UserContext.Provider
      value={{
        isLogged,
        user,
        adminBtn,
        fetchUserData,
        setShowSignIn,
        showSignIn,
        allUsers,
        handleProfileNav,
        setUserLoading,
      }}
    >
      {children}
      {showSignIn && <SignIn />}
      {userLoading && <Loader />}
    </UserContext.Provider>
  );
};
