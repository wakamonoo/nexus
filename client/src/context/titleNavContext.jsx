"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { LoaderContext } from "./loaderContext";

export const TitleNavContext = createContext();

export const TitleNavProvider = ({ children }) => {
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const handleShowNav = (id) => {
    setIsLoading(true);
    router.push(`/hex/${id}`);
  };

  const handleShowListNav = (page) => {
    setIsLoading(true);
    router.push(`/hex/${page}`);
  };

  return (
    <TitleNavContext.Provider value={{ handleShowNav, handleShowListNav }}>
      {children}
    </TitleNavContext.Provider>
  );
};
