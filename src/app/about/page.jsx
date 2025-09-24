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
    <div className="bg-brand w-full py-16 p-2">
      <div>
        <h1 className="text-4xl py-4 text-accent">— Why this exists</h1>
        <p className="text-base text-justify">
          This site started as a weekend side-project to help fellow fans keep
          track of the ever-growing Marvel Cinematic Universe. From Iron Man’s
          first flight to the latest multiverse adventures, we wanted a single,
          easy place to browse films, plan watch orders, and share personal
          rankings.
        </p>
      </div>

      <div>
        <h1 className="text-4xl py-4 text-accent">— What you'll find here</h1>
        <p className="text-base text-justify">
          Nexus isn’t just a database — it’s built to be your go-to MCU
          companion. Here, you’ll find tools and spaces designed to help you
          watch smarter, rank your favorites, and connect with other fans who
          love the Marvel universe just as much as you do.
        </p>
        <div className="flex flex-wrap gap-2 py-2 justify-center w-full items-stretch">
          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdGroups className="text-6xl text-normal" />
            <div>
              <p className="text-base text-center font-bold leading-4 uppercase text-normal">
                Community Space
              </p>
              <p className="text-center text-xs leading-3 text-vibe">
                Where fans connect, debate, and share their MCU takes
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdTimeline className="text-6xl text-normal" />
            <div>
              <p className="text-base text-center font-bold leading-4 uppercase text-normal">
                Watch Orders
              </p>
              <p className="text-center text-xs leading-3 text-vibe">
                Guides to watch the MCU your way chronological, release, or
                curated
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdLeaderboard className="text-6xl" />
            <div>
              <p className="text-base text-center font-bold leading-4 uppercase text-normal">
                Rankings & Tier Lists
              </p>
              <p className="text-center text-xs leading-3 text-vibe">
                Build and showcase your personal MCU hierarchy.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-panel p-4 rounded flex-1">
            <MdCollections className="text-6xl" />
            <div>
              <p className="text-base text-center font-bold leading-4 uppercase text-normal">
                Curated Artwork
              </p>
              <p className="text-center text-xs leading-3 text-vibe">
                Explore hand-picked fan art, posters, and creative tributes.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl py-4 text-accent">— Trust & Legality</h1>
          <div className="flex flex-col gap-2">
            <div className="p-4 bg-second rounded">
              <div className="flex gap-1 items-center">
                <MdWarningAmber className="text-2xl" />
                <h4 className="text-2xl text-normal">
                  Disclaimer & Legal Notice
                </h4>
              </div>
              <p className="text-base text-normal text-justify">
                This website is an independent, fan-made project created solely
                for entertainment and educational purposes. We are not
                affiliated with, sponsored by, or in any way officially
                connected to Marvel Studios, The Walt Disney Company, or any of
                their subsidiaries or affiliates. All trademarks, character
                names, movie titles, logos, and other intellectual property
                referenced on this site remain the exclusive property of their
                respective copyright and trademark holders, including but not
                limited to Marvel and Disney.
              </p>
            </div>
            <div className="p-4 bg-second rounded">
              <div className="flex gap-1 items-center">
                <MdAnnouncement className="text-2xl" />
                <h4 className="text-2xl text-normal">Poster & Artwork</h4>
              </div>
              <p className="text-base text-normal text-justify">
                All movie poster artwork shown on this site has been sourced
                with the explicit permission of the original artists. Each
                creator is credited directly on the corresponding movie page,
                and links to their public profiles or portfolios are provided
                whenever possible. If you are an artist whose work appears here
                and you would like it removed or updated, please contact us and
                we will respond promptly.
              </p>
            </div>
            <div className="p-4 bg-second rounded">
              <p className="text-base text-normal text-justify">
                The site’s original code, tools, and written content are the
                sole work of the site’s developer and are shared for the
                enjoyment of the global MCU fan community. Nothing here should
                be interpreted as a claim of ownership over any Marvel or Disney
                intellectual property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
