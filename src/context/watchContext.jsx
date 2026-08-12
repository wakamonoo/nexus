"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { LoaderContext } from "./loaderContext";
import { UserContext } from "./userContext";
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

export const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
  const { setIsLoading } = useContext(LoaderContext);
  const { user } = useContext(UserContext);
  const [watchInfo, setWatchInfo] = useState([]);

  const watchedInfoFetch = async (userId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/watched/watchedInfoGet?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      setWatchInfo(data.result || []);
    } catch (err) {
      console.error("error fetching watched items:", err);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      watchedInfoFetch(user.uid);
    } else {
      setWatchInfo([]);
    }
  }, [user]);

  const getUserWatchedInfoFetch = async (userId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/watched/watchedInfoGet?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      return data.result || [];
    } catch (err) {
      console.error("error fetching watched items:", err);
      return [];
    }
  };

  const isTitleWatched = (titleId) => {
    return watchInfo.some((w) => w.titleId === titleId && w.watched === true);
  };

  const handleWatch = async (titleId) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/watched/watchRoute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.name,
          titleId,
        }),
      });

      await watchedInfoFetch(user.uid);
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Change not saved, please try again later!",
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
        title: `${
          isTitleWatched(titleId)
            ? "Title unwatched"
            : "Title marked as watched"
        }`,
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

  return (
    <WatchContext.Provider
      value={{
        getUserWatchedInfoFetch,
        isTitleWatched,
        handleWatch,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};
