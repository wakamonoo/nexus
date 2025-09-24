"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loader from "@/components/loader";
import { FaAngleLeft, FaClipboardList, FaCrown, FaEye, FaPlay } from "react-icons/fa";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function Title() {
  const { titles, pageLoad } = useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);

  if (pageLoad) {
    return <Loader />;
  }

  const title = titles.find((t) => t.titleId === titleId);

  if (!title) {
    return <p>not a title</p>;
  }

  return (
    <div className="p-8 bg-brand">
      <div className="flex justify-between py-4">
        <FaAngleLeft
          onClick={() => router.push("/mcu")}
          className="text-2xl cursor-pointer"
        />
        <div className="flex gap-2 items-center">
          <p className="text-base font-bold">Mark as watched</p>
          <FaEye className="text-2xl" />
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="w-[70%]">
          <h4 className="text-2xl font-bold text-normal">{title.title}</h4>
          <div className="flex flex-col mt-2">
            <p className="text-sm text-vibe">
              Release Date:{" "}
              <span className="font-bold capitalize">
                {format(new Date(title.date), "MMM. d, yyyy")}
              </span>
            </p>
            <p className="text-sm text-vibe">
              MCU Timeline:{" "}
              <span className="font-bold capitalize">{title.timeline}</span>
            </p>
            <p className="text-sm text-vibe">
              Chronological Order:{" "}
              <span className="font-bold capitalize">{title.order}</span>
            </p>
            <p className="text-base text-vibe leading-4.5">
              Directed by:{" "}
              <span
                className={`font-bold capitalize cursor-pointer ${
                  !showFull ? "line-clamp-1" : ""
                }`}
                onClick={() => setShowFull(!showFull)}
              >
                {title.director}
              </span>
            </p>
            <div className="flex gap-2 mt-2 items-center">
              <button className="bg-accent py-2 px-4 rounded-full flex items-center gap-2 font-bold cursor-pointer">
                <FaPlay className="text-xl" />
                <span className="text-base text-normal">Trailer</span>
              </button>
              <p className="text-base font-bold">
                {title.duration
                  ? `${title.duration} minutes`
                  : `${title.episode} episodes`}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <Image
            src={title.image}
            alt="poster"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded"
          />
        </div>
      </div>
      <div>
        <p className="leading-4.5 text-base text-normal text-vibe text-justify py-4">
          {title.summary}
        </p>
      </div>
      <div className="w-full flex gap-2">
        <button className="flex flex-1 gap-1 justify-center items-center px-4 py-2 bg-accent rounded-full cursor-pointer">
          <FaClipboardList className="text-2xl" />
          <p className="text-base text-normal font-bold">Review</p>
        </button>
        <button className="flex flex-1 gap-1 justify-center items-center px-4 py-2 bg-accent rounded-full cursor-pointer">
          <FaPlay className="text-2xl" />
          <p className="text-base text-normal font-bold">Play</p>
        </button>
        <button className="flex flex-1 gap-1 justify-center items-center px-4 py-2 bg-accent rounded-full cursor-pointer">
          <FaCrown className="text-2xl" />
          <p className="text-base text-normal font-bold">Rank</p>
        </button>
      </div>
    </div>
  );
}
