import { useContext, useState } from "react";
import { MdSensorsOff } from "react-icons/md";
import { UserContext } from "@/context/userContext";
import { TitleContext } from "@/context/titleContext";
import { TitleNavContext } from "@/context/titleNavContext";
import TitleCard from "../title/titleCard";
import { WatchContext } from "@/context/watchContext";
import LibraryLoader from "@/components/loaders/libraryLoader";
import { FaClapperboard } from "react-icons/fa6";

export default function ProfileLibrary({ profileUserWatch, profileUser }) {
  const { titles, titlesLoad, releasedMCUTitles } = useContext(TitleContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const { isTitleWatched } = useContext(WatchContext);
  const [sortBy, setSortBy] = useState("watch-recent");
  const { user, allUsersLoading } = useContext(UserContext);

  const isLoading =
    titlesLoad || allUsersLoading || !profileUser || !profileUserWatch;

  const releaseWatchOldest = [...(profileUserWatch || [])]
    .map((watch) => {
      const title = titles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        releaseDate:
          title?.mediaType === "tv"
            ? title?.first_air_date
            : title?.release_date,
      };
    })
    .sort((a, b) => {
      const aDate = new Date(a.releaseDate);
      const bDate = new Date(b.releaseDate);

      return aDate - bDate;
    });

  const releaseWatchNewest = [...(profileUserWatch || [])]
    .map((watch) => {
      const title = titles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        releaseDate:
          title?.mediaType === "tv"
            ? title?.first_air_date
            : title?.release_date,
      };
    })
    .sort((a, b) => {
      const aDate = new Date(a.releaseDate);
      const bDate = new Date(b.releaseDate);

      return bDate - aDate;
    });

  const WatchOldest = [...(profileUserWatch || [])].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return aDate - bDate;
  });

  const WatchNewest = [...(profileUserWatch || [])].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return bDate - aDate;
  });

  const Chronological = [...(profileUserWatch || [])]
    .map((watch) => {
      const title = releasedMCUTitles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        order: title?.order,
      };
    })
    .filter((watch) => watch.order !== undefined)
    .sort((a, b) => {
      return a.order - b.order;
    });

  const sortedWatch = {
    "watch-recent": WatchNewest,
    "watch-earliest": WatchOldest,
    "release-newest": releaseWatchNewest,
    "release-oldest": releaseWatchOldest,
    chrono: Chronological,
  }[sortBy];

  return (
    <div className="w-full">
      {isLoading ? (
        <LibraryLoader />
      ) : sortedWatch.length === 0 ? (
        <div className="flex h-full w-full justify-center items-center my-16">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-panel flex items-center justify-center">
              <FaClapperboard className="text-5xl text-vibe opacity-60 p-2" />
            </div>
            <div className="w-40 text-center">
              <p className="text-xs text-vibe opacity-60 leading-tight">
                {`${profileUser?.uid === user?.uid ? "You" : profileUser.name} have no watched titles yet`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 py-4 px-2 sm:px-4 md:px-8">
          <div className="flex justify-end px-4 pb-4">
            <select
              name="sort"
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-second rounded cursor-pointer text-sm border border-panel px-4 py-2.5 pr-4 outline-none transition-all duration-200 hover:border-(--color-secondary) hover:bg-(--color-panel) focus:border-(--color-secondary) focus:bg-(--color-panel)"
            >
              <optgroup label="Watched" className="text-sm font-bold text-vibe">
                <option value="watch-recent" className="text-xs text-vibe">
                  Recently Watched
                </option>
                <option value="watch-earliest" className="text-xs text-vibe">
                  Earliest Watched
                </option>
              </optgroup>
              <optgroup
                label="Release Date"
                className="text-sm font-bold text-vibe"
              >
                <option value="release-newest" className="text-xs text-vibe">
                  Newest First
                </option>
                <option value="release-oldest" className="text-xs text-vibe">
                  Oldest First
                </option>
              </optgroup>
              <option value="chrono" className="text-sm font-bold text-vibe">
                MCU Chronological Order
              </option>
            </select>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,104px)] md:grid-cols-[repeat(auto-fill,128px)] justify-center gap-2">
            {sortedWatch.map((unit) => {
              const title = titles.find((t) => t.titleId === unit.titleId);

              if (!title) return null;

              return (
                <TitleCard
                  key={title.titleId}
                  unit={title}
                  isWatched={isTitleWatched(title.titleId)}
                  onOpen={() => handleShowNav(title.titleId)}
                />
              );
            })}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
