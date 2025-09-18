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
      setLoading(true);
      
      try {
        if (!firebaseUser) {
          // User is logged out
          setUser(null);
          setIsLogged(false);
          setAdminBtn(false);
        } else {
          // User is logged in, fetch user data
          const res = await fetch(
            `${BASE_URL}/api/users/userGet/${firebaseUser.uid}`
          );
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          
          // Set all user-related state together
          setUser(data.result);
          setIsLogged(true);
          setAdminBtn(firebaseUser.email === "joven.serdanbataller21@gmail.com");
          setRefresh((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        // On error, treat as logged out
        setUser(null);
        setIsLogged(false);
        setAdminBtn(false);
      } finally {
        // Only set loading to false after ALL operations are complete
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Helper function to trigger a manual refresh of user data
  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/users/userGet/${currentUser.uid}`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setUser(data.result);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        console.error("Error refreshing user data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{ 
        isLogged, 
        user, 
        adminBtn, 
        loading, 
        refresh,
        refreshUserData 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};