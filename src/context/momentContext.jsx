"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LoaderContext } from "./loaderContext";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export const MomentContext = createContext();

export const MomentProvider = ({ children }) => {
  const [moments, setMoments] = useState([]);
  const [momentLoading, setMomentLoading] = useState(true);

  useEffect(() => {
    const momentFetch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/moments/momentGet`);
        const data = await res.json();
        setMoments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setMomentLoading(false);
      }
    };

    momentFetch();
  }, []);

  return (
    <MomentContext.Provider value={{ moments, setMoments, momentLoading }}>
      {children}
    </MomentContext.Provider>
  );
};
