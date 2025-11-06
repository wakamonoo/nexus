import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

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
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: "Change not saved, please try again later!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
    } finally {
      setIsLoading(false);
      Swal.fire({
        toast: true,
        position: "bottom-start",
        title: `${
          isWatched === true ? "Title unwatched" : "Title marked as watched"
        }`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-secondary)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup:
            "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
          title:
            "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
        },
      });
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
