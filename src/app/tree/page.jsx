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
      <div className="flex h-screen w-full items-center ">
        <div className="flex items-center justify-center gap-2 mr-2">
          <p className="text-4xl text-center font-alt whitespace-nowrap">
            Earth-616
          </p>
          <div className="w-6 h-px bg-accent" />
        </div>
        {earth616.map((unit) => {
          const connectedTitles = nonEarth616.filter((branch) =>
            branch.connections
              ?.split(",")
              .map((c) => c.trim())
              .includes(unit.title),
          );
          return (
            <div key={unit.titleId}>
              <div className="flex items-center justify-center">
                {connectedTitles.length > 0 && (
                  <>
                    <div className="flex items-center justify-center">
                      {connectedTitles.map((branch) => (
                        <div key={branch.titleId} className="flex flex-col items-center justify-center">
                          <p className="text-base font-bold text-accent font-heading text-center leading-3.5">
                            {branch.title}
                          </p>
                          <p className="text-xs text-accent opacity-60 text-center">{branch.universe}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex flex-col items-center justify-center">
                  <p className="text-base font-bold font-heading text-center leading-3.5">
                    {unit.title}
                  </p>
                  <p className="text-xs opacity-60">{unit.timeline}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
