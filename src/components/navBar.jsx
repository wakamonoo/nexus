"use client";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { MdChat, MdFeed } from "react-icons/md";
import { FaFilm, FaSearch, FaUser } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import ImageLoader from "./imageLoader";
import Fallback from "@/assets/fallback.png";

export default function NavBar({ isScrolled }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogged, user, loading } = useContext(UserContext);

  const isActive = (target) =>
    pathname === target
      ? "text-[var(--color-accent)]  border-b-2"
      : "text-inherit";

  return (
    <div
      className={`fixed flex justify-between px-4 py-8 w-full h-12 transition-colors duration-150 z-[70] ${
        isScrolled ? "bg-[var(--color-panel)]" : "bg-[var(--color-secondary)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl text-accent cursor-pointer"
        >
          NEXUS
        </h1>
        <FaSearch className="text-2xl cursor-pointer" />
      </div>
      <div className="flex items-center gap-4">
        <div onClick={() => router.push("/")} 
          className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
            "/"
          )}`}
        >
          <MdFeed className="text-2xl" />
          <p className="text-xs font-bold">Pulse</p>
        </div>
        <div onClick={() => router.push("/mcu")}
          className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
            "/mcu"
          )}`}
        >
          <FaFilm className="text-2xl" />
          <p className="text-xs font-bold">Legacy</p>
        </div>
        <div onClick={() => router.push("/globalChat")}
          className={`flex flex-col flex-1 min-w-[30px] cursor-pointer items-center hover:text-[var(--color-accent)] ${isActive(
            "/globalChat"
          )}`}
        >
          <MdChat
            
            className="text-2xl"
          />
          <p className="text-xs font-bold">Citadel</p>
        </div>
        <div className="flex flex-1 min-w-[30px] justify-center">
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
        </div>
      </div>
    </div>
  );
}
