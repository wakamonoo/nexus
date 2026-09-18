"use client";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect } from "react";
import { FaBoxOpen, FaClipboard } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import TitleCard from "../title/titleCard";
import TitlesLoader from "@/components/loaders/titlesLoader";
import { FaClapperboard, FaClipboardList } from "react-icons/fa6";

export default function GoatTitlesStructureMin() {
  const { setIsLoading } = useContext(LoaderContext);
  const { goat, titlesLoad } = useContext(TitleContext);
  const { isTitleWatched } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);

  let previousPoints = null;
  let currentRank = 0;

  const ranked = goat.map((t, index) => {
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
      {titlesLoad ? (
        <TitlesLoader />
      ) : ranked.length > 0 ? (
        ranked.map((unit) => (
          <TitleCard
            key={unit.titleId}
            unit={unit}
            isWatched={isTitleWatched(unit.titleId)}
            onOpen={() => handleShowNav(unit.titleId)}
            goat={true}
          />
        ))
      ) : (
        <div className="flex h-full w-full justify-center items-center my-16">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
              <FaClapperboard className="text-5xl text-vibe opacity-60 p-2" />
            </div>
            <div className="w-40 text-center">
              <p className="text-xs text-vibe opacity-60 leading-tight">
                Nothing here to explore yet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
