"use client";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Avatar from "@/assets/defaultAvatar.png";
import CountUp from "react-countup";
import { LoaderContext } from "@/context/loaderContext";
import { GiTrophy } from "react-icons/gi";
import { FaArrowRight, FaMedal } from "react-icons/fa";
import ScreenTimeLoader from "../../loaders/topWatchersLoader";
import TopWatchersLoader from "../../loaders/topWatchersLoader";
import RegularButtons from "@/components/buttons/regBtns";
import TopWatchersModal from "@/components/modals/topWatchersModal";
import SecondaryButtons from "@/components/buttons/secBtns";

export default function ScreenTime() {
  const { user, allUsers, allUsersLoading } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showTopWatchersModal, setShowTopWatchersModal] = useState(false);
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
      rank: currentRank,
    };
  });

  const topWatchers = rankedUsers.filter((user) => user.rank <= 3);

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

    return <span className="font-bold text-accent">#{rank}</span>;
  };

  return (
    <>
      <div className="mt-2 w-full">
        <div className="flex items-center gap-2 pb-2">
          <p className="text-base font-bold text-vibe opacity-60">
            Top Watchers
          </p>
          <div className="flex-1 border-t-2 border-panel" />
        </div>
        {allUsersLoading ? (
          <TopWatchersLoader />
        ) : (
          <div className="bg-linear-to-b from-(--color-panel) to-(--color-secondary) p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Who's on top?</h2>
                <p className="text-xs text-vibe">See who leads the community</p>
              </div>
              <GiTrophy className="text-3xl text-zeus" />
            </div>
            <div className="space-y-3">
              {topWatchers?.map((watcher, index) => (
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
                      <div className="w-7 flex justify-center">
                        {rankIcon(watcher.rank)}
                      </div>
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
                        <p className="text-xs text-vibe">Rank #{watcher.rank}</p>
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
            <div className="mt-4 ml-auto w-fit">
              <button onClick={() => setShowTopWatchersModal(true)} className="flex items-center justify-center gap-2">
                <p className="text-xs text-vibe">View Full Leaderboard</p>
                <FaArrowRight className="text-xs text-vibe" />
              </button>
            </div>
          </div>
        )}
      </div>
      {showTopWatchersModal && (
        <TopWatchersModal setShowTopWatchersModal={setShowTopWatchersModal} />
      )}
    </>
  );
}
