"use client";
import { createContext, useEffect, useState } from "react";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [listLoad, setListLoad] = useState(true);

  useEffect(() => {
    const handleGetLists = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/lists/listsGet`, {
          method: "GET",
        });

        const data = await res.json();

        setLists(data.result);
      } catch (err) {
        console.error("failed to fetch lists", err);
        setLists([]);
      } finally {
        setListLoad(false);
      }
    };
    handleGetLists();
  }, []);

  return (
    <ListContext.Provider
      value={{
        lists,
        setLists,
        listLoad,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
