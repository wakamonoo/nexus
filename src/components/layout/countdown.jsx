"use client";

import { TitleContext } from "@/context/titleContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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

  const target = dayjs(nextOne?.date);
  const timeLeft = dayjs.duration(target.diff(now));

  const months = timeLeft.months();
  const days = timeLeft.days();
  const hours = timeLeft.hours();
  const minutes = timeLeft.minutes();
  const seconds = timeLeft.seconds();

  return (
    <div className="mt-2 px-2 w-full">
      <div
        className="border border-panel rounded p-4"
        style={{
          backgroundImage: `url(${nextOne?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-xl text-center">Countdown to {nextOne?.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-4">
          <div className="w-20 h-20 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{months}</p>
            <p className="text-xs">Months</p>
          </div>
          <div className="w-20 h-20 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{days}</p>
            <p className="text-xs">Days</p>
          </div>
          <div className="w-20 h-20 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{hours}</p>
            <p className="text-xs">Hours</p>
          </div>
          <div className="w-20 h-20 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{minutes}</p>
            <p className="text-xs">Minutes</p>
          </div>
          <div className="w-20 h-20 flex flex-col items-center justify-center border border-panel rounded bg-[var(--color-panel)]/60 p-4">
            <p className="font-alt text-2xl font-bold">{seconds}</p>
            <p className="text-xs">Seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
