"use client";
import { createContext, useContext, useState } from "react";
import { TitleContext } from "./titleContext";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
  const { titles } = useContext(TitleContext);
  const [isWatched, setIsWatched] = useState(null);
  const [watchInfo, setWatchInfo] = useState([]);

  const isWatchedFetch = async (userId, titleId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/watched/isWatchedGet?userId=${userId}&titleId=${titleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setIsWatched(data.result?.watched ?? false);
    } catch (err) {
      console.error("error fetching watched items:", err);
    }
  };

  const watchedInfoFetch = async (userId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/watched/watchedInfoGet?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setWatchInfo(data.result || []);
    } catch (err) {
      console.error("error fetching watched items:", err);
    }
  };

  const isTitleWatched = (titleId) => {
    return watchInfo.some((w) => w.titleId === titleId);
  };

  return (
    <WatchContext.Provider
      value={{
        isWatchedFetch,
        isWatched,
        watchedInfoFetch,
        watchInfo,
        isTitleWatched,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};
