"use client";
import NavBar from "@/components/layout/navBar";
import TDBP from "@/assets/tpdb.svg";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/context/titleContext";
import { LoaderContext } from "@/context/loaderContext";

export default function TrustAndLegality() {
  const { titles } = useContext(TitleContext);
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div>
          <h1 className="text-2xl py-4 text-accent text-center">
            Disclaimer & Legal Notice
          </h1>
          <p className="text-base text-justify">
            This website is an independent, fan-made project created solely for
            entertainment and educational purposes. I am not affiliated with,
            sponsored by, or in any way officially connected to{" "}
            <a
              href="https://www.marvel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Marvel Studios
            </a>
            ,{" "}
            <a
              href="https://thewaltdisneycompany.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              The Walt Disney Company
            </a>
            , or any of their subsidiaries or affiliates. All trademarks,
            character names, movie titles, logos, and other intellectual
            property referenced on this site remain the exclusive property of
            their respective copyright and trademark holders, including but not
            limited to Marvel and Disney.
            <br />
            <br />
            The site’s original code, tools, and written content are the sole
            creation of the site’s developer and are shared for the enjoyment of
            the global MCU fan community. This site{" "}
            <strong>makes no claim of ownership</strong> over any third-party
            intellectual property referenced on this website.
          </p>
        </div>
        <div className="">
          <h1 className="text-2xl py-4 text-accent text-center">
            TMDB Attribution
          </h1>
          <div className="w-full">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Movie Database"
              className="float-left w-32 mr-2"
            >
              <Image
                src="/tmdb_logo.svg"
                alt="The Movie Database"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            </a>
            <p className="text-base text-justify">
              This website uses the{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                The Movie Database (TMDB)
              </a>{" "}
              API to provide movie and television metadata, including titles,
              release information, posters, backdrops, descriptions, and other
              related information. The information provided through the TMDB API
              is used to help users discover and explore movies and television
              shows throughout the site. Nexus is an independent, fan-made
              project and is not affiliated with, endorsed by, sponsored by, or
              officially connected to TMDB. This website uses the TMDB API but
              is not endorsed or certified by TMDB. TMDB names, logos, and
              related trademarks belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
