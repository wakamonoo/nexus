"use client";
import NavBar from "@/components/layout/navBar";
import { SigilContext } from "@/context/sigilContext";
import { useContext } from "react";
import Image from "next/image";

export default function Sigil() {
  const { sigils } = useContext(SigilContext);
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <h1 className="text-2xl py-4 text-accent text-center">
          Symbols of Your Journey
        </h1>
        <p className="text-normal font-normal text-base text-justify">
          Every sigil tells a story, a mark of your actions, your words, and
          your journey through the community. Each one symbolizes growth,
          courage, and the moments that define who you are. Collect them, wear
          them with pride, and let your legacy shine as a testament to your
          ever-evolving story.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-2 py-4">
          {sigils.map((sigil) => (
            <div
              key={sigil.key}
              tabIndex={0}
              className="w-full h-full flex flex-col justify-center items-center p-2 border border-panel rounded transition-all duration-200 hover:-translate-y-1 focus:-translate-y-1 cursor-pointer"
            >
              <Image
                src={sigil.image}
                alt={sigil.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-16 h-16 md:w-18 md:h-18 object-fill"
              />
              <p className="text-xs text-vibe w-full text-center">
                {sigil.name}
              </p>
              <p className="text-sm text-normal  w-full text-center mt-2">
                {sigil.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
