"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Rina from "../../assets/rina.png";
import RinaLoaderNews from "../loaders/rinaLoaderNews";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export default function RinaNews() {
  const [news, setNews] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const fetchNews = async () => {
        const res = await fetch(`${BASE_URL}/api/news/newsGet`);
        const data = await res.json();
        setNews(data);
      };

      fetchNews();
    } catch (err) {
      console.error;
    }
  }, []);

  const getPreview = (text, wordLimit = 40) => {
    if (!text) return "";

    const words = text.split(" ");
    return words.slice(0, wordLimit).join(" ");
  };

  const visibleArticles = showAllArticles
    ? news?.articles
    : news?.articles?.slice(0, 2);

  return (
    <>
      {!news ? (
        <div className="p-8">
          <RinaLoaderNews />
        </div>
      ) : (
        <div className="mt-2 w-full">
          <div className="flex items-center gap-2 pb-2">
            <p className="text-base font-bold text-vibe opacity-60">
              Intel Feed
            </p>
            <div className="flex-1 border-t-2 border-panel" />
          </div>
          <div className="relative w-full h-auto cursor-pointer bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)] p-4">
            <div className="flex gap-3 pb-4">
              <Image
                src={Rina}
                alt="file"
                width={0}
                height={0}
                sizes="100vw"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-base mt-2 font-bold leading-3.5 truncate">
                  Rina
                </p>
                <p className="text-xs text-vibe">
                  {new Date(news.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="text-base text-justify leading-5 whitespace-pre-wrap">
              {!showFull ? (
                <>
                  <ReactMarkdown>{getPreview(news?.report, 40)}</ReactMarkdown>
                  {news?.report.split(" ").length > 40 && (
                    <>
                      ...{" "}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFull(true);
                        }}
                        className="cursor-pointer text-base font-light text-normal opacity-60"
                      >
                        see more
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <ReactMarkdown>{news?.report}</ReactMarkdown>{" "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFull(false);
                    }}
                    className="cursor-pointer text-base font-light text-normal opacity-60"
                  >
                    see less
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="mt-2">
            {visibleArticles.map((article, index) => (
              <div
                key={index}
                onClick={() => router.push(`${article?.url}`)}
                className="bg-second flex gap-4 p-2 border-y border-panel cursor-pointer hover:bg-[var(--color-panel)]"
              >
                <img
                  src={article.image}
                  alt="article image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[24vh] h-auto object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-base text-zeus font-bold text-justify leading-5 whitespace-pre-wrap">
                    {article?.title}
                  </p>
                  <p className="text-sm text-vibe line-clamp-2">
                    {article?.description}
                  </p>
                  <p className="text-xs text-end mt-1 text-[var(--color-vibranium)]/60">
                    via {article.source} on{" "}
                    <span>
                      {new Date(article?.publishedAt).toLocaleDateString([], {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            {news?.articles?.length > 2 && (
              <div
                onClick={() => setShowAllArticles((prev) => !prev)}
                className="w-full flex justify-center items-center cursor-pointer"
              >
                {!showAllArticles ? (
                  <div className="flex flex-col justify-center items-center p-2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]/40">
                    <p className="text-xs">show all articles</p>
                    <FaAngleDown className="text-lg" />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center p-2 text-[var(--color-text)]/60 hover:text-[var(--color-text)]/40">
                    <p className="text-xs">show less articles</p>
                    <FaAngleUp className="text-lg" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
