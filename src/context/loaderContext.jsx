"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/loader";
import { PostContext } from "./postContext";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { postFetch } = useContext(PostContext);
  const router = useRouter();
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (loading && pathname !== prevPath) {
      setLoading(false);
      setPrevPath(pathname);
    }
  }, [pathname, loading, prevPath]);

  const handleHomeClick = async () => {
    if (pathname === "/") {
      setLoading(true);
      await postFetch();
      router.push("/");
    } else {
      setLoading(true);
      router.push("/");
    }
  };

  const handleNavClick = async (loc) => {
    setLoading(true);
    router.push(`/${loc}`);
  };

  return (
    <LoaderContext.Provider value={{ handleHomeClick, handleNavClick }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
};
