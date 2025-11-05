"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/userContext";
import { ScrollContext } from "@/context/scrollContext";
import { RiFilmAiFill } from "react-icons/ri";
import { HiMiniFilm, HiMiniNewspaper } from "react-icons/hi2";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaAngleDown, FaAngleRight, FaSearch, FaUser } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import ImageLoader from "../loaders/imageLoader";
import Fallback from "@/assets/fallback.png";
import Logo from "@/assets/main_logo.png";
import Menu from "./menu";
import { MenuContext } from "@/context/menuContext";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { GiNinjaHead } from "react-icons/gi";
import { HiBell, HiOutlineSearch } from "react-icons/hi";
import UserNav from "./userNav";
import UserSearch from "../modals/userSearch";
import Ping from "./ping";
import { SocketContext } from "@/context/socketContext";



export default function NavBar() {
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);
  const { navHide, isScrolled } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef } = useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { postFetch } = useContext(PostContext);
  const [showUserNav, setShowUserNav] = useState(false);
  const [showPing, setShowPing] = useState(false);
  const { pings } = useContext(SocketContext);
  const router = useRouter();

  const isActive = (target) => {
    if (showUserNav) return "text-inherit";
    if (showPing) return "text-inherit";
    return pathname === target
      ? "text-[var(--color-accent)] border-b-1"
      : "text-inherit";
  };

  const handleHomeClick = async () => {
    if (pathname === "/") {
      setIsLoading(true);
      await postFetch();
      router.push("/");
      setIsLoading(false);
    } else {
      setIsLoading(true);
      router.push("/");
    }
  };

  const handleNavClick = async (loc) => {
    if (pathname === `/${loc}`) {
      router.push(`/${loc}`);
    } else {
      setIsLoading(true);
      router.push(`/${loc}`);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      {showMenu && <Menu />}
      {showUserNav && <UserNav setShowUserNav={setShowUserNav} />}
      {showPing && <Ping setShowPing={setShowPing} />}
      <div
        onClick={() => {
          setShowUserNav(false);
          setShowPing(false);
        }}
        className={`fixed flex justify-between px-2 sm:px-4 md:px-8 lg:px-16 py-8 w-full h-12 transition-colors duration-150 z-[70]  md:border-b border-gray-900 ${
          isScrolled ? "bg-[var(--color-panel)]" : "bg-[var(--color-secondary)]"
        } ${navHide ? "hidden" : "flex"}`}
      >
        <div className="flex items-center w-full">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu((prev) => !prev)}
            className="cursor-pointer "
          >
            <FaAngleRight
              className={`text-2xl transition-transform duration-300 md:hidden ${
                showMenu ? "rotate-180 text-accent" : "rotate-0"
              }`}
            />
          </button>
          <button onClick={handleHomeClick} className="cursor-pointer">
            <Image
              src={Logo}
              priority
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-24 h-auto"
            />
          </button>
        </div>
        <div className="flex items-center gap-3.5 sm:gap-7 w-fit">
          <button
            onClick={handleHomeClick}
            className={`flex flex-col flex-1 min-w-[25px] cursor-pointer items-center group ${isActive(
              "/"
            )}`}
          >
            <HiMiniNewspaper className="text-2xl group-hover:text-[var(--color-accent)]" />
            <p
              className={`text-xs group-hover:text-[var(--color-accent)] ${
                pathname === "/" && !showPing && !showUserNav
                  ? "text-accent"
                  : "text-[var(--color-text)]/60"
              }`}
            >
              Portal
            </p>
          </button>
          <button
            onClick={() => handleNavClick("hex")}
            className={`flex flex-col flex-1 min-w-[25px] cursor-pointer items-center group ${isActive(
              "/hex"
            )}`}
          >
            <RiFilmAiFill className="text-2xl group-hover:text-[var(--color-accent)]" />
            <p
              className={`text-xs group-hover:text-[var(--color-accent)] ${
                pathname === "/hex" && !showPing && !showUserNav
                  ? "text-accent"
                  : "text-[var(--color-text)]/60"
              }`}
            >
              Hex
            </p>
          </button>
          <button
            onClick={() => handleNavClick("citadel")}
            className={`flex flex-col flex-1 min-w-[25px] cursor-pointer items-center group ${isActive(
              "/citadel"
            )}`}
          >
            <IoChatbubbleEllipsesSharp className="group-hover:text-[var(--color-accent)] text-2xl" />
            <p
              className={`text-xs group-hover:text-[var(--color-accent)] ${
                pathname === "/citadel" && !showPing && !showUserNav 
                  ? "text-accent"
                  : "text-[var(--color-text)]/60"
              }`}
            >
              Citadel
            </p>
          </button>
          <button
            onClick={(e) => {
              setShowPing((prev) => !prev);
              setShowUserNav(false);
              e.stopPropagation();
            }}
            className="relative flex flex-col flex-1 min-w-[25px] cursor-pointer items-center group"
          >
            <p className="absolute right-0 -top-2 text-xs text-accent">
              {pings?.filter((p) => !p.isRead).length || null}
            </p>
            <HiBell
              className={`text-2xl cursor-pointer group-hover:text-[var(--color-accent)] ${
                showPing ? "text-accent" : "text-normal"
              }`}
            />
            <p
              className={`text-xs group-hover:text-[var(--color-accent)] ${
                showPing
                  ? "text-accent border-b-1"
                  : "text-[var(--color-text)]/60"
              }`}
            >
              Ping
            </p>
          </button>
          <button
            onClick={(e) => {
              setShowUserNav((prev) => !prev);

              setShowPing(false);
              e.stopPropagation();
            }}
            className="flex flex-col items-center cursor-pointer group flex-1 min-w-[25px] justify-center"
          >
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
                  className={`w-6 h-6 group-hover:border-[var(--color-accent)] border-1 rounded-full cursor-pointer ${
                    showUserNav ? "border-accent border-1" : "text-normal"
                  }`}
                />
              )
            ) : (
              <GiNinjaHead
                className={`text-2xl cursor-pointer group-hover:text-[var(--color-accent)] ${
                  showUserNav ? "text-accent" : "text-normal"
                }`}
              />
            )}
            <p
              className={`text-xs group-hover:text-[var(--color-accent)] ${
                showUserNav
                  ? "text-accent border-b-1"
                  : "text-[var(--color-text)]/60"
              }`}
            >
              You
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
