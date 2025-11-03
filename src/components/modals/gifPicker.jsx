"use client";
import { UserContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import Loader from "../loaders/loader";
import Swal from "sweetalert2";
import RegularButtons from "../buttons/regBtns";
import { HiOutlineSearch } from "react-icons/hi";

export default function GifPicker({ onSelect, setShowGifPicker }) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState("trending");

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const res = await fetch(
          `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.NEXT_PUBLIC_TENOR_KEY}&limit=12`
        );

        const data = await res.json();
        setGifs(data.results || []);
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
          <div className="mt-8 flex flex-col w-full">
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                onChange={(e) => setQuery(e.target.value || "trending")}
                placeholder="Search for GIFS.."
                className="w-full outline-none text-base text-normal"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto custom-scroll h-full mt-4">
              {gifs.map((gif) => (
                <Image
                  key={gif.id}
                  src={gif.media_formats.tinygif.url}
                  alt="gif"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto cursor-pointer rounded hover:opacity-80"
                  onClick={() => onSelect(gif.media_formats.gif.url)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
