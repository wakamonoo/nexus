"use client";
import PostStructure from "@/components/layout/postStructure";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import Image from "next/image";
import GoatTitlesStructureMin from "@/components/layout/goatTitlesStructureMin";
import GoatMaxLoader from "../loaders/goatMaxLoader";
import Fallback from "@/assets/fallback.png";

export default function MostWatchedTitlesStructureMax() {
  const { topic } = useParams();
  const { posts } = useContext(PostContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const { handleShowNav } = useContext(TitleNavContext);

  const isLoading =
    titles === undefined || titles === null || titles.length === 0;

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

  const mostWatchedRank = titles
    .filter?.((t) => t.watchCount.length > 0)
    .sort((a, b) => b.watchCount.length - a.watchCount.length);

  let previousCount = null;
  let currentRank = 0;

  const ranked = mostWatchedRank.map((t, index) => {
    if (t.watchCount.length !== previousCount) {
      currentRank = index + 1;
      previousCount = t.watchCount.length;
    }
    return { ...t, rank: currentRank };
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
