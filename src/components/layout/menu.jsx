"use client";
import { useEffect, useRef, useContext } from "react";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";
import { ScrollContext } from "@/context/scrollContext";
import { MenuContext } from "@/context/menuContext";
import { useRouter } from "next/navigation";
import { RiContractFill } from "react-icons/ri";
import MenuStructure from "./menuStructure";

export default function Menu() {
  const divRef = useRef(null);
  const { navHide } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef } = useContext(MenuContext);
  const router = useRouter();

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

  return (
    <div
      ref={divRef}
      className={`z-[100] bg-accent inset-0 fixed left-0 w-[70%] h-screen top-16 px-4 py-8 transition-all duration-300 ${
        showMenu ? "translate-x-0" : "translate-x-[-100%]"
      } ${
        navHide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <MenuStructure />
    </div>
  );
}
