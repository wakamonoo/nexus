"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { ScrollContext } from "@/context/scrollContext";
import { RiFilmAiFill } from "react-icons/ri";
import { HiMiniNewspaper } from "react-icons/hi2";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import ImageLoader from "../../loaders/imageLoader";
import Avatar from "@/assets/defaultAvatar.png";
import Logo from "@/assets/main_logo.png";
import Menu from "./menu";
import { MenuContext } from "@/context/menuContext";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { GiNinjaHead } from "react-icons/gi";
import { HiBell } from "react-icons/hi";
import Ping from "./ping";
import { SocketContext } from "@/context/socketContext";
import UserOptions from "@/components/options/userOptions";

export default function NavBar() {
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);
  const { navHide, isScrolled } = useContext(ScrollContext);
  const { showMenu, setShowMenu, buttonRef, userOptRef } =
    useContext(MenuContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { postFetch } = useContext(PostContext);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showPing, setShowPing] = useState(false);
  const { pings, messages, latestSeenMessages } = useContext(SocketContext);
  const router = useRouter();

  const isActive = (target) => {
    if (showUserOptions) return "text-inherit";
    if (showPing) return "text-inherit";
    return pathname === target
      ? "text-(--color-accent) border-b-1"
      : "text-inherit";
  };

  const latestSeenMessageId = latestSeenMessages?.[user?.uid]?.messageId;

  const latestSeenIndex = messages?.findIndex(
    (m) => m.msgId === latestSeenMessageId,
  );

  const unReadCitadelCount =
    latestSeenIndex === -1
      ? messages.filter((m) => m.senderId !== user?.uid).length
      : messages
          .slice(latestSeenIndex + 1)
          .filter((m) => m.senderId !== user?.uid).length;

  const handleHomeClick = async () => {
    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
        onClick={() => {
          setShowUserOptions(false);
          setShowPing(false);
        }}
        className={`fixed flex justify-between px-2 sm:px-4 md:px-8 lg:px-16 py-8 w-full h-12 transition-colors duration-150 z-70  md:border-b border-gray-900 ${
          isScrolled ? "bg-(--color-panel)" : "bg-(--color-secondary)"
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
            className={`flex flex-col flex-1 min-w-6.25 cursor-pointer items-center group ${isActive(
              "/",
            )}`}
          >
            <HiMiniNewspaper className="text-2xl group-hover:text-(--color-accent)" />
            <p
              className={`text-xs group-hover:text-(--color-accent) ${
                pathname === "/" && !showPing && !showUserOptions
                  ? "text-accent"
                  : "text-(--color-text)/60"
              }`}
            >
              Portal
            </p>
          </button>
          <button
            onClick={() => handleNavClick("hex")}
            className={`flex flex-col flex-1 min-w-6.25 cursor-pointer items-center group ${isActive(
              "/hex",
            )}`}
          >
            <RiFilmAiFill className="text-2xl group-hover:text-(--color-accent)" />
            <p
              className={`text-xs group-hover:text-(--color-accent) ${
                pathname === "/hex" && !showPing && !showUserOptions
                  ? "text-accent"
                  : "text-(--color-text)/60"
              }`}
            >
              Hex
            </p>
          </button>
          <button
            onClick={() => handleNavClick("citadel")}
            className={`relative flex flex-col flex-1 min-w-6.25 cursor-pointer items-center group ${isActive(
              "/citadel",
            )}`}
          >
            {unReadCitadelCount > 0 && user && (
              <p className="absolute right-0 -top-2 text-xs text-accent">
                {unReadCitadelCount}
              </p>
            )}
            <IoChatbubbleEllipsesSharp className="group-hover:text-(--color-accent) text-2xl" />
            <p
              className={`text-xs group-hover:text-(--color-accent) ${
                pathname === "/citadel" && !showPing && !showUserOptions
                  ? "text-accent"
                  : "text-(--color-text)/60"
              }`}
            >
              Citadel
            </p>
          </button>
          <button
            onClick={(e) => {
              setShowPing((prev) => !prev);
              setShowUserOptions(false);
              e.stopPropagation();
            }}
            className="relative flex flex-col flex-1 min-w-6.25 cursor-pointer items-center group"
          >
            <p className="absolute right-0 -top-2 text-xs text-accent">
              {pings?.filter((p) => !p.isRead).length || null}
            </p>
            <HiBell
              className={`text-2xl cursor-pointer group-hover:text-(--color-accent) ${
                showPing ? "text-accent" : "text-normal"
              }`}
            />
            <p
              className={`text-xs group-hover:text-(--color-accent) ${
                showPing ? "text-accent border-b" : "text-(--color-text)/60"
              }`}
            >
              Ping
            </p>
          </button>
          <button
            ref={userOptRef}
            onClick={(e) => {
              setShowUserOptions((prev) => !prev);
              setShowPing(false);
              e.stopPropagation();
            }}
            className="flex flex-col items-center cursor-pointer group flex-1 min-w-6.25 justify-center"
          >
            {isLogged && user?.picture ? (
              loading ? (
                <ImageLoader />
              ) : (
                <img
                  src={user.picture || Avatar.src}
                  alt={user.name}
                  loading="lazy"
                  decoding="async"
                  className={`w-6 h-6 group-hover:border-(--color-accent) border rounded-full cursor-pointer ${
                    showUserOptions ? "border-accent border" : "text-normal"
                  }`}
                />
              )
            ) : (
              <GiNinjaHead
                className={`text-2xl cursor-pointer group-hover:text-(--color-accent) ${
                  showUserOptions ? "text-accent" : "text-normal"
                }`}
              />
            )}
            <p
              className={`text-xs group-hover:text-(--color-accent) ${
                showUserOptions
                  ? "text-accent border-b"
                  : "text-(--color-text)/60"
              }`}
            >
              You
            </p>
          </button>
        </div>
      </div>
      {showMenu && <Menu />}
      {showUserOptions && (
        <UserOptions
          setShowUserOptions={setShowUserOptions}
          userOptRef={userOptRef}
        />
      )}
      {showPing && <Ping setShowPing={setShowPing} />}
    </>
  );
}
