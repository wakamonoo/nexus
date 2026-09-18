"use client";
import { createContext, useRef, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);

  return (
    <MenuContext.Provider value={{ showMenu, setShowMenu, buttonRef}}>
    {children}
    </MenuContext.Provider>
  )
}