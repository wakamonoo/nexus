"use client";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titlesNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import Image from "next/image";

export default function GoatTitlesStructureMin() {
  const { setIsLoading } = useContext(LoaderContext);
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

  const rankedTitles = titles
    ?.filter((t) => t.totalPoints > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let previousPoints = null;
  let currentRank = 0;

  const ranked = rankedTitles.map((t, index) => {
    if (t.totalPoints !== previousPoints) {
      currentRank = index + 1;
      previousPoints = t.totalPoints;
    }
    return { ...t, rank: currentRank };
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="flex gap-2">
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
                isTitleWatched(unit.titleId) ? "grayscale-0" : "grayscale-90"
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
