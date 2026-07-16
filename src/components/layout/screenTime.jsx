"use client";

import { UserContext } from "@/context/userContext";
import { LoaderContext } from "@/context/loaderContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Fallback from "@/assets/fallback.png";
import { GiTrophy } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";

export default function ScreenTime() {
  const { allUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const topWatchers = [...(allUsers || [])]
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

    return (
      <span className="font-bold text-accent text-sm">
        #{rank}
      </span>
    );
  };

  return (
    <div className="mt-3 w-full rounded-2xl bg-panel border border-base-300 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Screen Time</h2>
          <p className="text-xs text-vibe">
            Members with the most watched titles
          </p>
        </div>

        <GiTrophy className="text-zeus text-3xl" />
      </div>

      <div className="space-y-3">
        {topWatchers.map((user, index) => (
          <button
            key={user.uid}
            onClick={() => {
              setIsLoading(true);
              router.push(`/profile/${user.uid}`);
            }}
            className="w-full rounded-xl border border-base-300 bg-base-100 p-3 transition-all duration-200 hover:bg-base-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 flex justify-center">
                  {rankIcon(index + 1)}
                </div>

                <Image
                  src={user.picture || Fallback}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="text-left">
                  <p className="font-semibold truncate max-w-[140px]">
                    {user.name}
                  </p>

                  <p className="text-xs text-vibe">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold">
                  {user.totalWatched || 0}
                </p>

                <p className="text-xs text-vibe">
                  titles watched
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}