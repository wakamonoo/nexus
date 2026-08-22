"use client";
import NavBar from "@/components/layout/essentials/navBar";
import { useContext, useEffect } from "react";
import { LoaderContext } from "@/context/loaderContext";
import Image from "next/image";

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Disclaimer & Legal Notice",
    content: (
      <>
        <p>
          nexus is an independent, fan-made project created solely for
          entertainment and educational purposes.
        </p>
        <p>
          nexus not affiliated with, sponsored by, or in any way officially
          connected to{" "}
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
          , or any of their subsidiaries or affiliates.
        </p>
        <p>
          All Marvel-related trademarks, character names, titles, logos, and
          other intellectual property remain the property of their respective
          owners. nexus makes no claim of ownership over third-party
          intellectual property.
        </p>
        <p>
          The original code, systems, tools, design, and written content created
          for nexus belong to its developer and are provided as part of this
          independent fan project.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "TMDB Attribution",
    content: (
      <>
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
        <p>
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
          release information, posters, backdrops, descriptions, and related
          information.
        </p>
        <p>
          TMDB data helps power title discovery and information throughout
          nexus. nexus does not claim ownership of this third-party data.
        </p>
        <p>
          nexus is not affiliated with, endorsed, sponsored, or certified by
          TMDB. TMDB names, logos, and trademarks belong to their respective
          owners.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Third-Party Content",
    content: (
      <>
        <p>
          nexus may display content, metadata, artwork, links, or other
          materials provided by third-party services.
        </p>
        <p>
          Such materials remain subject to the rights, terms, and policies of
          their respective owners and providers.
        </p>
        <p>
          If you believe the content displayed on nexus infringes your rights
          please{" "}
          <a href="/recommendations">
            <strong>contact me</strong>
          </a>{" "}
          so the matter can be reviewed.
        </p>
      </>
    ),
  },
];

export default function TrustAndLegality() {
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Trust & Legality
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            Information about nexus, third-party intellectual property, and
            external services used by the platform
          </p>
          <p className="text-xs">
            Last updated:{" "}
            <strong className="font-medium opacity-60">August 17, 2026</strong>
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
          <p className="text-sm leading-7 opacity-60">
            nexus is an independent fan project and is not an official Marvel,
            Disney, or TMDB platform.
          </p>
        </div>
        <div className="divide-y divide-[var(--color-panel)]">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid grid-cols-[110px_1fr] py-8"
            >
              <div>
                <span className="text-sm font-bold tracking-[0.2em] text-accent/60">
                  {section.number}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="mb4 text-lg font-semibold tracking-tight text-vibe">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-tight text-vibe">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
