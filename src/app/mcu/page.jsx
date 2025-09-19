"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight, FaBoxOpen } from "react-icons/fa";
import Fallback from "@/assets/fallback.png";
import NavBar from "@/components/navBar";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function Main() {
  const [titles, setTitles] = useState([]);
  const [isScrolled1, setIsScrolled1] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [isScrolled3, setIsScrolled3] = useState(false);
  const [isScrolled4, setIsScrolled4] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);

  useEffect(() => {
    const handleGetTitles = async () => {
      const res = await fetch(`${BASE_URL}/api/titles/titleGet`, {
        method: "GET",
      });

      const data = await res.json();
      setTitles(data.result);
    };

    handleGetTitles();
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

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
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full p-2 pt-12">
        <div className="py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl">NEW RELEASES</h1>
            <FaAngleRight
              className={`text-normal text-xl ${
                isScrolled1 ? "flex" : "hidden"
              }`}
            />
          </div>

          <div ref={scrollRef1} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {titles.length > 0 ? (
                titles.map((unit, index) => (
                  <div key={index} className="w-26 h-40 flex-shrink-0">
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
              className={`text-normal text-xl ${
                isScrolled2 ? "flex" : "hidden"
              }`}
            />
          </div>

          <div ref={scrollRef2} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {titles.length > 0 ? (
                titles
                  .sort((a, b) => a.order - b.order)
                  .map((unit) => (
                    <div key={unit.order} className="w-26 h-40 flex-shrink-0">
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
              className={`text-normal text-xl ${
                isScrolled3 ? "flex" : "hidden"
              }`}
            />
          </div>

          <div ref={scrollRef3} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {titles.length > 0 ? (
                titles
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((unit) => (
                    <div key={unit.date} className="w-26 h-40 flex-shrink-0">
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
              className={`text-normal text-xl ${
                isScrolled4 ? "flex" : "hidden"
              }`}
            />
          </div>

          <div ref={scrollRef4} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {titles.length > 0 ? (
                titles.map((unit, index) => (
                  <div key={index} className="w-26 h-40 flex-shrink-0">
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
      </div>
    </>
  );
}
