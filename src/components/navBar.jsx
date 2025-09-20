"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/userContext";
import { ScrollContext } from "@/context/scrollContext";
import { MdChat, MdFeed, MdMenu } from "react-icons/md";
import { FaAngleRight, FaFilm, FaSearch, FaUser } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import ImageLoader from "./imageLoader";
import Fallback from "@/assets/fallback.png";
import Logo from "@/assets/main_logo.png";
import Menu from "./menu";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);
  const { navHide, isScrolled } = useContext(ScrollContext);
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef(null);

  const isActive = (target) =>
    pathname === target
      ? "text-[var(--color-accent)] border-b-1"
      : "text-inherit";

  return (
    <>
      <div
        className={`fixed flex justify-between px-4 py-8 w-full h-12 transition-colors duration-150 z-[70] ${
          isScrolled ? "bg-[var(--color-panel)]" : "bg-[var(--color-secondary)]"
        } ${navHide ? "hidden" : "flex"}`}
      >
        <div className="flex items-center">
          <button
          ref={buttonRef}
            onClick={() => setShowMenu((prev) => !prev)}
            className="cursor-pointer "
          >
            <FaAngleRight
              className={`text-2xl transition-transform duration-300 ${
                showMenu ? "rotate-180 text-accent" : "rotate-0"
              }`}
            />
          </button>
          <button onClick={() => router.push("/")} className="cursor-pointer">
            <Image
              src={Logo}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-24 h-auto"
            />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/"
            )}`}
          >
            <MdFeed className="text-2xl" />
            <p className="text-xs font-bold">Pulse</p>
          </button>
          <button
            onClick={() => router.push("/mcu")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/mcu"
            )}`}
          >
            <FaFilm className="text-2xl" />
            <p className="text-xs font-bold">Legacy</p>
          </button>
          <button
            onClick={() => router.push("/globalChat")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/globalChat"
            )}`}
          >
            <MdChat className="text-2xl" />
            <p className="text-xs font-bold">Citadel</p>
          </button>
          <button className="flex flex-1 min-w-[30px] justify-center">
            {isLogged && user?.picture ? (
              loading ? (
                <ImageLoader />
              ) : (
                <Image
                  src={user.picture || Fallback}
                  alt="user"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-10 rounded-full h-auto cursor-pointer"
                />
              )
            ) : (
              <FaUser className="text-2xl cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      {showMenu && <Menu setShowMenu={setShowMenu} buttonRef={buttonRef} />}
    </>
  );
}
