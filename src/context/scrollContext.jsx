"use client";
import { useEffect, useState, createContext } from "react";

export const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHide, setNavHide] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > 300) {
        if (currentScrollY > lastScrollY) {
          setNavHide(true);
        } else {
          setNavHide(false);
        }
      } else {
        setNavHide(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <ScrollContext.Provider value={{ isScrolled, navHide }}>
      {children}
    </ScrollContext.Provider>
  );
};
