"use client";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";
import { LoaderContext } from "@/context/loaderContext";
import { useRouter } from "next/navigation";
import { TitleNavContext } from "@/context/titlesNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";
import { GoDotFill } from "react-icons/go";

export default function Latest() {
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

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">Latest Releases</h4>
        </div>
        <div className="w-full max-w-5xl">
          <div className="flex flex-wrap justify-center gap-2">
            {...titles
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 15)
              .map((unit, index) => (
                <div
                  key={index}
                  onClick={() => handleShowNav(unit.titleId)}
                  className="w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
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
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
