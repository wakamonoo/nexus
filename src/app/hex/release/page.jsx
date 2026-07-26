"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/components/loaders/loader";
import { useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";
import Fallback from "@/assets/fallback.png";
import { optimizeCloudinary } from "@/utils/cloudinary";

export default function Release() {
  const { user } = useContext(UserContext);
  const { release } = useContext(TitleContext);
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

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">MCU Release Order</h4>
        </div>
        {!release ? (
          <ShowListLoader />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
              {...release.map((unit) => (
                <div
                  key={unit.date}
                  onClick={() => handleShowNav(unit.titleId)}
                  className="w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={
                      unit.poster
                        ? `https://image.tmdb.org/t/p/w500${unit.poster}`
                        : "/fallback.png"
                    }
                    alt={unit.title}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-fill rounded ${
                      isTitleWatched(unit.titleId)
                        ? "grayscale-0"
                        : "grayscale-90"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
