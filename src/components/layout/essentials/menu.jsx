"use client";
import { useEffect, useRef, useContext } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { MenuContext } from "@/context/menuContext";
import MenuStructure from "./menuStructure";

export default function Menu() {
  const divRef = useRef(null);
  const { navHide } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef } = useContext(MenuContext);

  useEffect(() => {
    const handleOutClick = (e) => {
      if (
        divRef.current &&
        !divRef.current.contains(e.target) &&
        (!buttonRef?.current || !buttonRef.current.contains(e.target))
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutClick);
    return () => document.removeEventListener("mousedown", handleOutClick);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e) => {
      if (e.matches) {
        setShowMenu(false);
      }
    };

    if (mediaQuery.matches) {
      setShowMenu(false);
    }

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [setShowMenu]);

  return (
    <div
      onClick={() => setShowMenu(false)}
      className={`inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed ${
        navHide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        ref={divRef}
        className={`bg-second inset-0 absolute left-0 top-16 w-72 h-screen  p-4 transition-all duration-300 border-t-1 border-panel ${
          showMenu ? "translate-x-0" : "translate-x-[-100%]"
        } ${
          navHide
            ? "translate-x-[-100%] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <MenuStructure />
      </div>
    </div>
  );
}
