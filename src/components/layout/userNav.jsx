import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { PiRankingDuotone } from "react-icons/pi";
import { MdLogin, MdLogout } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { GiNinjaHead } from "react-icons/gi";
import Image from "next/image";
import { ScrollContext } from "@/context/scrollContext";

export default function UserNav({ setShowUserNav }) {
  const router = useRouter();
  const { setIsLoading } = useContext(LoaderContext);
  const { navHide } = useContext(ScrollContext);
  const { user, setShowSignIn } = useContext(UserContext);

  return (
    <div
      onClick={() => setShowUserNav(false)}
      className={`inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed ${
        navHide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-4 absolute top-18 right-2 bg-accent w-[65%] h-fit rounded overflow-hidden"
      >
        <button
          onClick={() => {
            setIsLoading(true);
            router.push(`/profile/${user.uid}`);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          {user ? (
            <>
              <Image
                src={user.picture}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-6 h-6 object-cover rounded-full"
              />
              <p className="text-base font-bold text-normal">{user.name}</p>
            </>
          ) : (
            <>
              <GiNinjaHead className="text-2xl" />
              <p className="text-base font-bold text-normal">Profile</p>
            </>
          )}
        </button>
        <button
          onClick={() => {
            setIsLoading(true);
            router.push("/postings");
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <BsFileEarmarkPostFill className="text-2xl" />
          <p className="text-base font-bold text-normal">Postings</p>
        </button>
        <button
          onClick={() => {
            setIsLoading(true);
            router.push("/rank");
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <PiRankingDuotone className="text-2xl" />
          <p className="text-base font-bold text-normal">Rank'em</p>
        </button>
        <button
          onClick={() => {
            setShowUserNav(false);
            setShowSignIn(true);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          {user ? (
            <>
              <MdLogout className="text-2xl" />
              <p className="text-base font-bold text-normal">Logout</p>
            </>
          ) : (
            <>
              <MdLogin className="text-2xl" />
              <p className="text-base font-bold text-normal">Login</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
