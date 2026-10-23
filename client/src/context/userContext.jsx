"use client";
import { createContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import SignInModal from "@/components/modals/signInModal";
import { io } from "socket.io-client";

export const UserContext = createContext();

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

const socket = io.connect(`${BASE_URL}`);

export const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [adminBtn, setAdminBtn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchUserData = async (uid, currentFirebaseUser) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/userGet/${uid}`);
      const data = await res.json();

      setUser(data.result);
      setIsLogged(true);

      if (!currentFirebaseUser) {
        setAdminBtn(false);
        return;
      }

      const token = await currentFirebaseUser.getIdToken();

      const response = await fetch(`${BASE_URL}/api/admin/adminGet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      setAdminBtn(response.ok);
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
        await fetchUserData(firebaseUser.uid, firebaseUser);

        socket.emit("joinRoom", firebaseUser.uid);
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
        setAllUsers([]);
      } finally {
        setAllUsersLoading(false);
      }
    };

    fethAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLogged,
        user,
        setUser,
        firebaseUser,
        adminBtn,
        fetchUserData,
        setShowSignInModal,
        showSignInModal,
        allUsers,
        setAllUsers,
        allUsersLoading,
        loading,
        socket,
      }}
    >
      {children}
      {showSignInModal && <SignInModal />}
    </UserContext.Provider>
  );
};
