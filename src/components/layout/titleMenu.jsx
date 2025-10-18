import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function TitleMenu({
  setShowTitleMenu,
  title,
  titleId,
  poster,
}) {
  const { user } = useContext(UserContext);
  const { isWatchedFetch, isWatched } = useContext(WatchContext);
  const { setIsLoading } = useContext(LoaderContext);

  const handleWatch = async () => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/api/watched/watchRoute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.name,
          title,
          titleId,
          poster,
        }),
      });
      await isWatchedFetch(user.uid, titleId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid && titleId) isWatchedFetch(user.uid, titleId);
  }, [user?.uid, titleId]);

  return (
    <div className="flex flex-col w-60 border-1 border-panel absolute top-full right-2 mt-2 p-2 rounded bg-second shadow-2xl z-50 overflow-hidden">
      <button
        onClick={handleWatch}
        className="flex w-full items-center gap-2 hover:bg-[var(--color-panel)] focus:bg-[var(--color-panel)] p-4 rounded cursor-pointer"
      >
        {isWatched === true ? (
          <>
            <FaEyeSlash className="text-2xl shrink-0" />
            <p className="text-base font-bold text-normal">Mark as unwatched</p>
          </>
        ) : (
          <>
            <FaEye className="text-2xl shrink-0" />
            <p className="text-base font-bold text-normal">Mark as watched</p>
          </>
        )}
      </button>
    </div>
  );
}
