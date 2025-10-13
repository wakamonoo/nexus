"use client";
import { useEffect, useRef, useContext } from "react";
import { FaBalanceScale, FaDonate, FaInfo, FaLightbulb } from "react-icons/fa";
import { FaFileShield } from "react-icons/fa6";
import { ScrollContext } from "@/context/scrollContext";
import { MenuContext } from "@/context/menuContext";
import { useRouter } from "next/navigation";
import { RiContractFill } from "react-icons/ri";

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
      <div className="flex flex-col gap-2 items-start">
        <button
          onClick={() => {
            router.push("/about");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaInfo className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            About
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/trustAndLegality");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaBalanceScale className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Trust & Legality
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/terms&Conditions");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <RiContractFill className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Terms & Conditions
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/privacyPolicy");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaFileShield className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Privacy Policy
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/recommendations");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaLightbulb className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Recommendations
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/heroFund");
            setShowMenu(false);
          }}
          className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300"
        >
          <FaDonate className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Hero Fund
          </p>
        </button>
      </div>
    </div>
  );
}
