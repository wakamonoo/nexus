"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaBoxOpen } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import TitleLoader from "@/components/loaders/titlesLoader";
import Loader from "@/components/loaders/searchLoader";
import { useContext } from "react";
import { TitleContext } from "@/context/titleContext";
import NavBar from "@/components/layout/navBar";
import { TitleNavContext } from "@/context/titlesNavContext";
import { MdSearchOff } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { WatchContext } from "@/context/watchContext";
import { UserContext } from "@/context/userContext";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import GoatTitlesStructureMin from "@/components/layout/goatTitlesStructureMin";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function Main() {
  const { titles, pageLoad } = useContext(TitleContext);
  const { user } = useContext(UserContext);
  const { handleShowNav, handleShowListNav } = useContext(TitleNavContext);
  const { isTitleWatched, watchedInfoFetch } = useContext(WatchContext);
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
  const [showArrows1, setShowArrors1] = useState(false);
  const [showArrows2, setShowArrors2] = useState(false);
  const [showArrows3, setShowArrors3] = useState(false);
  const [showArrows4, setShowArrors4] = useState(false);

  useEffect(() => {
    const fetchWathced = async () => {
      if (user?.uid) {
        await watchedInfoFetch(user?.uid);
      }
    };

    fetchWathced();
  }, [user]);

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

  const handleTitleSearch = async () => {
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
      handleTitleSearch();
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchInput]);

  const handleScrollLeft1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft3 = () => {
    if (scrollRef3.current) {
      scrollRef3.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight3 = () => {
    if (scrollRef3.current) {
      scrollRef3.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft4 = () => {
    if (scrollRef4.current) {
      scrollRef4.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight4 = () => {
    if (scrollRef4.current) {
      scrollRef4.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative bg-brand w-full pt-24 p-2 sm:px-4 md:px-8 lg:px-16">
        {pageLoad ? (
          <TitleLoader />
        ) : (
          <>
            <div className="flex justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter") & !e.shiftKey) {
                    e.preventDefault();
                    handleTitleSearch();
                  }
                }}
                placeholder="Locate titles accross Marvel Sagas..."
                className="w-full outline-none text-base text-normal truncate"
              />
              <button onClick={handleTitleSearch} className="cursor-pointer">
                <HiOutlineSearch className="text-2xl text-normal" />
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : searchResults.length > 0 ? (
              <div>
                <div className="p-2 py-2">
                  <p className="text-sm text-vibe w-full line-clamp-1">
                    Search results for{" "}
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
                    <h1 className="text-xl">LATEST RELEASES</h1>
                    <div
                      onClick={() => handleShowListNav("latest")}
                      className={`flex items-center cursor-pointer ${
                        isScrolled1 ? "flex" : "hidden"
                      }`}
                    >
                      <p className="text-xs text-vibe">View All</p>
                      <FaAngleRight className="text-vibe text-base" />
                    </div>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => setShowArrors1(true)}
                    onMouseLeave={() => setShowArrors1(false)}
                  >
                    <div
                      className={`absolute z-40 top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-bg)]/80  ${
                        showArrows1 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`absolute z-40 top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-bg)]/80 ${
                        showArrows1 ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {showArrows1 && (
                      <>
                        <button
                          onClick={handleScrollLeft1}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                        >
                          <RiArrowLeftWideFill className="text-2xl" />
                        </button>
                        <button
                          onClick={handleScrollRight1}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                        >
                          <RiArrowRightWideFill className="text-2xl" />
                        </button>
                      </>
                    )}
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
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl">MCU CHRONOLOGICAL ORDER</h1>
                    <div
                      onClick={() => handleShowListNav("chrono")}
                      className={`flex items-center cursor-pointer ${
                        isScrolled2 ? "flex" : "hidden"
                      }`}
                    >
                      <p className="text-xs text-vibe">View All</p>
                      <FaAngleRight className="text-vibe text-base" />
                    </div>
                  </div>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowArrors2(true)}
                    onMouseLeave={() => setShowArrors2(false)}
                  >
                    <div
                      className={`absolute z-40 top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-bg)]/80  ${
                        showArrows2 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`absolute z-40 top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-bg)]/80 ${
                        showArrows2 ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {showArrows2 && (
                      <>
                        <button
                          onClick={handleScrollLeft2}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                        >
                          <RiArrowLeftWideFill className="text-2xl" />
                        </button>
                        <button
                          onClick={handleScrollRight2}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                        >
                          <RiArrowRightWideFill className="text-2xl" />
                        </button>
                      </>
                    )}
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
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl">MCU RELEASE ORDER</h1>
                    <div
                      onClick={() => handleShowListNav("release")}
                      className={`flex items-center cursor-pointer ${
                        isScrolled3 ? "flex" : "hidden"
                      }`}
                    >
                      <p className="text-xs text-vibe">View All</p>
                      <FaAngleRight className="text-vibe text-base" />
                    </div>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => setShowArrors3(true)}
                    onMouseLeave={() => setShowArrors3(false)}
                  >
                    <div
                      className={`absolute z-40 top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-bg)]/80  ${
                        showArrows3 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`absolute z-40 top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-bg)]/80 ${
                        showArrows3 ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {showArrows3 && (
                      <>
                        <button
                          onClick={handleScrollLeft3}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                        >
                          <RiArrowLeftWideFill className="text-2xl" />
                        </button>
                        <button
                          onClick={handleScrollRight3}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                        >
                          <RiArrowRightWideFill className="text-2xl" />
                        </button>
                      </>
                    )}
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
                    </div>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl">GOAT STATUS</h1>
                    <div
                      onClick={() => handleShowListNav("goat")}
                      className={`flex items-center cursor-pointer ${
                        isScrolled4 ? "flex" : "hidden"
                      }`}
                    >
                      <p className="text-xs text-vibe">View All</p>
                      <FaAngleRight className="text-vibe text-base" />
                    </div>
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={() => setShowArrors4(true)}
                    onMouseLeave={() => setShowArrors4(false)}
                  >
                    <div
                      className={`absolute z-40 top-0 left-0 w-16 h-full bg-gradient-to-r from-[var(--color-bg)]/80  ${
                        showArrows4 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`absolute z-40 top-0 right-0 w-16 h-full bg-gradient-to-l from-[var(--color-bg)]/80 ${
                        showArrows4 ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {showArrows4 && (
                      <>
                        <button
                          onClick={handleScrollLeft4}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 left-1"
                        >
                          <RiArrowLeftWideFill className="text-2xl" />
                        </button>
                        <button
                          onClick={handleScrollRight4}
                          className="cursor-pointer absolute z-50 top-1/2 -translate-y-1/2 right-1"
                        >
                          <RiArrowRightWideFill className="text-2xl" />
                        </button>
                      </>
                    )}
                    <div
                      ref={scrollRef4}
                      className="overflow-x-auto scrollbar-hide"
                    >
                      <GoatTitlesStructureMin />
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