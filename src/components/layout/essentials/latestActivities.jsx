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
  const { allUsers, allUsersLoading } = useContext(UserContext);
  const { setIsLoading } = useContext(LoaderContext);
  const router = useRouter();

  return (
    <div className="mt-2 w-full">
      <div className="flex items-center gap-2 pb-2">
        <p className="text-base font-bold text-vibe opacity-60">
          Latest Activities
        </p>
        <div className="flex-1 border-t-2 border-panel" />
      </div>
      {!activities || allUsersLoading ? (
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

                  if (activity?.type === "list") {
                    router.push(`/hex/lists/${activity?.listId}`);
                  } else if (activity?.type === "watch") {
                    router.push(`/profile/${activity?.userId}/#library`);
                  } else if (activity?.type === "review") {
                    router.push(`/profile/${activity?.userId}/#reviews`);
                  }
                }}
                key={activity.activityId}
                className="flex items-center gap-2 rounded-lg cursor-pointer border bg-panel border-[var(--color-secondary)] px-4 py-2 transition-all duration-200 active:bg-[var(--color-secondary)] active:-translate-y-0.5 active:border-[var(--color-panel)] hover:bg-[var(--color-secondary)] hover:-translate-y-0.5 hover:border-[var(--color-panel)]"
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
