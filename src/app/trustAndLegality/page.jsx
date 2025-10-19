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
            <a href="" className="font-bold">
              Marvel Studios
            </a>
            ,{" "}
            <a href="" className="font-bold">
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
            the global MCU fan community. This site makes no claim of ownership
            over any{" "}
            <a href="" className="font-bold">
              Marvel
            </a>{" "}
            or{" "}
            <a href="" className="font-bold">
              Disney
            </a>{" "}
            intellectual property.
          </p>
        </div>
        <div>
          <h1 className="text-2xl py-4 text-accent text-center">
            Poster & Artwork
          </h1>
          <p className="text-base text-justify">
            All movie poster artwork featured on this site has been sourced from
            publicly available entries on{" "}
            <a href="" className="font-bold">
              The Poster Database (TPDb)
            </a>
            . Full credit is given to the original artists, and links to their
            TPDb profiles or other public portfolios are provided below. If you
            are an artist and would like your work removed or updated, please
            contact me and we will respond promptly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 py-2">
            {titles.map((title, index) => (
              <a
                href={title.posterCreditUrl}
                key={index}
                className="flex gap-4 p-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-bg)] rounded-l-full"
              >
                <p className="truncate w-[40%] font-bold">{title.title}</p>
                <div className="flex items-center">
                  <Image
                    src={TDBP}
                    alt="poster"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-14 h-auto rounded"
                  />
                  <p className="text-base font-bold truncate">/{title.posterCredit}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
