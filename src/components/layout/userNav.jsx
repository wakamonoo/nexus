import { useContext } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { PiRankingDuotone } from "react-icons/pi";
import { MdLogin, MdLogout } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { BsFileEarmarkPostFill } from "react-icons/bs";
import { GiNinjaHead } from "react-icons/gi";
import Image from "next/image";

export default function UserNav({ setShowUserNav }) {
  const { navHide } = useContext(ScrollContext);
  const router = useRouter();
  const { setIsLoading } = useContext(LoaderContext);
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
        className="absolute top-18 right-2 sm:right-4 md:right-8 lg:right-16 bg-second w-64 h-fit rounded overflow-hidden"
      >
        <div className="flex flex-col p-4">
          <button
            onClick={() => {
              setIsLoading(true);
              router.push(`/profile/${user.uid}`);
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded"
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
              router.push("/rank");
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded"
          >
            <PiRankingDuotone className="text-2xl" />
            <p className="text-base font-bold text-normal">Rank'em</p>
          </button>
          <button
            onClick={() => {
              setShowUserNav(false);
              setShowSignIn(true);
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded"
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
    </div>
  );
}
