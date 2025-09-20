import { useEffect, useRef, useContext } from "react";
import { FaInfo, FaLightbulb } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { ScrollContext } from "@/context/scrollContext";

export default function Menu({ setShowMenu, buttonRef }) {
  const divRef = useRef(null);
  const { navHide } = useContext(ScrollContext);

  useEffect(() => {
    const handleOutClick = (e) => {
      if (
        divRef.current &&
        !divRef.current.contains(e.target) &&
        (!buttonRef?.current ||
        !buttonRef.current.contains(e.target))
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
      className={`bg-accent inset-0 fixed left-0 w-[75%] h-screen top-16 p-8 transition-all duration-300 ${
        navHide ? "hidden" : "block"
      }`}
    >
      <div className="flex flex-col gap-2 items-start">
        <button className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300">
          <FaInfo className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            About
          </p>
        </button>
        <button className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300">
          <FaLightbulb className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Recommendations
          </p>
        </button>
        <button className="flex items-center cursor-pointer gap-4 hover:bg-[var(--color-text)] focus:bg-[var(--color-text)] group w-full p-4 rounded-full transition-all duration-300">
          <MdLogout className="text-2xl group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]" />
          <p className="text-base flex font-bold group-hover:text-[var(--color-accent)] group-focus:text-[var(--color-accent)]">
            Logout
          </p>
        </button>
      </div>
    </div>
  );
}
