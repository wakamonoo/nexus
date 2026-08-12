"use client";
import { LoaderContext } from "@/context/loaderContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useContext, useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import TitleCard from "./titleCard";

export default function GoatTitlesStructureMin() {
  const { setIsLoading } = useContext(LoaderContext);
  const { goat } = useContext(TitleContext);
  const { isTitleWatched} = useContext(WatchContext);
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
      {ranked.length > 0 ? (
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
