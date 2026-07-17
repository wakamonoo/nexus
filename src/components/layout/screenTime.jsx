"use client";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Fallback from "@/assets/fallback.png";
import CountUp from "react-countup";
import { LoaderContext } from "@/context/loaderContext";
import { GiTrophy } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";
import ScreenTimeLoader from "../loaders/screenTimeLoader";

export default function ScreenTime() {
  const { allUsers, allUsersLoading } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const topWatchers = [...allUsers]
    .sort((a, b) => (b.totalWatched || 0) - (a.totalWatched || 0))
    .slice(0, 3);

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
  };

  return (
    <div className="mt-2 w-full">
      {allUsersLoading ? (
        <ScreenTimeLoader />
      ) : (
        <div className="bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Screen Time</h2>
              <p className="text-xs text-vibe">
                Users with the most watched titles
              </p>
            </div>
            <GiTrophy className="text-3xl text-zeus" />
          </div>
          <div className="space-y-3">
            {topWatchers?.map((user, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/profile/${user.uid}`);
                }}
                className="w-full cursor-pointer rounded-xl border bg-panel border-[var(--color-secondary)] p-3 transition-all duration-200 active:bg-[var(--color-secondary)] active:-translate-y-0.5 active:border-[var(--color-panel)] hover:bg-[var(--color-secondary)] hover:-translate-y-0.5 hover:border-[var(--color-panel)]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-7 flex justify-center">
                      {rankIcon(index + 1)}
                    </div>
                    <Image
                      src={user.picture || Fallback}
                      alt={user.name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-bold text-base truncate max-w-[140px]">
                        {user.name}
                      </p>
                      <p className="text-xs text-vibe">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <CountUp
                      end={user.totalWatched || 0}
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
      )}
    </div>
  );
}
