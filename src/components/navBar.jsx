import Image from "next/image";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { MdChat, MdFeed } from "react-icons/md";
import { FaFilm, FaSearch, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function NavBar({ isScrolled }) {
  const router = useRouter();
  const { isLogged, user, loading, updateTrigger } = useContext(UserContext);

  // optional: react to user update
  useEffect(() => {
    if (user) {
      console.log("NavBar detected user update:", user);
    }
  }, [updateTrigger]);

  if (loading) return null; // or <Loader /> if you want spinner in navbar

  return (
    <div
      className={`fixed flex gap-4 justify-between px-4 py-2 w-full h-12 transition-colors duration-150 z-[70] ${
        isScrolled ? "bg-[var(--color-panel)]" : "bg-[var(--color-secondary)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 onClick={() => router.push("/")} className="text-2xl text-accent cursor-pointer">NEXUS</h1>
        <FaSearch className="text-2xl cursor-pointer" />
      </div>
      <div className="flex items-center gap-4">
        <MdFeed onClick={() => router.push("/")} className="text-2xl cursor-pointer" />
        <FaFilm onClick={() => router.push("/mcu")} className="text-2xl cursor-pointer" />
        <MdChat className="text-2xl cursor-pointer" />
        {isLogged && user?.picture ? (
          <Image
            src={user.picture}
            alt="user"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
          />
        ) : (
          <FaUser className="text-2xl cursor-pointer" />
        )}
      </div>
    </div>
  );
}
