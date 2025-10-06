"use client";
import { createContext, useState } from "react";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
  const [watchInfo, setWatchInfo] = useState([]);

  const watchFetch = async (userId, titleId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/watched/watchedGet?userId=${userId}&titleId=${titleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setWatchInfo(data.result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WatchContext.Provider value={{ watchFetch, watchInfo }}>
      {children}
    </WatchContext.Provider>
  );
};
