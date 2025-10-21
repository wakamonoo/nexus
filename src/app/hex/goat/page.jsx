"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen, FaCrown } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/components/loaders/loader";
import { useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titlesNavContext";
import { LoaderContext } from "@/context/loaderContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { GiTrophy } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";

export default function Goat() {
  const { user } = useContext(UserContext);
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

  if (!titles || titles.length === 0) {
    return <ShowListLoader />;
  }

  const rankedTitles = titles
    .filter((t) => t.totalPoints > 0)
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

  return (
    <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="flex justify-between items-center py-4 w-full">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-xl">GOAT STATUS</h4>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap justify-center gap-2">
          {...ranked.map((unit) => (
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
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center p-8 opacity-70">
        <p className="text-xs text-vibe">
          Your fav not here?{" "}
          <span
            onClick={() => router.push("/powerboard")}
            className="cursor-pointer underline"
          >
            Rank it
          </span>
        </p>
      </div>
    </div>
  );
}
