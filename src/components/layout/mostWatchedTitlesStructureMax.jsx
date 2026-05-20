"use client";

import { useContext, useEffect, useMemo } from "react";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { TitleNavContext } from "@/context/titleNavContext";
import Image from "next/image";
import { FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import Fallback from "@/assets/fallback.png";

export default function MostWatchedTitlesStructureMax() {
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { user } = useContext(UserContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);

  // fetch watched info safely
  useEffect(() => {
    const fetchWatched = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user.uid);
      }
    };
    fetchWatched();
  }, [user, watchedInfoFetch]);

  // stop loader once mounted
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // ✅ SAFE fallback (THIS IS THE KEY FIX)
  const safeTitles = titles ?? [];

  // ✅ compute ranked list safely
  const ranked = useMemo(() => {
    const filtered = safeTitles
      .filter((t) => (t.watchCount?.length ?? 0) > 0)
      .sort((a, b) => (b.watchCount?.length ?? 0) - (a.watchCount?.length ?? 0));

    return filtered.map((t, index) => ({
      ...t,
      rank: index + 1,
    }));
  }, [safeTitles]);

  // loading guard (ONLY for undefined state)
  if (!titles) {
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <p className="text-sm text-panel">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ranked.length > 0 ? (
        ranked.map((unit) => (
          <div
            key={unit.titleId}
            onClick={() => handleShowNav(unit.titleId)}
            className="relative w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
          >
            <Image
              src={unit.image || Fallback}
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              className={`w-full h-full object-fill rounded ${
                isTitleWatched(unit.titleId)
                  ? "grayscale-0"
                  : "grayscale-90"
              }`}
            />

            <div
              className={`absolute opacity-80 top-0 right-1 p-2 h-8 w-6 flex items-center justify-center rounded-bl-2xl rounded-br-2xl ${
                unit.rank === 1 ? "bg-hulk" : "bg-accent"
              }`}
            >
              <p
                className={`font-bold text-sm ${
                  unit.rank === 1 ? "text-zeus" : "text-normal"
                }`}
              >
                {unit.rank === 1 ? <GiTrophy /> : unit.rank}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <FaBoxOpen className="text-6xl text-panel" />
          <p className="text-sm text-panel font-normal">
            Sorry, no data to display!
          </p>
        </div>
      )}
    </div>
  );
}