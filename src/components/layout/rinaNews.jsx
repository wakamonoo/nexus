"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import CircledButtons from "../buttons/circledBtns";
import RinaLoaderNews from "../loaders/rinaLoaderNews";

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
  const [showNews, setShowNews] = useState(true);
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

  return (
    <>
      {!news ? (
        <div className="p-8">
          <RinaLoaderNews />
        </div>
      ) : (
        <>
          {showNews && (
            <div className="py-2 w-full">
              <div className="relative w-full h-auto cursor-pointer bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]">
                <div className="p-4 text-base font-normal text-justify">
                  <ReactMarkdown>{news?.report}</ReactMarkdown>
                </div>
              </div>
              <div className="mt-2">
                {news?.articles?.map((article, index) => (
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
                      className="w-32 h-auto object-cover"
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
                          {new Date(article?.publishedAt).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={!showNews ? "mt-2" : ""}>
            <CircledButtons onClick={() => setShowNews((prev) => !prev)}>
              {showNews ? "Hide News" : "View News"}
            </CircledButtons>
          </div>
        </>
      )}
    </>
  );
}
