"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LoaderContext } from "./loaderContext";
import Swal from "sweetalert2";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [titles, setTitles] = useState([]);
  const [releasedMCUTitles, setReleasedMCUTitles] = useState([]);
  const [releasedLegacyTitles, setReleasedLegacyTitles] = useState([])
  const [upcomingTitles, setUpcomingTitles] = useState([]);
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
        setReleasedMCUTitles(data.result.filter((t) => t.status === "released" && t.category === "mcu"));
        setReleasedLegacyTitles(data.result.filter((t) => t.status === "released" && t.category === "legacy"));
        setUpcomingTitles(data.result.filter((t) => t.status === "upcoming"));
      } catch (err) {
        console.error("failed to fetch titles", err);
        setTitles([]);
        setReleasedMCUTitles([]);
        setUpcomingTitles([]);
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
        position: "bottom-start",
        title: "Failed deleting title, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Tile have been deleted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    }
  };

  const latest = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);
  }, [releasedMCUTitles]);

  const chrono = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles].sort((a, b) => a.order - b.order);
  }, [releasedMCUTitles]);

  const release = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [releasedMCUTitles]);

  const goat = useMemo(() => {
    if (!titles) return;

    return [...titles]
      .filter((t) => t.totalPoints > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [titles]);

  const popular = useMemo(() => {
    if (!titles) return;

    return [...titles]
      .filter?.((t) => Array.isArray(t.watchCount) && t.watchCount.length > 0)
      .sort((a, b) => b.watchCount.length - a.watchCount.length);
  }, [titles]);

  return (
    <TitleContext.Provider
      value={{
        titles,
        releasedMCUTitles,
        releasedLegacyTitles,
        upcomingTitles,
        latest,
        chrono,
        release,
        goat,
        popular,
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
