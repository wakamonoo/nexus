"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LoaderContext } from "./loaderContext";
import Swal from "sweetalert2";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [titles, setTitles] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const { setIsLoading } = useContext(LoaderContext);
  const [reviewToDelete, setReviewToDelete] = useState(null);

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

  const handleTitleDelete = async (titleId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/titles/deleteTitle/${titleId}`, {
        method: "DELETE",
      });
      setTitles((prev) => prev.filter((t) => t.titleId !== titleId));
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom",
        title: "Failed deleting title, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-fit !min-w-0 !max-w-none !inline-flex !items-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !py-2 !px-4",
          title: "!text-base !font-semibold !text-[var(--color-text)]",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom",
        title: "Tile have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-fit !min-w-0 !max-w-none !inline-flex !items-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !py-2 !px-4",
          title: "!text-base !font-semibold !text-[var(--color-text)]",
        },
      });
    }
  };

  return (
    <TitleContext.Provider
      value={{
        titles,
        pageLoad,
        handleTitleDelete,
        reviewToDelete,
        setReviewToDelete,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
