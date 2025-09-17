import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { MdChat, MdFeed } from "react-icons/md";
import { FaFilm, FaSearch, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function NavBar({ isScrolled }) {
  const router = useRouter();
  const { isLogged, user } = useContext(UserContext);

  return (
    <div
      className={`fixed flex gap-4 justify-between px-4 py-2 w-full h-12 transition-colors duration-150 z-[70] ${
        isScrolled ? "bg-[var(--color-panel)]" : "bg-[var(--color-secondary)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 onClick={() => router.push("/")} className="text-2xl text-accent">NEXUS</h1>
        <FaSearch className="text-2xl" />
      </div>
      <div className="flex items-center gap-4">
        <MdFeed onClick={() => router.push("/")} className="text-2xl" />
        <FaFilm onClick={() => router.push("/mcu")} className="text-2xl" />
        <MdChat className="text-2xl" />
        {isLogged && user?.picture ? (
          <Image
            src={user.picture}
            alt="user"
            width={0}
            height={0}
            sizes="100vw"
            className="w-8 rounded-full h-auto"
          />
        ) : (
          <FaUser className="text-2xl" />
        )}
      </div>
    </div>
  );
}
