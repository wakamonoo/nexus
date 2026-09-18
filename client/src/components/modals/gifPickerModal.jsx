"use client";
import { useEffect, useState } from "react";
import { MdClose, MdSearchOff } from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import GifLoader from "../loaders/gifLoader";
import Masonry from "react-masonry-css";

export default function GifPickerModal({ onSelect, setShowGifPickerModal }) {
  const [gifs, setGifs] = useState([]);
  const [query, setQuery] = useState("trending");
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQuery(inputValue.trim() || "trending");
    }, 300);

    return () => clearTimeout(debounce);
  }, [inputValue]);

  useEffect(() => {
    const fetchGifs = async () => {
      try {
        setIsLoading(true);
        setGifs([]);

        const res = await fetch(
          `https://api.klipy.com/v2/search?q=${query}&key=${process.env.NEXT_PUBLIC_KLIPY_KEY}&limit=50`,
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
        onClick={() => setShowGifPickerModal(false)}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-md max-h-[60vh] overflow-hidden rounded-2xl border border-panel bg-second shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-panel p-4">
            <h1 className="text-base font-bold text-normal">Choose GIF</h1>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGifPickerModal(false);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-vibe transition hover:bg-[var(--color-panel)] hover:text-[var(--color-accent)] shrink-0"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex w-full justify-between items-center gap-2 bg-panel px-4 py-2 rounded-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search KLIPY.."
                className="w-full outline-none text-base text-normal"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto custom-scroll p-4">
            {isLoading ? (
              <div className="w-full mt-2">
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
              <Masonry
                breakpointCols={2}
                className="flex gap-2"
                columnClassName="space-y-2"
              >
                {gifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.media_formats.tinygif.url}
                    alt="gif"
                    loading="lazy"
                    decoding="async"
                    className="w-full break-inside-avoid cursor-pointer rounded hover:opacity-80"
                    onClick={() => onSelect(gif.media_formats.gif.url)}
                  />
                ))}
              </Masonry>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
