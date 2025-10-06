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
  const { watchFetch, watchInfo } = useContext(WatchContext);
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
      await watchFetch(user.uid, titleId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid && titleId) watchFetch();
  }, [user?.uid, titleId]);

  return (
    <div
      onClick={() => setShowTitleMenu(false)}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-4 absolute top-18 right-2 bg-accent w-[65%] h-fit rounded overflow-hidden"
      >
        <button
          onClick={handleWatch}
          className="flex items-center gap-2 cursor-pointer"
        >
          {watchInfo?.watched === true ? (
            <>
              <FaEyeSlash className="text-2xl" />
              <p className="text-base font-bold text-normal">
                Mark as unwatched
              </p>
            </>
          ) : (
            <>
              <FaEye className="text-2xl" />
              <p className="text-base font-bold text-normal">Mark as watched</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
