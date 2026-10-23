"use client";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Avatar from "@/assets/defaultAvatar.png";
import CountUp from "react-countup";
import { LoaderContext } from "@/context/loaderContext";
import { GiTrophy } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function TopWatchersModal({ setShowTopWatchersModal }) {
  const { user, allUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const sortedUsers = [...allUsers].sort(
    (a, b) => (b.totalWatched || 0) - (a.totalWatched || 0),
  );

  let previousScrore = null;
  let currentRank = 0;

  const rankedUsers = sortedUsers.map((user, index) => {
    const score = user.totalWatched || 0;

    if (score !== previousScrore) {
      currentRank = index + 1;
      previousScrore = score;
    }

    return {
      ...user,
      rank: score > 0 ? currentRank : null,
    };
  });

  const activeRankedUsers = rankedUsers.filter(
    (u) => (u.totalWatched || 0) > 0,
  );
  const unrankedUsers = rankedUsers.filter((u) => (u.totalWatched || 0) === 0);

  const rankIcon = (rank) => {
    if (rank === 1) {
      return <GiTrophy className="text-zeus text-2xl" />;
    }

    if (rank === 2) {
      return <FaMedal className="text-gray-400 text-xl" />;
    }

    if (rank === 3) {
      return <FaMedal className="text-amber-600 text-xl" />;
    }

    return <span className="font-bold text-xs text-accent">{rank}</span>;
  };

  return (
    <div
      onClick={() => setShowTopWatchersModal(false)}
      className="fixed inset-0 z-150 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-xl max-h-[80vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-panel p-4">
          <h1 className="text-base font-bold text-normal">Who's on top?</h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTopWatchersModal(false);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-(--color-panel) hover:text-(--color-accent) shrink-0"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto custom-scroll p-4">
          <div className="space-y-3">
            {activeRankedUsers?.map((watcher, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/profile/${watcher.uid}`);
                }}
                className={`w-full cursor-pointer rounded-xl border ${watcher.uid === user?.uid ? "bg-accent" : "bg-panel"} border-(--color-secondary) p-3 transition-all duration-200 active:bg-(--color-secondary) active:-translate-y-0.5 active:border-(--color-panel) hover:bg-(--color-secondary) hover:-translate-y-0.5 hover:border-(--color-panel)`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {watcher.rank <= 3 && (
                      <div className="w-7 flex justify-center">
                        {rankIcon(watcher.rank)}
                      </div>
                    )}
                    <img
                      src={watcher.picture || Avatar.src}
                      alt={watcher.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-bold text-base truncate max-w-35">
                        {watcher.name}
                      </p>
                      <p className="text-xs text-vibe">Rank {watcher.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CountUp
                      end={watcher.totalWatched || 0}
                      duration={1.5}
                      className="text-xl font-bold"
                    />
                    <p className="text-xs text-vibe">total watched</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="w-full h-px bg-panel my-3" />
          <div className="space-y-3">
            {unrankedUsers?.map((watcher, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/profile/${watcher.uid}`);
                }}
                className={`w-full cursor-pointer rounded-xl border ${watcher.uid === user?.uid ? "bg-accent" : "bg-panel"} border-(--color-secondary) p-3 transition-all duration-200 active:bg-(--color-secondary) active:-translate-y-0.5 active:border-(--color-panel) hover:bg-(--color-secondary) hover:-translate-y-0.5 hover:border-(--color-panel)`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={watcher.picture || Avatar.src}
                      alt={watcher.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-bold text-base truncate max-w-35">
                        {watcher.name}
                      </p>
                      <p className="text-xs text-vibe">Unranked</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CountUp
                      end={watcher.totalWatched || 0}
                      duration={1.5}
                      className="text-xl font-bold"
                    />
                    <p className="text-xs text-vibe">total watched</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
