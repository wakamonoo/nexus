"use client";
import { TitleContext } from "@/context/titleContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FaAngleLeft, FaBoxOpen, FaSearch } from "react-icons/fa";
import Image from "next/image";

export default function Rank() {
  const { titles } = useContext(TitleContext);
  const router = useRouter();

  return (
    <div className="p-2 bg-brand">
      <div className="flex justify-between py-4">
        <FaAngleLeft
          onClick={() => router.back()}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-2xl">RANK'EM</h4>
      </div>
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
      <div className="overflow-x-auto scrollbar-hide mt-8">
        <div className="flex gap-2">
          {titles.length > 0 ? (
            [...titles]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
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
  );
}
