"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaBoxOpen, FaSearch } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import TitleLoader from "@/components/titlesLoader";
import Loader from "@/components/searchLoader";
import { useContext } from "react";
import { TitleContext } from "@/context/titleContext";
import NavBar from "@/components/navBar";
import { TitleNavContext } from "@/context/titlesNavContex";
import { MdSearchOff } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Main() {
  const { titles, pageLoad } = useContext(TitleContext);
  const { handleShowNav, handleShowListNav } = useContext(TitleNavContext);
  const [isScrolled1, setIsScrolled1] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [isScrolled3, setIsScrolled3] = useState(false);
  const [isScrolled4, setIsScrolled4] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = scrollRef1.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled1(current.scrollLeft > 50);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [titles]);

  useEffect(() => {
    const current = scrollRef2.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled2(current.scrollLeft > 50);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [titles]);

  useEffect(() => {
    const current = scrollRef3.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled3(current.scrollLeft > 50);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [titles]);

  useEffect(() => {
    const current = scrollRef4.current;
    if (!current) return;

    const handleScroll = () => {
      setIsScrolled4(current.scrollLeft > 50);
    };

    current.addEventListener("scroll", handleScroll);
    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [titles]);

  useEffect(() => {
    if (!titles) return;
    titles.forEach((unit) => {
      if (unit.image) {
        const img = new window.Image();
        img.src = unit.image;
      }
    });
  }, [titles]);

  const handleSearch = async () => {
    if (!searchInput) return setSearchResults([]);
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/titles/titleGet?query=${encodeURIComponent(
          searchInput
        )}`
      );
      const data = await res.json();
      setSearchResults(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchInput) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput]);

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
    <>
      <NavBar />

      <div className="relative bg-brand w-full p-2 pt-24">
        {pageLoad ? (
          <TitleLoader />
        ) : (
          <>
            <div className="flex justify-between items-center gap-2 bg-text px-4 py-2 rounded-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter") & !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Search for your favorite marvel titles.."
                className="w-full p-2 outline-none text-base text-panel"
              />
              <button onClick={handleSearch}>
                <FaSearch className="text-2xl text-accent" />
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : searchResults.length > 0 ? (
              <div>
                <div className="p-2 py-2">
                  <p className="text-sm text-vibe w-full line-clamp-1">
                    Here's the search results for{" "}
                    <span className="font-bold">"{searchInput}"</span>
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {searchResults
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((unit) => (
                        <div
                          key={unit.date}
                          onClick={() => handleShowNav(unit.titleId)}
                          className="w-26 h-40 flex-shrink-0 cursor-pointer"
                        >
                          <Image
                            src={unit.image || Fallback}
                            alt="image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-fill rounded"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : searchInput ? (
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <MdSearchOff className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    No results for{" "}
                    <span className="font-bold">{searchInput}</span>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl">LATEST RELEASES</h1>
                    <FaAngleRight
                      onClick={() => handleShowListNav("latest")}
                      className={`text-normal text-xl cursor-pointer ${
                        isScrolled1 ? "flex" : "hidden"
                      }`}
                    />
                  </div>

                  <div
                    ref={scrollRef1}
                    className="overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex gap-2">
                      {titles.length > 0 ? (
                        [...titles]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 15)
                          .map((unit) => (
                            <div
                              key={unit.date}
                              onClick={() => handleShowNav(unit.titleId)}
                              className="w-26 h-40 flex-shrink-0 cursor-pointer"
                            >
                              <Image
                                src={unit.image || Fallback}
                                alt="image"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-full h-full object-fill rounded"
                              />
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
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl">MCU CHRONOLOGICAL ORDER</h1>
                    <FaAngleRight
                      onClick={() => handleShowListNav("chrono")}
                      className={`text-normal text-xl cursor-pointer ${
                        isScrolled2 ? "flex" : "hidden"
                      }`}
                    />
                  </div>

                  <div
                    ref={scrollRef2}
                    className="overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex gap-2">
                      {titles.length > 0 ? (
                        [...titles]
                          .sort((a, b) => a.order - b.order)
                          .map((unit) => (
                            <div
                              key={unit.order}
                              onClick={() => handleShowNav(unit.titleId)}
                              className="w-26 h-40 flex-shrink-0 cursor-pointer"
                            >
                              <Image
                                src={unit.image || Fallback}
                                alt="image"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-full h-full object-fill rounded"
                              />
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
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl">MCU RELEASE ORDER</h1>
                    <FaAngleRight
                      onClick={() => handleShowListNav("release")}
                      className={`text-normal text-xl cursor-pointer ${
                        isScrolled3 ? "flex" : "hidden"
                      }`}
                    />
                  </div>

                  <div
                    ref={scrollRef3}
                    className="overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex gap-2">
                      {titles.length > 0 ? (
                        [...titles]
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((unit) => (
                            <div
                              key={unit.date}
                              onClick={() => handleShowNav(unit.titleId)}
                              className="w-26 h-40 flex-shrink-0 cursor-pointer"
                            >
                              <Image
                                src={unit.image || Fallback}
                                alt="image"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-full h-full object-fill rounded"
                              />
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
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl">GOAT STATUS</h1>
                    <FaAngleRight
                      onClick={() => handleShowListNav("goat")}
                      className={`text-normal text-xl cursor-pointer ${
                        isScrolled4 ? "flex" : "hidden"
                      }`}
                    />
                  </div>

                  <div
                    ref={scrollRef4}
                    className="overflow-x-auto scrollbar-hide"
                  >
                    <div className="flex gap-2">
                      {titles.length > 0 ? (
                        ranked.map((unit) => (
                          <div
                            key={unit.titleId}
                            onClick={() => handleShowNav(unit.titleId)}
                            className="relative w-26 h-40 flex-shrink-0 cursor-pointer"
                          >
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
                            <Image
                              src={unit.image || Fallback}
                              alt="image"
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="w-full h-full object-fill rounded"
                            />
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
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
