import { MdGroups, MdIntegrationInstructions, MdTimeline } from "react-icons/md";

export default function About() {
  return (
    <div className="bg-brand w-full">
      <div className="bg-second h-screen pt-16 p-4 flex flex-col justify-center items-center">
        <h1 className="text-7xl text-center leading-15 text-accent">
          Nexus, your ultimate MCU COMPANION
        </h1>
        <p className="text-base text-center leading-4 text-vibe">
          track, rank, and explore every corner of the Marvel Cinematic
          Universe!
        </p>
      </div>

      <div className="p-4">
        <h1 className="text-4xl py-4">— Why this exists</h1>
        <p className="text-base text-justify">
          This site started as a weekend side-project to help fellow fans keep
          track of the ever-growing Marvel Cinematic Universe. From Iron Man’s
          first flight to the latest multiverse adventures, we wanted a single,
          easy place to browse films, plan watch orders, and share personal
          rankings.
        </p>
      </div>

      <div className="p-4">
        <h1 className="text-4xl py-4">— What you'll find here</h1>
        <div className="flex flex-wrap gap-2 justify-center w-full items-stretch">

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdGroups className="text-6xl" />
            <p className="text-base text-center font-bold leading-4 uppercase">Debate & Discussions</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdTimeline className="text-6xl" />
            <p className="text-base text-center font-bold leading-4 uppercase">Various Watchguide</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdIntegrationInstructions className="text-6xl" />
            <p className="text-base text-center font-bold leading-4 uppercase"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
