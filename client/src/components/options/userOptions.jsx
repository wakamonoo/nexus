import { useContext, useEffect, useRef } from "react";
import { ScrollContext } from "@/context/scrollContext";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { PiRankingDuotone } from "react-icons/pi";
import {
  MdAdminPanelSettings,
  MdCheckBox,
  MdLogin,
  MdLogout,
} from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { GiNinjaHead } from "react-icons/gi";

export default function UserOptions({ setShowUserOptions, userOptRef }) {
  const router = useRouter();
  const { setIsLoading } = useContext(LoaderContext);
  const { user, setShowSignInModal, adminBtn } = useContext(UserContext);
  const optRef = useRef();

  useEffect(() => {
    const handleOutClick = (e) => {
      const btn = userOptRef?.current;
      if (
        optRef.current &&
        !optRef.current.contains(e.target) &&
        btn &&
        !btn.contains(e.target)
      ) {
        setShowUserOptions(false);
      }
    };

    document.addEventListener("mousedown", handleOutClick);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, [setShowUserOptions]);

  return (
    <div
      ref={optRef}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50 top-18 right-2 sm:right-4 md:right-8 lg:right-16 bg-second w-60 border border-panel h-fit rounded overflow-hidden"
    >
      <div className="flex flex-col p-4">
        <button
          onClick={() => {
            user
              ? router.push(`/profile/${user.uid}`)
              : setShowSignInModal(true);
          }}
          className="flex items-center gap-2 cursor-pointer hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded"
        >
          {user ? (
            <>
              <img
                src={user.picture}
                alt={user.name}
                loading="lazy"
                decoding="async"
                className="w-6 h-6 object-cover rounded-full"
              />
              <p className="text-base font-bold text-normal truncate">
                {user.name}
              </p>
            </>
          ) : (
            <>
              <GiNinjaHead className="text-2xl" />
              <p className="text-base font-bold text-normal">Profile</p>
            </>
          )}
        </button>
        {adminBtn && (
          <button
            onClick={() => {
              router.push("/admin");
            }}
            className="flex items-center gap-2 cursor-pointer hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded"
          >
            <MdAdminPanelSettings className="text-2xl" />
            <p className="text-base font-bold text-normal">Admin</p>
          </button>
        )}
        <button
          onClick={() => {
            user ? router.push("/portfolio") : setShowSignInModal(true);
          }}
          className="flex items-center gap-2 cursor-pointer hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded"
        >
          <MdCheckBox className="text-2xl" />
          <p className="text-base font-bold text-normal">Portfolio</p>
        </button>
        <button
          onClick={() => {
            user ? router.push("/powerboard") : setShowSignInModal(true);
          }}
          className="flex items-center gap-2 cursor-pointer hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded"
        >
          <PiRankingDuotone className="text-2xl" />
          <p className="text-base font-bold text-normal">Powerboard</p>
        </button>
        <button
          onClick={() => {
            setShowUserOptions(false);
            setShowSignInModal(true);
          }}
          className="flex items-center gap-2 cursor-pointer hover:bg-(--color-panel) focus:bg-(--color-panel) p-4 rounded"
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
