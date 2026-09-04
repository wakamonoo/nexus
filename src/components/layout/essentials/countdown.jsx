"use client";

import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CountdownLoader from "../../loaders/countdownLoader";
import { TitleNavContext } from "@/context/titleNavContext";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Countdown() {
  const { titles, titlesLoad } = useContext(TitleContext);
  const [now, setNow] = useState(dayjs.utc());
  const [globalShow, setGlobalShow] = useState(true);
  const [localShow, setLocalShow] = useState(false);
  const { handleShowNav } = useContext(TitleNavContext);

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

  const mappedTitles = titles?.map((title) => {
    const releaseDate =
      title.mediaType === "tv" ? title.first_air_date : title.release_date;

    return {
      ...title,
      dateUTC: dayjs.utc(releaseDate),
    };
  });

  const latestRelased = mappedTitles
    ?.filter(
      (title) => title.status === "released" && title.dateUTC.isBefore(now),
    )
    ?.sort((a, b) => b.dateUTC.diff(a.dateUTC))[0];

  const nextUpcomming = mappedTitles
    ?.filter(
      (title) => title.status === "upcoming" && title.dateUTC.isAfter(now),
    )
    ?.sort((a, b) => a.dateUTC.diff(b.dateUTC))[0];

  const showReleased =
    latestRelased && now.diff(latestRelased.dateUTC, "day", true) < 7;

  const displayTitle = showReleased ? latestRelased : nextUpcomming;

  if (titlesLoad) {
    return (
      <div className="mt-2 w-full">
        <CountdownLoader />
      </div>
    );
  }

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
        onClick={() => handleShowNav(displayTitle.titleId)}
        className="p-2 cursor-pointer"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${displayTitle?.backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!showReleased && nextUpcomming && (
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
                {dayjs
                  .utc(
                    displayTitle?.release_date
                      ? displayTitle?.release_date
                      : displayTitle?.first_air_date,
                  )
                  .format("MMM DD, YYYY HH:mm")}
              </p>
              <p
                className={`absolute text-xs text-center text-vibe transition-opacity duration-700 ${localShow ? "opacity-100" : "opacity-0"}`}
              >
                <span className="font-bold">Local: </span>
                {dayjs
                  .utc(
                    displayTitle?.release_date
                      ? displayTitle?.release_date
                      : displayTitle?.first_air_date,
                  )
                  .tz(userTimeZone)
                  .format("MMM DD, YYYY HH:mm")}{" "}
              </p>
            </div>
          </>
        )}
        {showReleased && latestRelased && (
          <div className="flex flex-col items-center justify-center leading-none">
            <p className="uppercase text-xs text-vibe tracking-[0.3em]">
              Now Showing
            </p>
            <h1 className="text-4xl font-bold text-center tracking-tight">
              {displayTitle?.title}
            </h1>
            <div className="flex items-center gap-2 pb-2 w-3/4">
              <div className="flex-1 border-t-2 border-accent" />
              <p className="text-xs text-vibe tracking-[0.3em] shrink-0">
                Released{" "}
                <span>{latestRelased.dateUTC.format("MMM DD, YYYY")}</span>
              </p>
              <div className="flex-1 border-t-2 border-accent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
