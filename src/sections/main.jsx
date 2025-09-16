"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import Fallback from "@/assets/fallback.jpg";

export default function Main() {
  const [titles, setTitles] = useState([]);
  const [isScrolled1, setIsScrolled1] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [isScrolled3, setIsScrolled3] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);

  useEffect(() => {
    const handleGetTitles = async () => {
      const res = await fetch("http://localhost:4000/api/titles/titleGet", {
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

  return (
    <div className="bg-brand w-full p-2">
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">NEW RELEASES</h1>
          <FaAngleRight
            className={`text-normal text-xl ${isScrolled1 ? "flex" : "hidden"}`}
          />
        </div>

        <div ref={scrollRef1} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-26 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto rounded"
                  />
                </div>
              ))
            ) : (
              <div>
                <p>none</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">HIGHEST RATED</h1>
          <FaAngleRight
            className={`text-normal text-xl ${isScrolled2 ? "flex" : "hidden"}`}
          />
        </div>

        <div ref={scrollRef2} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-26 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto rounded"
                  />
                </div>
              ))
            ) : (
              <div>
                <p>none</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">MCU CHRONOLOGICAL ORDER</h1>
          <FaAngleRight
            className={`text-normal text-xl ${isScrolled3 ? "flex" : "hidden"}`}
          />
        </div>

        <div ref={scrollRef3} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-26 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto rounded"
                  />
                </div>
              ))
            ) : (
              <div>
                <p>none</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
