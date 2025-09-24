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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleNavigate = (id) => {
    setLoading(true);
    router.push(`/mcu/${id}`);
  };

  const handleMainBack = () => {
    setLoading(true);
    router.push("/mcu");
  };

  const handleTitleNav = (page) => {
    setLoading(true);
    router.push(`/mcu/${page}`);
  };

  return (
    <TitleContext.Provider
      value={{
        titles,
        loading,
        pageLoad,
        setLoading,
        handleNavigate,
        handleMainBack,
        handleTitleNav,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
