"use client";
import NavBar from "@/components/layout/essentials/navBar";
import { SigilContext } from "@/context/sigilContext";
import { useContext} from "react";
import Image from "next/image";

export default function Sigil() {
  const { sigils } = useContext(SigilContext);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Symbols of Your Journey
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            Every sigil tells a story, a mark of your actions, your words, and
            your journey through the community. Each one symbolizes growth,
            courage, and the moments that define who you are. Collect them, wear
            them with pride, and let your legacy shine as a testament to your
            ever-evolving story.
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
          <p className="text-sm leading-7 opacity-60">
            Earn sigils through your activity, achievements, and your journey
            across nexus.
          </p>
        </div>
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
                className="w-18 h-18 md:w-20 md:h-20 object-fill"
              />
              <p className="text-sm text-normal w-full text-center">
                {sigil.name}
              </p>
              <p className="text-xs text-vibe w-full text-center mt-2">
                {sigil.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
