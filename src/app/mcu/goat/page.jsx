"use client";
import { useContext } from "react";
import { TitleContext } from "@/context/titleContext";
import { FaAngleLeft, FaBoxOpen } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Chrono() {
  const { titles } = useContext(TitleContext);
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center p-2">
      <div className="flex justify-between items-center py-4 w-full">
        <FaAngleLeft
          onClick={() => router.push("/mcu")}
          className="text-2xl cursor-pointer"
        />
        <h4 className="text-2xl">MCU Choronological Order</h4>
        <div />
      </div>
      <div className="w-full max-w-5xl">
        <div className="flex flex-wrap justify-center gap-2">
          {titles.length > 0 ? (
            [...titles]
              .sort((a, b) => a.order - b.order)
              .map((unit) => (
                <div
                  key={unit.order}
                  onClick={() => router.push(`/mcu/${unit.titleId}`)}
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
