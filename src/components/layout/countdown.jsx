"use client";

import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

export default function Countdown() {
  const { upcomingTitles } = useContext(TitleContext);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nextOne = upcomingTitles
    ?.filter((title) => new Date(title.date) > now.toDate())
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const target = dayjs.utc(nextOne?.date + "T02:00:00Z");
  const timeLeft = dayjs.duration(target.diff(now));

  const months = timeLeft.months();
  const days = timeLeft.days();
  const hours = timeLeft.hours();
  const minutes = timeLeft.minutes();
  const seconds = timeLeft.seconds();

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
        <h1 className="text-2xl text-center">Countdown to {nextOne?.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          <div className="w-14 h-14 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{months}</p>
            <p className="text-xs">Months</p>
          </div>
          <div className="w-14 h-14 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{days}</p>
            <p className="text-xs">Days</p>
          </div>
          <div className="w-14 h-14 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{hours}</p>
            <p className="text-xs">Hours</p>
          </div>
          <div className="w-14 h-14 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{minutes}</p>
            <p className="text-xs">Minutes</p>
          </div>
          <div className="w-14 h-14 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{seconds}</p>
            <p className="text-xs">Seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4">
          <div className="flex-1 border-t border-vibe" />
          <p className="text-xs text-center text-vibe mt-2">
            {new Date(nextOne?.date).toLocaleDateString([], {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            GLOBAL RELEASE DATE
          </p>
          <div className="flex-1 border-t border-vibe" />
        </div>
      </div>
    </div>
  );
}
