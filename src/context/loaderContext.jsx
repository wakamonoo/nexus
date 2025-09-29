"use client";
import { createContext, useEffect, useState } from "react";
import Loader from "@/components/loader";
import Splash from "@/components/splash";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaderFlag = sessionStorage.getItem("hasLoaded");
    if (!loaderFlag) {
      setSplashLoading(true);
      const timer = setTimeout(() => {
        setSplashLoading(false);
        setInitialized(true);
        sessionStorage.setItem("hasLoaded", "true");
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setSplashLoading(false);
      setInitialized(true);
    }
  }, [setSplashLoading]);

  if (!initialized || splashLoading) {
    return <Splash />;
  }

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading, splashLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
};
