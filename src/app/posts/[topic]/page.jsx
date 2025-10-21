"use client";
import PostStructure from "@/components/layout/postStructure";
import { LoaderContext } from "@/context/loaderContext";
import { PostContext } from "@/context/postContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titlesNavContext";
import { UserContext } from "@/context/userContext";
import { WatchContext } from "@/context/watchContext";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import Image from "next/image";

export default function TopicPostings() {
  const { topic } = useParams();
  const { posts } = useContext(PostContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();
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

  const currentTopic = posts?.filter(
    (p) => p.topic === decodeURIComponent(topic)
  );
  return (
    <div className="bg-brand w-full">
      <div className="relative bg-panel border-b-1 border-[var(--color-secondary)] p-6 flex justify-center items-center">
        <FaAngleLeft
          onClick={() => router.back()}
          className="absolute left-2 sm:left-4 md:left-8 lg:left-16 xl:left-32 text-2xl cursor-pointer"
        />
        <p className="absolute left-1/2 -translate-x-1/2 uppercase font-bold text-normal truncate">
          Posts from "{decodeURIComponent(topic)}"
        </p>
      </div>
      <aside className="p-2 md:hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
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
              <div className="flex flex-col justify-center items-center">
                <FaBoxOpen className="w-[32vw] sm:w-[24vw] md:w-[16vw] h-auto text-panel" />
                <p className="text-sm sm:text-base md:text-xl text-panel font-normal">
                  Sorry, no data to display!
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr] md:gap-4 items-start md:px-8 lg:px-16 xl:px-32">
        <main className="md:py-2 md:sticky md:top-0">
          <div className="p-2 flex flex-col gap-1">
            {currentTopic?.map((post, index) => (
              <PostStructure key={index} post={post} />
            ))}
          </div>
        </main>
        <aside className="w-full h-full hidden md:block">
          <div className="w-full md:py-4">
            <div className="flex flex-wrap justify-start gap-2">
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
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
