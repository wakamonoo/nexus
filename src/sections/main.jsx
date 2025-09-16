"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import Fallback from "@/assets/fallback.jpg";

export default function Main() {
  const [titles, setTitles] = useState([]);

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

  return (
    <div className="bg-brand w-full p-2">
      <div className="py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">NEW RELEASES</h1>
          <FaAngleRight className="text-normal text-xl" />
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-24 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={250}
                    height={500}
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
          <FaAngleRight className="text-normal text-xl" />
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-24 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={250}
                    height={500}
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
          <FaAngleRight className="text-normal text-xl" />
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {titles.length > 0 ? (
              titles.map((unit, index) => (
                <div key={index} className="w-24 h-auto flex-shrink-0">
                  <Image
                    src={unit.image || Fallback}
                    alt="image"
                    width={250}
                    height={500}
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
