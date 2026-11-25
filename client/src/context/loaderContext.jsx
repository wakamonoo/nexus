"use client";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/loaders/loader";
import ActionLoader from "@/components/loaders/actionLoader";
import Splash from "@/components/loaders/splash";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const actionRequestIds = useRef(new Set());
  const [splashLoading, setSplashLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const startActionLoading = useCallback((requestId) => {
    if (actionRequestIds.current.has(requestId)) return false;

    actionRequestIds.current.add(requestId);
    setIsActionLoading(actionRequestIds.current.size > 0);
    return true;
  }, []);

  const finishActionLoading = useCallback((requestId) => {
    if (!actionRequestIds.current.delete(requestId)) return;

    setIsActionLoading(actionRequestIds.current.size > 0);
  }, []);

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
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isActionLoading,
        setIsActionLoading,
        startActionLoading,
        finishActionLoading,
        splashLoading,
      }}
    >
      {children}
      <Loader />
      <ActionLoader />
    </LoaderContext.Provider>
  );
};
