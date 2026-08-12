"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import TitleCard from "@/components/layout/titleCard";

export default function MultiversalCanon() {
  const { releasedLegacyTitles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched} = useContext(WatchContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Multiversal Canon</h4>
        </div>
        {!releasedLegacyTitles?.length ? (
          <ShowListLoader />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
              {...releasedLegacyTitles
                .sort((a, b) => {
                  const dateA =
                    a.mediaType === "tv" ? a.first_air_date : a.release_date;

                  const dateB =
                    b.mediaType === "tv" ? b.first_air_date : b.release_date;

                  return new Date(dateA) - new Date(dateB);
                })
                .map((unit) => (
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
    </>
  );
}
