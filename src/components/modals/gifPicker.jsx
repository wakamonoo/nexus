"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import Image from "next/image";
import Loader from "../loaders/loader";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { HiOutlineSearch } from "react-icons/hi";
import GifLoader from "../loaders/gifLoader";

export default function GifPicker({ onSelect, setShowGifPicker }) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState("trending");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        setIsLoading(true);
        setGifs([]);

        const res = await fetch(
          `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.NEXT_PUBLIC_TENOR_KEY}&limit=12`
        );

        const data = await res.json();
        setTimeout(() => {
          setGifs(data.results || []);
          setIsLoading(false);
        }, 400);
      } catch (err) {
        console.error("failed to fetch gifs", err);
      }
    };

    fetchGifs();
  }, [query]);

  return (
    <>
      <div
        onClick={() => setShowGifPicker(false)}
        className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative justify-center bg-second border-1 border-panel w-84 md:w-96 h-[60vh] rounded-2xl overflow-hidden p-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowGifPicker(false);
            }}
            className="absolute cursor-pointer top-4 right-4 font-bold duration-200 hover:scale-110 active:scale-110"
          >
            <MdClose className="text-2xl" />
          </button>
          <div className="mt-10 flex flex-col w-full">
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                onChange={(e) => setQuery(e.target.value || "trending")}
                placeholder="Search for GIFS.."
                className="w-full outline-none text-base text-normal"
              />
            </div>
            {isLoading ? (
              <div className="w-full mt-4">
                <GifLoader />
              </div>
            ) : gifs.length === 0 ? (
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center justify-center">
                  <MdSearchOff className="text-4xl text-vibe opacity-40" />
                  <p className="text-xs text-vibe opacity-40">
                    No results for <span className="font-bold">{query}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 overflow-y-auto custom-scroll w-full h-full mt-4">
                {gifs.map((gif) => (
                  <Image
                    key={gif.id}
                    src={gif.media_formats.tinygif.url}
                    alt="gif"
                    width={0}
                    height={0}
                    sizes="100vw"
                    unoptimized
                    className="w-full h-auto cursor-pointer rounded hover:opacity-80"
                    onClick={() => onSelect(gif.media_formats.gif.url)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
