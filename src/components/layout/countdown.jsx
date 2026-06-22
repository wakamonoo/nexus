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

  const nextOne = upcomingTitles
    ?.map((title) => ({
      ...title,
      dateUTC: dayjs.utc(title.date),
    }))
    ?.filter((title) => title.dateUTC.isAfter(now))
    ?.sort((a, b) => a.dateUTC.diff(b.dateUTC))[0];

  if (!nextOne) return null;

  const target = nextOne.dateUTC;
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
          backgroundImage: `url(${nextOne?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-xl text-center">Countdown to {nextOne?.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{days}</p>
            <p className="text-xs">Days</p>
          </div>
          <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{hours}</p>
            <p className="text-xs">Hours</p>
          </div>
          <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{minutes}</p>
            <p className="text-xs">Minutes</p>
          </div>
          <div className="w-18 h-18 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{seconds}</p>
            <p className="text-xs">Seconds</p>
          </div>
        </div>
        <div className="relative w-full flex items-center justify-center gap-2 p-2 mt-2">
        
            <p
              className={`absolute text-xs text-center text-vibe transition-opacity duration-700 ${globalShow ? "opacity-100" : "opacity-0"}`}
            >
              {dayjs.utc(nextOne?.date).format("MMM DD, YYYY HH:mm")} global
              relese date | UTC
            </p>
            <p
              className={`absolute text-xs text-center text-vibe transition-opacity duration-700 ${localShow ? "opacity-100" : "opacity-0"}`}
            >
              {dayjs
                .utc(nextOne?.date)
                .tz(userTimeZone)
                .format("MMM DD, YYYY HH:mm")}{" "}
              local time release
            </p>
        </div>
      </div>
    </div>
  );
}
