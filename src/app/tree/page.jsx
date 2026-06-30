"use client";

import { TitleContext } from "@/context/titleContext";
import { useContext, useMemo } from "react";
import { GoDotFill } from "react-icons/go";

const ROOT_UNIVERSE = "Earth-616";

const universeStyles = [
  {
    border: "border-fuchsia-300/35",
    bg: "bg-fuchsia-300/10",
    text: "text-fuchsia-100",
    muted: "text-fuchsia-100/55",
    line: "bg-fuchsia-300/60",
    glow: "shadow-[0_0_22px_rgba(217,70,239,0.25)]",
  },
  {
    border: "border-emerald-300/35",
    bg: "bg-emerald-300/10",
    text: "text-emerald-100",
    muted: "text-emerald-100/55",
    line: "bg-emerald-300/60",
    glow: "shadow-[0_0_22px_rgba(110,231,183,0.25)]",
  },
  {
    border: "border-amber-300/35",
    bg: "bg-amber-300/10",
    text: "text-amber-100",
    muted: "text-amber-100/55",
    line: "bg-amber-300/60",
    glow: "shadow-[0_0_22px_rgba(252,211,77,0.25)]",
  },
  {
    border: "border-cyan-300/35",
    bg: "bg-cyan-300/10",
    text: "text-cyan-100",
    muted: "text-cyan-100/55",
    line: "bg-cyan-300/60",
    glow: "shadow-[0_0_22px_rgba(103,232,249,0.25)]",
  },
  {
    border: "border-violet-300/35",
    bg: "bg-violet-300/10",
    text: "text-violet-100",
    muted: "text-violet-100/55",
    line: "bg-violet-300/60",
    glow: "shadow-[0_0_22px_rgba(196,181,253,0.25)]",
  },
];

const normalizeConnections = (connections) => {
  if (!connections) return [];
  if (Array.isArray(connections)) return connections;

  if (typeof connections === "string") {
    return connections
      .split(",")
      .map((connection) => connection.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeText = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const sortByTimeline = (a, b) => {
  if (a.order && b.order) return a.order - b.order;
  return new Date(a.date || 0) - new Date(b.date || 0);
};

export default function Tree() {
  const { titles } = useContext(TitleContext);

  const { earth616, branchesByTitleId, styleByUniverse } = useMemo(() => {
    const allTitles = titles || [];

    const earth616Titles = allTitles
      .filter((t) => t?.universe === ROOT_UNIVERSE)
      .sort(sortByTimeline);

    const non616Titles = allTitles
      .filter((t) => t?.universe && t.universe !== ROOT_UNIVERSE)
      .sort(sortByTimeline);

    const branches = new Map();
    const universeStyleMap = new Map();

    non616Titles.forEach((title) => {
      if (!universeStyleMap.has(title.universe)) {
        universeStyleMap.set(
          title.universe,
          universeStyles[universeStyleMap.size % universeStyles.length],
        );
      }

      const connections = normalizeConnections(title.connections);

      connections.forEach((connection) => {
        const normalizedConnection = normalizeText(connection);

        const connected616 = earth616Titles.find(
          (earthTitle) =>
            normalizeText(earthTitle.title) === normalizedConnection ||
            normalizedConnection.includes(normalizeText(earthTitle.title)),
        );

        if (!connected616) return;

        if (!branches.has(connected616.titleId)) {
          branches.set(connected616.titleId, []);
        }

        branches.get(connected616.titleId).push(title);
      });
    });

    return {
      earth616: earth616Titles,
      branchesByTitleId: branches,
      styleByUniverse: universeStyleMap,
    };
  }, [titles]);

  return (
    <div className="min-h-screen w-full overflow-x-auto bg-[var(--color-bg)] px-4 py-12">
      <div className="relative mx-auto flex w-fit min-w-[920px] flex-col items-center">
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sky-300/80 to-transparent shadow-[0_0_28px_rgba(56,189,248,0.45)]" />

        {earth616.map((unit, index) => {
          const rootedTitles = branchesByTitleId.get(unit.titleId) || [];

          return (
            <div
              key={unit.titleId}
              className="relative grid w-[920px] grid-cols-[340px_240px_340px] items-start"
            >
              <div className="flex flex-col items-end gap-3 pr-10 pt-2">
                {rootedTitles.map((rootedTitle, branchIndex) => {
                  const style = styleByUniverse.get(rootedTitle.universe);

                  return (
                    <div
                      key={`${unit.titleId}-${rootedTitle.titleId}`}
                      className="relative"
                    >
                      <div
                        className={`absolute right-[-40px] top-1/2 h-px w-10 ${style.line}`}
                      />
                      <div
                        className={`absolute right-[-45px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${style.line} ${style.glow}`}
                      />

                      <div
                        className={`w-72 rounded border px-4 py-3 text-right backdrop-blur ${style.border} ${style.bg} ${style.glow}`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-[0.22em] ${style.muted}`}
                        >
                          {rootedTitle.universe}
                        </p>
                        <h2 className={`text-sm font-bold ${style.text}`}>
                          {rootedTitle.title}
                        </h2>
                        <p className="mt-1 text-xs text-vibe/45">
                          Rooted to {unit.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative flex flex-col items-center">
                <div className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-sky-300/60 bg-[var(--color-bg)] shadow-[0_0_26px_rgba(56,189,248,0.55)]">
                  <GoDotFill className="text-sky-300" />
                </div>

                <div className="mt-2 mb-5 w-60 rounded border border-white/10 bg-[var(--color-secondary)]/90 px-4 py-3 text-center shadow-lg backdrop-blur">
                  <p className="text-xs text-vibe/45">
                    {unit.timeline || `Order ${unit.order}`}
                  </p>
                  <h1 className="text-xl font-bold leading-tight text-normal">
                    {unit.title}
                  </h1>
                </div>

                {index < earth616.length - 1 && (
                  <div className="h-12 w-px bg-sky-300/50" />
                )}
              </div>

              <div className="pl-10 pt-4">
                {rootedTitles.length > 0 && (
                  <div className="relative rounded border border-sky-300/15 bg-sky-300/[0.04] px-3 py-2 text-xs text-sky-100/55">
                    <div className="absolute left-[-40px] top-1/2 h-px w-10 bg-sky-300/35" />
                    {rootedTitles.length}{" "}
                    {rootedTitles.length === 1 ? "branch" : "branches"} rooted
                    here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}