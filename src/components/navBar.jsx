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
import { MenuContext } from "@/context/menuContext";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";

export default function NavBar() {
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);
  const { navHide, isScrolled } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef } = useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { postFetch } = useContext(PostContext);
  const router = useRouter();

  const isActive = (target) =>
    pathname === target
      ? "text-[var(--color-accent)] border-b-1"
      : "text-inherit";

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
        <div className="flex items-center gap-4">
          <button
            onClick={handleHomeClick}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/"
            )}`}
          >
            <MdFeed className="text-2xl" />
            <p className="text-xs font-bold">Portal</p>
          </button>
          <button
            onClick={() => handleNavClick("mcu")}
            className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
              "/mcu"
            )}`}
          >
            <FaFilm className="text-2xl" />
            <p className="text-xs font-bold">Hex</p>
          </button>
          <button
            onClick={() => handleNavClick("globalChat")}
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
      {showMenu && <Menu />}
    </>
  );
}
