"use client";
import NavBar from "@/components/layout/essentials/navBar";

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Why Nexus Exists",
    content: (
      <>
        <p>
          Nexus began as my personal guide while rewatching the entire{" "}
          <strong>Marvel Cinematic Universe (MCU)</strong> in chronological
          order. At the time, it was called <strong>616-Initiative</strong>
        </p>
        <p>
          While browsing social media, I noticed how many fans were looking for
          different ways to experience Marvel stories, whether by release order,
          chronology, or their own preferred journey
        </p>
        <p>
          What started as personal watch tracker gradually became something
          bigger. A place where fans could explore Marvel stories, keep track of
          what they've watched, share their opinions, and connect with others.
        </p>
        <p>
          The website was eventually rebranded as <strong>Nexus</strong>.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "What is Nexus?",
    content: (
      <>
        <p>
          Nexus is an independent fan community platform built around the{" "}
          <strong>Marvel Cinematic Universe</strong>, providing tools to make
          exploring, tracking, and discussing its stories more organized and
          personal.
        </p>
        <p>
          As the platform grew, Nexus expanded beyond the MCU to include
          selected Marvel stories from other continuities, universes, timelines
          and eras.
        </p>
        <p>
          The MCU remains at the heart of Nexus, while its extended collection
          gives fans a broader way to explore the Marvel stories connected to,
          adjacent to, or existing beyond it.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "What You'll Find Here",
    content: (
      <>
        <p>
          Nexus combines discovery, tracking, and community features designed
          primarily for MCU fans, with additional tools for exploring Marvel
          stories beyond the MCU.
        </p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            Marvel title discovery and information
          </li>
          <li className={listItemClass}>
            MCU and Marvel-related watch tracking
          </li>
          <li className={listItemClass}>
            Chronological and release-order guides
          </li>
          <li className={listItemClass}>
            Marvel-adajacent and multiversal content guides
          </li>
          <li className={listItemClass}>
            Personal watch progress and statistics
          </li>
          <li className={listItemClass}>Custom lists and collections</li>
          <li className={listItemClass}>Reviews and rankings</li>
          <li className={listItemClass}>Community posts and rankings</li>
          <li className={listItemClass}>Global messaging</li>
          <li className={listItemClass}>
            User profiles and profile customization
          </li>
          <li className={listItemClass}>Community rankings and leaderboards</li>
          <li className={listItemClass}>Marvel related news and updates</li>
          <li className={listItemClass}>
            Notifications and other community features
          </li>
          <li className={listItemClass}>AI assisted features</li>
          <li className={listItemClass}>
            Exportable watchlists and other user generated materials
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "04",
    title: "Built for Fans",
    content: (
      <>
        <p>
          Nexus is designed around the idea that there is no single correct way
          to experience the MCU.
        </p>

        <p>
          Whether you're following the MCU in release order, exploring
          chronology, building your personal ranking, or venturing into Marvel
          stories beyond the MCU, Nexus gives you the tools to create your own
          journey.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "An Independent Project",
    content: (
      <>
        <p>
          Nexus is independently created and developed by{" "}
          <strong>wakamonoo</strong> as a fan project.
        </p>
        <p>
          It is not an official Marvel or Disney platform. Information about
          Marvel titles, continuities, and related properties is provided for
          fan discovery and discussion.
        </p>
        <p>
          For more information about the project's relationship with Marvel,
          Disney, TMDB, and other right holders please refere to the{" "}
          <a href="/trustAndLegality">
            <strong>Trust & Legality</strong>
          </a>
        </p>
      </>
    ),
  },
];

export default function About() {
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            About Nexus
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            A fan-built space for exploring, tracking, and connecting through
            Marvel stories.
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/[0.04] p-4">
          <p className="text-sm leading-7 opacity-60">
            Nexus is an independent fan project created to make exploring
            Marvel's many stories, timelines, and universes more personal and
            interactive.
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
