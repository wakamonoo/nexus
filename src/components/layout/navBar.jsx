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
import { HiOutlineSearch } from "react-icons/hi";
import UserNav from "./userNav";
import UserSearch from "../modals/userSearch";

export default function NavBar() {
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);
  const { navHide, isScrolled } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef } = useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { postFetch } = useContext(PostContext);
  const [showUserNav, setShowUserNav] = useState(false);
  const router = useRouter();

  const isActive = (target) => {
    if (showUserNav) return "text-inherit";
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
      <div
        onClick={() => setShowUserNav(false)}
        className={`fixed flex justify-between px-4 py-8 w-full h-12 transition-colors duration-150 z-[70] ${
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
              className={`text-2xl transition-transform duration-300 ${
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
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleHomeClick}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/"
            )}`}
          >
            <HiMiniNewspaper className="text-2xl" />
            <p className="text-xs font-bold">Portal</p>
          </button>
          <button
            onClick={() => handleNavClick("mcu")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/mcu"
            )}`}
          >
            <RiFilmAiFill className="text-2xl" />
            <p className="text-xs font-bold">Hex</p>
          </button>
          <button
            onClick={() => handleNavClick("globalChat")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/globalChat"
            )}`}
          >
            <IoChatbubbleEllipsesSharp className="text-2xl" />
            <p className="text-xs font-bold">Citadel</p>
          </button>
          <button
            onClick={(e) => {
              setShowUserNav((prev) => !prev);
              e.stopPropagation();
            }}
            className={`flex flex-col items-center hover:text-[var(--color-accent)] cursor-pointer group flex-1 min-w-[30px] justify-center ${
              showUserNav ? "text-accent" : "text-normal"
            }`}
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
                    showUserNav ? "border-accent border-1" : ""
                  }`}
                />
              )
            ) : (
              <GiNinjaHead className="text-2xl cursor-pointer" />
            )}
            <p className="text-xs font-bold">You</p>
          </button>
        </div>
      </div>
    </>
  );
}
