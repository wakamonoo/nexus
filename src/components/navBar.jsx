import Image from "next/image";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { MdChat, MdFeed } from "react-icons/md";
import { FaFilm, FaSearch, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ImageLoader from "./imageLoader";
import Fallback from "@/assets/fallback.png";

export default function NavBar({ isScrolled }) {
  const router = useRouter();
  const { isLogged, user, loading } = useContext(UserContext);

  return (
    <div
      className={`fixed flex gap-4 justify-between px-4 py-2 w-full h-12 transition-colors duration-150 z-[70] ${
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
        <MdFeed
          onClick={() => router.push("/")}
          className="text-2xl cursor-pointer"
        />
        <FaFilm
          onClick={() => router.push("/mcu")}
          className="text-2xl cursor-pointer"
        />
        <MdChat className="text-2xl cursor-pointer" />
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
              className="w-8 rounded-full h-auto cursor-pointer"
            />
          )
        ) : (
          <FaUser className="text-2xl cursor-pointer" />
        )}
      </div>
    </div>
  );
}
