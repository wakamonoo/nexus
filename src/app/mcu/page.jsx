"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaBoxOpen, FaSearch } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import Loader from "@/components/titlesLoader";
import NavLoad from "@/components/loader";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { TitleContext } from "@/context/titleContext";
import NavBar from "@/components/navBar";

export default function Main() {
  const {
    titles,
    loading,
    pageLoad,
    setLoading,
    handleNavigate,
    handleTitleNav,
  } = useContext(TitleContext);
  const [isScrolled1, setIsScrolled1] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [isScrolled3, setIsScrolled3] = useState(false);
  const [isScrolled4, setIsScrolled4] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <NavBar />

      <div className="relative bg-brand w-full p-2 pt-24">
        {pageLoad ? (
          <Loader />
        ) : (
          <>
            {loading && <NavLoad />}
            <div className="flex justify-between items-center gap-2 bg-text px-4 py-2 rounded-full">
              <input
                type="text"
                placeholder="Search for your favorite marvel titles.."
                className="w-full p-2 outline-none text-base text-panel"
              />
              <button>
                <FaSearch className="text-2xl text-accent" />
              </button>
            </div>
            <div className="py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl">LATEST RELEASES</h1>
                <FaAngleRight
                  onClick={() => handleTitleNav("latest")}
                  className={`text-normal text-xl cursor-pointer ${
                    isScrolled1 ? "flex" : "hidden"
                  }`}
                />
              </div>

              <div ref={scrollRef1} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {titles.length > 0 ? (
                    [...titles]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 15)
                      .map((unit) => (
                        <div
                          key={unit.date}
                          onClick={() => handleNavigate(unit.titleId)}
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
                  onClick={() => handleTitleNav("chrono")}
                  className={`text-normal text-xl cursor-pointer ${
                    isScrolled2 ? "flex" : "hidden"
                  }`}
                />
              </div>

              <div ref={scrollRef2} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {titles.length > 0 ? (
                    [...titles]
                      .sort((a, b) => a.order - b.order)
                      .map((unit) => (
                        <div
                          key={unit.order}
                          onClick={() => handleNavigate(unit.titleId)}
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
                  onClick={() => handleTitleNav("release")}
                  className={`text-normal text-xl cursor-pointer ${
                    isScrolled3 ? "flex" : "hidden"
                  }`}
                />
              </div>

              <div ref={scrollRef3} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {titles.length > 0 ? (
                    [...titles]
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((unit) => (
                        <div
                          key={unit.date}
                          onClick={() => handleNavigate(unit.titleId)}
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
                  onClick={() => handleTitleNav("goat")}
                  className={`text-normal text-xl cursor-pointer ${
                    isScrolled4 ? "flex" : "hidden"
                  }`}
                />
              </div>

              <div ref={scrollRef4} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {titles.length > 0 ? (
                    titles.map((unit, index) => (
                      <div
                        key={index}
                        onClick={() => handleNavigate(unit.titleId)}
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
          </>
        )}
      </div>
    </>
  );
}
