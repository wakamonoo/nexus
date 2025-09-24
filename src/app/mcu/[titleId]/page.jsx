"use client";
import { useContext, useEffect, useState } from "react";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loader from "@/components/loader";
import {
  FaAngleLeft,
  FaClipboardList,
  FaCrown,
  FaEye,
  FaPlay,
  FaUser,
} from "react-icons/fa";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Alt from "@/assets/fallback.png";

export default function Title() {
  const { titles, pageLoad } = useContext(TitleContext);
  const { titleId } = useParams();
  const router = useRouter();
  const [showFull, setShowFull] = useState(false);
  const [showSum, setShowSum] = useState(false);

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
        <p className="text-sm text-vibe">
          Chronological Order:{" "}
          <span className="font-bold capitalize">{title.order}</span>
        </p>
      </div>
      <div className="flex justify-between w-full">
        <div className="w-[50%]">
          <div>
            <h4 className="text-2xl font-bold text-normal leading-5">
              {title.title}
            </h4>
            <p className="text-sm text-vibe">
              {title.duration
                ? `${title.duration} minutes`
                : `${title.episode} episodes`}
            </p>
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-sm text-vibe">
              Directed by{" "}
              <span
                className={`font-bold text-base capitalize cursor-pointer leading-4.5 ${
                  !showFull ? "line-clamp-1" : ""
                }`}
                onClick={() => setShowFull(!showFull)}
              >
                {title.director}
              </span>
            </p>
            <p className="text-sm text-vibe">
              Release{" "}
              <span className="font-bold text-base capitalize">
                {format(new Date(title.date), "yyyy")}
              </span>
            </p>
            <p className="text-sm text-vibe">
              MCU{" "}
              <span className="font-bold text-base capitalize">
                {title.timeline}
              </span>
            </p>
          </div>
        </div>
        <div className="w-[40%]">
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
      <div className="flex justify-between gap-2 mt-2 items-center">
        <button className="bg-accent py-2 px-4 rounded-full flex items-center gap-2 font-bold cursor-pointer">
          <FaPlay className="text-xl" />
          <span className="text-base text-normal">Watch Trailer</span>
        </button>
        <h1 className="text-base uppercase">
          <span className="text-2xl font-bold">#1</span>Ranked
        </h1>
      </div>
      <div>
        <p
          onClick={() => setShowSum(!showSum)}
          className={`leading-4.5 text-base text-normal text-vibe text-justify py-4 cursor-pointer ${
            !showSum ? "line-clamp-4 max-h-[5.5rem]" : ""
          }`}
        >
          {title.summary}
        </p>
      </div>
      <div className="w-full flex flex-wrap gap-2 mt-4">
        <button className="flex flex-1 gap-1 justify-center items-center px-4 py-2 bg-second rounded-full cursor-pointer">
          <FaClipboardList className="text-2xl" />
          <p className="text-base text-normal font-bold">Review</p>
        </button>
        <button className="flex flex-1 gap-1 justify-center items-center px-4 py-2 bg-second rounded-full cursor-pointer">
          <FaCrown className="text-2xl" />
          <p className="text-base text-normal font-bold">Rank</p>
        </button>
      </div>

      <div className="py-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2 bg-second p-2 rounded">
          <div className="flex items-center gap-2">
            <Image
              src={Alt}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-8 rounded-full"
            />
            <p>User</p>
          </div>
          <p>
            A visually stunning entry with strong performances. Some pacing
            issues, but overall a great watch.
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-second p-2 rounded">
          <div className="flex items-center gap-2">
            <Image
              src={Alt}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-8 rounded-full"
            />
            <p>User</p>
          </div>
          <p>
            An absolute masterpiece—balanced action, humor, and heart. One of
            the best in the MCU.
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-second p-2 rounded">
          <div className="flex items-center gap-2">
            <Image
              src={Alt}
              alt="user"
              width={0}
              height={0}
              sizes="100vw"
              className="w-8 h-8 rounded-full"
            />
            <p>User</p>
          </div>
          <p>
            Solid storytelling and character growth. Could’ve used a tighter
            ending, but still highly enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}
