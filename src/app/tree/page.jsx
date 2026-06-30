"use client";
import { TitleContext } from "@/context/titleContext";
import { useContext } from "react";
import { GoDot } from "react-icons/go";

export default function Tree() {
  const { titles } = useContext(TitleContext);

  const earth616 = titles
    ?.filter((t) => t?.universe === "Earth-616")
    .sort((a, b) => a.order - b.order);

  const nonEarth616 = titles
    ?.filter((t) => t?.universe !== "Earth-616")
    .sort((a, b) => a.date - b.date);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-alt">Earth-616</p>
        {earth616.map((unit) => {
          const connectedTitles = nonEarth616.filter((branch) =>
            branch.connections
              ?.split(",")
              .map((c) => c.trim())
              .includes(unit.title),
          );
          return (
            <div
              key={unit.titleId}
              className="relative flex items-center justify-center"
            >
              {connectedTitles.length > 0 && (
                <div className="absolute right-full mr-8 flex items-center">
                  <div className="flex flex-col items-end gap-1">
                    {connectedTitles.map((branch) => (
                      <div key={branch.titleId} className="flex flex-col items-end">
                        <p className="whitespace-nowrap tex-right text-xs font-bold text-accent">
                          {branch.title}
                        </p>
                        <p className="text-xs text-vibe opacity-60">{branch.universe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="h-6 w-px bg-accent" />
                  <GoDot className="text-2xl text-accent" />
                  <div className="h-1 w-px bg-accent" />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-base font-bold font-heading text-center">
                    {unit.title}
                  </p>
                  <p className="text-xs text-vibe">{unit.timeline}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
