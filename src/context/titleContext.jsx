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
  const [releasedLegacyTitles, setReleasedLegacyTitles] = useState([]);
  const [releasedAdjacentTitles, setReleasedAdjacentTitles] = useState([]);
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

        console.log("TOTAL TITLES:", data.result?.length);

        setTitles(data.result);

        setReleasedMCUTitles(
          data.result.filter(
            (t) => t.status === "released" && t.category === "mcu",
          ),
        );

        /*
         * ============================================
         * TEMPORARY DATE DEBUGGING
         * ============================================
         *
         * This does NOT change your sorting.
         *
         * It only checks released MCU titles and
         * reports titles whose applicable release date
         * is missing or invalid.
         */
        const invalidMCUDates = data.result.filter((title) => {
          if (
            title.status !== "released" ||
            title.category !== "mcu"
          ) {
            return false;
          }

          const date =
            title.mediaType === "tv"
              ? title.first_air_date
              : title.release_date;

          const timestamp = new Date(date).getTime();

          return (
            !date ||
            !Number.isFinite(timestamp)
          );
        });

        console.log(
          "============================================",
        );
        console.log(
          "INVALID RELEASE DATES - RELEASED MCU TITLES",
        );
        console.log(
          "============================================",
        );

        if (invalidMCUDates.length === 0) {
          console.log(
            "✅ NO INVALID MCU RELEASE DATES FOUND",
          );
        } else {
          console.log(
            `❌ FOUND ${invalidMCUDates.length} INVALID MCU DATE(S)`,
          );

          invalidMCUDates.forEach((title) => {
            console.log({
              title: title.title,
              titleId: title.titleId,
              mediaType: title.mediaType,
              first_air_date: title.first_air_date,
              release_date: title.release_date,
              status: title.status,
              category: title.category,
              tmdbId: title.tmdbId,
            });
          });
        }

        console.log(
          "============================================",
        );

        /*
         * Also print EVERY released MCU title with the
         * date currently being used for sorting.
         *
         * This lets us see exactly what JavaScript sees.
         */
        console.log(
          "RELEASED MCU TITLES + SORTING DATE:",
        );

        data.result
          .filter(
            (t) =>
              t.status === "released" &&
              t.category === "mcu",
          )
          .forEach((title) => {
            const date =
              title.mediaType === "tv"
                ? title.first_air_date
                : title.release_date;

            console.log({
              title: title.title,
              mediaType: title.mediaType,
              sortingDate: date,
              first_air_date: title.first_air_date,
              release_date: title.release_date,
              parsedTimestamp: new Date(date).getTime(),
            });
          });

        console.log(
          "============================================",
        );

        setReleasedLegacyTitles(
          data.result.filter(
            (t) =>
              t.status === "released" &&
              t.category === "legacy",
          ),
        );

        setReleasedAdjacentTitles(
          data.result.filter(
            (t) =>
              t.status === "released" &&
              t.category === "adjacent",
          ),
        );

        setUpcomingTitles(
          data.result.filter(
            (t) => t.status === "upcoming",
          ),
        );
      } catch (err) {
        console.error("failed to fetch titles", err);

        setTitles([]);
        setReleasedMCUTitles([]);
        setReleasedLegacyTitles([]);
        setReleasedAdjacentTitles([]);
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

      await fetch(
        `${BASE_URL}/api/titles/deleteTitle/${titleId}`,
        {
          method: "DELETE",
        },
      );

      setTitles((prev) =>
        prev.filter((t) => t.titleId !== titleId),
      );
    } catch (err) {
      console.error(err);

      Swal.fire({
        toast: true,
        position: "bottom-start",
        title:
          "Failed deleting title, please try again later!",
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
        title: "Title has been deleted!",
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

  const getReleaseDate = (title) => {
    return title.mediaType === "tv"
      ? title.first_air_date
      : title.release_date;
  };

  /*
   * ============================================
   * LATEST
   * ============================================
   *
   * ORIGINAL SORTING - NOT CHANGED
   */
  const latest = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles]
      .sort(
        (a, b) =>
          new Date(getReleaseDate(b)) -
          new Date(getReleaseDate(a)),
      )
      .slice(0, 15);
  }, [releasedMCUTitles]);

  /*
   * ============================================
   * CHRONOLOGICAL ORDER
   * ============================================
   */
  const chrono = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles].sort(
      (a, b) => a.order - b.order,
    );
  }, [releasedMCUTitles]);

  /*
   * ============================================
   * RELEASE ORDER
   * ============================================
   *
   * ORIGINAL SORTING - NOT CHANGED
   */
  const release = useMemo(() => {
    if (!releasedMCUTitles) return;

    return [...releasedMCUTitles].sort(
      (a, b) =>
        new Date(getReleaseDate(a)) -
        new Date(getReleaseDate(b)),
    );
  }, [releasedMCUTitles]);

  /*
   * ============================================
   * GOAT
   * ============================================
   */
  const goat = useMemo(() => {
    if (!titles) return;

    return [...titles]
      .filter((t) => t.totalPoints > 0)
      .sort(
        (a, b) =>
          b.totalPoints - a.totalPoints,
      );
  }, [titles]);

  /*
   * ============================================
   * POPULAR
   * ============================================
   */
  const popular = useMemo(() => {
    if (!titles) return;

    return [...titles]
      .filter?.(
        (t) =>
          Array.isArray(t.watchCount) &&
          t.watchCount.length > 0,
      )
      .sort(
        (a, b) =>
          b.watchCount.length -
          a.watchCount.length,
      );
  }, [titles]);

  return (
    <TitleContext.Provider
      value={{
        titles,
        releasedMCUTitles,
        releasedLegacyTitles,
        releasedAdjacentTitles,
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