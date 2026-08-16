"use client";

import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft } from "react-icons/fa";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import TitleCard from "@/components/layout/titleCard";

export default function Latest() {
  const { latest } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched } = useContext(WatchContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // ============================================
  // TEMPORARY DEBUG
  // ============================================

  useEffect(() => {
    console.log("====================================");
    console.log("🔥 LATEST COMPONENT DEBUG");
    console.log("====================================");

    console.log("latest:", latest);
    console.log("latest length:", latest?.length);

    if (latest?.length) {
      latest.forEach((title, index) => {
        const date =
          title.mediaType === "tv"
            ? title.first_air_date
            : title.release_date;

        console.log(index + 1, {
          title: title.title,
          mediaType: title.mediaType,
          dateUsed: date,
          first_air_date: title.first_air_date,
          release_date: title.release_date,
          timestamp: new Date(date).getTime(),
        });
      });
    }

    console.log("====================================");
  }, [latest]);

  return (
    <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="flex justify-between items-center py-4 w-full">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />

        <h4 className="text-xl">Latest Releases</h4>
      </div>

      {!latest ? (
        <ShowListLoader />
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
            {latest.map((unit) => (
              <TitleCard
                key={unit.titleId}
                unit={unit}
                isWatched={isTitleWatched(unit.titleId)}
                onOpen={() => handleShowNav(unit.titleId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}