"use client";
import { createContext, useState } from "react";
import Loader from "@/components/loader";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setIsLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
};
