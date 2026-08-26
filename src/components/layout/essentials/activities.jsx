"use client";
import { SocketContext } from "@/context/socketContext";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Avatar from "@/assets/defaultAvatar.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import ActivitiesLoader from "@/components/loaders/activitiesLoader";
import { LoaderContext } from "@/context/loaderContext";

dayjs.extend(relativeTime);

export default function Activities() {
  const { activities } = useContext(SocketContext);
  const { allUsers } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  return (
    <div className="mt-2 w-full">
      <div className="flex items-center gap-2 pb-2">
        <p className="text-base font-bold text-vibe opacity-60">Activities</p>
        <div className="flex-1 border-t-2 border-panel" />
      </div>
      {!activities || !allUsers ? (
        <ActivitiesLoader />
      ) : activities.length === 0 ? (
        <div className="rounded-lg border border-panel bg-second px-4 py-2 text-center">
          <p className="text-sm text-vibe opacity-60">No Activities Yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {activities.slice(0, 5).map((activity) => {
            const user = allUsers.find((u) => u.uid === activity?.userId);

            return (
              <div
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/profile/${user.uid}`);
                }}
                key={activity.activityId}
                className="rounded-lg border border-panel bg-second flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-[var(--color-panel)] hover:border-[var(--color-secondary)] active:bg-[var(--color-panel)] active:border-[var(--color-secondary)]"
              >
                <img
                  src={user?.picture || Avatar.src}
                  alt={user?.name}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5 truncate">
                    <span className="font-semibold text-normal ">
                      {user?.name}
                    </span>{" "}
                    <span className="text-vibe opacity-60">
                      {activity?.message}
                    </span>
                  </p>
                  <p className="text-xs text-vibe opacity-60">
                    {(() => {
                      const diffWeeks = dayjs().diff(
                        dayjs(activity.date),
                        "week",
                      );
                      if (diffWeeks < 1) {
                        return dayjs(activity.date).fromNow();
                      }
                      return new Date(activity.date).toLocaleDateString([], {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      });
                    })()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
