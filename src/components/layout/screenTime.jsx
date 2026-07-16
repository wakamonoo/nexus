"use client";
import { UserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Fallback from "@/assets/fallback.png";
import { LoaderContext } from "@/context/loaderContext";
import { GiTrophy } from "react-icons/gi";

export default function ScreenTime() {
  const { allUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  const topWatchers = [...(allUsers || [])]
    .sort((a, b) => (b.totalWatched || 0) - (a.totalWatched || 0))
    .slice(0, 3);

  return (
    <div className="mt-2 w-full">
      <div className="bg-panel p-2">
        {topWatchers?.map((user, index) => (
          <div key={index} className="flex justify-between items-center gap-2 py-1">
            <div className="flex items-center gap-2">
              {index + 1 === 1 ? <GiTrophy className="text-zeus text-2xl w-8" /> : <p className="text-sm text-accent w-8">{index + 1}</p>}
              <Image
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/profile/${user.uid}`);
                }}
                src={user.picture || Fallback}
                alt="user"
                width={0}
                height={0}
                sizes="100vw"
                className="w-12 h-12 object-cover rounded-full"
              />
              <p className="font-bold text-base truncate w-[80%]">
                {user.name}
              </p>
            </div>
            <p className="text-xs text-vibe">{user.totalWatched || 0} total watched</p>
          </div>
        ))}
      </div>
    </div>
  );
}
