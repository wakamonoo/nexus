"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { LoaderContext } from "@/context/loaderContext";
import { TitleNavContext } from "@/context/titleNavContext";
import ShowListLoader from "@/components/loaders/showListLoader";
import { WatchContext } from "@/context/watchContext";
import TitleCard from "@/components/layout/titleCard";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function ActorProjects() {
  const { person } = useParams();
  const [personData, setPersonData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched } = useContext(WatchContext);
  const [showFull, setShowFull] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const getPerson = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/titles/personGet/${person}`);

        if (!res.ok) {
          throw new Error("failed to fetch title");
        }

        const data = await res.json();

        setPersonData(data.person);
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
        setPersonData(null);
        setProjects([]);
      } finally {
        setPageLoad(false);
      }
    };

    getPerson();
  }, [person]);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex justify-between items-center py-4 w-full">
          <FaAngleLeft
            onClick={() => router.back()}
            className="text-2xl cursor-pointer"
          />
          <h4 className="text-xl">{personData?.name}</h4>
        </div>
        {pageLoad ? (
          <ShowListLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4 items-start w-full">
            <aside className="w-full">
              <div className="w-32 h-48 md:w-36 md:h-52 shrink-0 float-left mr-4 mb-2">
                <img
                  src={
                    personData?.profilePath
                      ? `https://image.tmdb.org/t/p/w500${personData?.profilePath}`
                      : "/fallback.png"
                  }
                  alt={personData?.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm text-vibe text-justify leading-5 whitespace-pre-wrap mb-2">
                  Total related projects: <span>{projects.length}</span>
                </p>
                <p className="text-sm text-vibe text-justify leading-5 whitespace-pre-wrap">
                  {personData?.biography ? (
                    !showFull ? (
                      <>
                        {personData?.biography
                          .split(" ")
                          .slice(0, 100)
                          .join(" ")}{" "}
                        {personData?.biography.split(" ").length > 100 && (
                          <>
                            ...{" "}
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFull(true);
                              }}
                              className="cursor-pointer text-sm font-light text-normal opacity-60"
                            >
                              see more
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {personData?.biography}{" "}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFull(false);
                          }}
                          className="cursor-pointer text-sm font-light text-normal opacity-60"
                        >
                          see less
                        </span>
                      </>
                    )
                  ) : (
                    <span className="opacity-60">
                      Biography not available for {personData?.name}
                    </span>
                  )}
                </p>
              </div>
            </aside>
            <div className="w-full h-[1px] bg-panel my-4 block md:hidden" />
            <main className="w-full">
              <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
                {projects?.map((unit) => (
                  <TitleCard
                    key={unit.titleId}
                    unit={unit}
                    isWatched={isTitleWatched(unit.titleId)}
                    onOpen={() => handleShowNav(unit.titleId)}
                  />
                ))}
              </div>
            </main>
          </div>
        )}
      </div>
    </>
  );
}
