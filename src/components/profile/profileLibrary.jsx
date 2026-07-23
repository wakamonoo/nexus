import { useContext, useState } from "react";
import { MdSensorsOff } from "react-icons/md";
import PostStructure from "../layout/postStructure";
import { UserContext } from "@/context/userContext";
import { TitleContext } from "@/context/titleContext";
import { optimizeCloudinary } from "@/utils/cloudinary";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";
import { TitleNavContext } from "@/context/titleNavContext";

export default function ProfileLibrary({ profileUserWatch, profileUser }) {
  const { titles, releasedMCUTitles } = useContext(TitleContext);
  const { handleShowNav } = useContext(TitleNavContext);
  const [sortBy, setSortBy] = useState("watch-recent");
  const { user } = useContext(UserContext);

  const releaseWatchOldest = [...profileUserWatch]
    .map((watch) => {
      const title = titles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        releaseDate: title?.date,
      };
    })
    .sort((a, b) => {
      const aDate = new Date(a.releaseDate);
      const bDate = new Date(b.releaseDate);

      return aDate - bDate;
    });

  const releaseWatchNewest = [...profileUserWatch]
    .map((watch) => {
      const title = titles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        releaseDate: title?.date,
      };
    })
    .sort((a, b) => {
      const aDate = new Date(a.releaseDate);
      const bDate = new Date(b.releaseDate);

      return bDate - aDate;
    });

  const WatchOldest = [...profileUserWatch].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return aDate - bDate;
  });

  const WatchNewest = [...profileUserWatch].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return bDate - aDate;
  });

  const Chronological = [...profileUserWatch]
    .map((watch) => {
      const title = releasedMCUTitles.find((t) => t.titleId === watch.titleId);

      return {
        ...watch,
        order: title?.order,
      };
    })
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
      {sortedWatch.length === 0 ? (
        <div className="mt-16">
          <div className="flex flex-col items-center justify-center">
            <MdSensorsOff className="text-4xl text-vibe opacity-40" />
            <p className="text-xs text-vibe opacity-40">
              {`${profileUser?.uid === user?.uid ? "you" : profileUser.name} have watched titles yet`}
            </p>
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
              className="bg-second rounded cursor-pointer text-sm border border-panel px-4 py-2.5 pr-4 outline-none transition-all duration-200 hover:border-[var(--color-secondary)] hover:bg-[var(--color-panel)] focus:border-[var(--color-secondary)] focus:bg-[var(--color-panel)]"
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
          <div className="flex flex-wrap justify-center gap-2">
            {sortedWatch.map((unit, index) => (
              <div
                key={index}
                onClick={() => handleShowNav(unit.titleId)}
                className="w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer"
              >
                <Image
                  src={optimizeCloudinary(unit.poster, 300) || Fallback}
                  alt="image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full object-fill rounded"
                />
              </div>
            ))}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
