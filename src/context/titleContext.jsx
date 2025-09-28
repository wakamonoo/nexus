"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [titles, setTitles] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    const handleGetTitles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/titles/titleGet`, {
          method: "GET",
        });

        const data = await res.json();
        setTitles(data.result);
      } catch (err) {
        console.error("failed to fetch titles", err);
        setTitles([]);
      } finally {
        setPageLoad(false);
      }
    };

    handleGetTitles();
  }, []);

  return (
    <TitleContext.Provider
      value={{
        titles,
        pageLoad,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
