import NavBar from "@/components/layout/navBar";
import {
  MdAnnouncement,
  MdCollections,
  MdGroups,
  MdLeaderboard,
  MdTimeline,
  MdWarningAmber,
} from "react-icons/md";

export default function About() {
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-4">
        <div>
          <h1 className="text-4xl py-4 text-accent text-center">
            Why this exists
          </h1>
          <p className="text-base text-justify">
            Nexus first began as my personal guide when I rewatched the entire
            <strong> Marvel Cinematic Universe (MCU)</strong> in chronological
            order. Back then, it was called <strong>616-Initiative</strong>.
            While browsing through social media, I noticed that many people were
            looking for different watch orders, whether by release date or
            chronology. That sparked something in me to share what I had built.
            <br />
            <br />
            Originally, <strong>616-Initiative</strong>. was simply a way to
            track my own progress while watching the <strong>MCU</strong>. But
            after each rewatch, I found myself wanting to share my thoughts,
            confusions and insights about various titles. That’s when I asked
            myself, what if I could expand this into something more? A space
            where <strong>MCU</strong> fans could engage, share, and connect
            with one another.
            <br />
            <br />
            So I rebranded it as <strong>Nexus</strong>, because just like in
            the TVA, this is our nexus event, the moment everything branches
            into something new.
          </p>
        </div>

        <div>
          <h1 className="text-4xl py-4 text-accent text-center">
            What you'll find here
          </h1>
          <p className="text-base text-justify">
            <strong>Nexus</strong> isn’t just a database, it’s built to be your
            go-to <strong>MCU</strong> companion. Here, you’ll find tools and
            spaces designed to help you watch smarter, rank your favorites, and
            connect with other fans who love the{" "}
            <strong>Marvel Cinematic Universe</strong> just as much as you do.
          </p>
          <div className="flex flex-wrap gap-2 py-2 justify-center w-full items-stretch">
            <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
              <MdGroups className="text-6xl text-normal h-16" />
              <div>
                <p className="text-base text-center font-bold leading-4 uppercase text-normal h-8">
                  Community Space
                </p>
                <p className="text-center text-xs leading-3 text-vibe mt-2">
                  Where fans connect, debate, and share their MCU takes
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
              <MdTimeline className="text-6xl text-normal h-16" />
              <div>
                <p className="text-base text-center font-bold leading-4 uppercase text-normal h-8">
                  Watch Orders
                </p>
                <p className="text-center text-xs leading-3 text-vibe mt-2">
                  Your MCU guide release, timeline, or curated order
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center bg-panel p-4 rounded flex-1">
              <MdLeaderboard className="text-6xl h-16" />
              <div>
                <p className="text-base text-center font-bold leading-4 uppercase text-normal h-8">
                  Rankings
                </p>
                <p className="text-center text-xs leading-3 text-vibe mt-2">
                  Build and showcase your personal MCU hierarchy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
