"use client";

import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Countdown() {
  const { upcomingTitles } = useContext(TitleContext);
  const [now, setNow] = useState(dayjs.utc());
  const [globalShow, setGlobalShow] = useState(true);
  const [localShow, setLocalShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs.utc());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalShow((prev) => !prev);
      setLocalShow((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const titles = upcomingTitles?.map((title) => ({
    ...title,
    dateUTC: dayjs.utc(title.date),
  }));

  const latestRelased = titles
    ?.filter((title) => title.dateUTC.isBefore(now))
    ?.sort((a, b) => a.dateUTC.diff(b.dateUTC))[0];

  const nextUpcomming = titles
    ?.filter((title) => title.dateUTC.isAfter(now))
    ?.sort((a, b) => a.dateUTC.diff(b.dateUTC))[0];

  const showReleased =
    latestRelased && now.diff(latestRelased.dateUTC, "day", true) < 7;

  const displayTitle = showReleased ? latestRelased : nextUpcomming;

  if (!displayTitle) return null;

  const target = displayTitle.dateUTC;
  const distance = target.diff(now);

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="mt-2 w-full">
      <div
        className="p-2"
        style={{
          backgroundImage: `url(${displayTitle?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {nextUpcomming && (
          <>
            <h1 className="text-xl text-center">
              Countdown to {displayTitle?.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
              <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
                <span className="countdown text-3xl font-bold">
                  <span
                    style={{ "--value": days, "--digits": 2 }}
                    aria-live="polite"
                    aria-label={days}
                  />
                </span>
                <p className="text-xs">Days</p>
              </div>
              <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
                <span className="countdown text-3xl font-bold">
                  <span
                    style={{ "--value": hours, "--digits": 2 }}
                    aria-live="polite"
                    aria-label={hours}
                  />
                </span>
                <p className="text-xs">Hours</p>
              </div>
              <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
                <span className="countdown text-3xl font-bold">
                  <span
                    style={{ "--value": minutes, "--digits": 2 }}
                    aria-live="polite"
                    aria-label={minutes}
                  />
                </span>
                <p className="text-xs">Minutes</p>
              </div>
              <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
                <span className="countdown text-3xl font-bold">
                  <span
                    style={{ "--value": seconds, "--digits": 2 }}
                    aria-live="polite"
                    aria-label={seconds}
                  />
                </span>
                <p className="text-xs">Seconds</p>
              </div>
            </div>
            <div className="relative w-full flex items-center justify-center gap-2 p-2 mt-2">
              <p
                className={`absolute text-xs text-center text-vibe transition-opacity duration-700 ${globalShow ? "opacity-100" : "opacity-0"}`}
              >
                <span className="font-bold">UTC: </span>
                {dayjs.utc(displayTitle?.date).format("MMM DD, YYYY HH:mm")}
              </p>
              <p
                className={`absolute text-xs text-center text-vibe transition-opacity duration-700 ${localShow ? "opacity-100" : "opacity-0"}`}
              >
                <span className="font-bold">Local: </span>
                {dayjs
                  .utc(displayTitle?.date)
                  .tz(userTimeZone)
                  .format("MMM DD, YYYY HH:mm")}{" "}
              </p>
            </div>
          </>
        )}
        {latestRelased && (
          <div className="flex flex-col items-center justify-center leading-none">
            <h1 className="text-4xl font-bold text-center tracking-tight">
              {displayTitle?.title}
            </h1>
            <p className="uppercase text-sm font-alt text-vibe tracking-[0.35em]">
              Is now showing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
