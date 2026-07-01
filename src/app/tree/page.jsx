"use client";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useContext } from "react";
import { GoDot } from "react-icons/go";

const getConnections = (connections) => {
  if (!connections) return [];
  if (Array.isArray(connections)) return connections;

  return connections
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
};

function BranchNode({ node, titles }) {
  const children = titles.filter((title) =>
    getConnections(title.connections).includes(node.title),
  );

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="h-6 w-1 bg-accent" />
        <div className="flex flex-col items-center justify-center w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer">
          <Image
            src={node.image}
            alt={node.title}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex flex-col items-center px-2 mt-1">
          <p className="text-sm font-bold text-center leading-3.5 line-clamp-2">
            {node.title}
          </p>
          <p className="text-xs text-vibe text-center">{node.universe}</p>
          <p className="text-xs text-vibe text-center border-t-2 border-panel">
            <span className="font-bold whitespace-nowrap">
              Earth-616 Entry:{" "}
            </span>
            {node.connections}
          </p>
        </div>
        {children.length > 0 && <div className="h-6 w-1 bg-accent" />}
      </div>

      {children.length > 0 && (
        <div className="relative mt-6 flex items-start justify-center gap-6">
          <div className="absolute left-1/2 top-[-24px] h-6 w-1 -translate-x-1/2 bg-accent" />
          {children.length > 1 && (
            <div
              className="absolute top-0 h-1 bg-accent"
              style={{ left: 0, right: 0 }}
            />
          )}

          {children.map((child) => (
            <div
              key={child.titleId}
              className="relative flex flex-col items-center"
            >
              <div className="h-6 w-1 bg-accent" />

              <BranchNode node={child} titles={titles} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Tree() {
  const { titles } = useContext(TitleContext);

  const TVA =
    titles
      ?.filter((t) => t?.universe === "TVA")
      .sort((a, b) => a.order - b.order) || [];

  const Multiverse =
    titles
      ?.filter((t) => t?.universe === "Multiverse")
      .sort((a, b) => a.order - b.order) || [];

  const earth616 =
    titles
      ?.filter((t) => t?.universe === "Earth-616")
      .sort((a, b) => a.order - b.order) || [];

  const nonEarth616 =
    titles
      ?.filter((t) => t?.universe !== "Earth-616")
      .sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  return (
    <div className="p-2 sm:p-4 md:p-8 lg:p-16 xl:p-32 overflow-x-auto">
      <div className="flex min-h-screen items-start mb-12">
        <div className="flex flex-col items-center justify-center m-2">
          <p className="text-4xl text-center font-alt whitespace-nowrap">TVA</p>
          <p className="text-base text-center whitespace-nowrap">
            Time Variance Authority
          </p>
        </div>
        {TVA.map((unit) => {
          return (
            <div
              key={unit.titleId}
              className="relative flex flex-col items-center"
            >
              <div className="flex items-center flex-col w-full">
                <div className="flex items-start w-full">
                  <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                  <div className="flex flex-col items-center justify-center w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer mx-1">
                    <Image
                      src={unit.image}
                      alt={unit.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                </div>
                <div className="flex flex-col items-center px-2 mt-1">
                  <p className="text-sm font-bold text-center leading-3.5 line-clamp-2">
                    {unit.title}
                  </p>
                  <p className="text-xs text-vibe text-center">
                    {unit.universe}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="relative flex flex-col items-center">
          <div className="absolute left-0 top-8 h-80 w-1 bg-hulk" />
          <div className="ml-10 flex flex-col gap-16">
            <div className="flex items-start">
              <div className="relative flex flex-col items-center justify-center m-2">
                <div className="absolute right-full top-6 w-12 h-1 bg-hulk" />
                <p className="text-4xl text-center font-alt whitespace-nowrap">
                  Multiverse
                </p>
                <p className="text-base text-center whitespace-nowrap">
                  Various Universe
                </p>
              </div>
              {Multiverse.map((unit) => {
                return (
                  <div
                    key={unit.titleId}
                    className="relative flex flex-col items-center"
                  >
                    <div className="flex items-center flex-col w-full">
                      <div className="flex items-start w-full">
                        <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                        <div className="flex flex-col items-center justify-center w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer mx-1">
                          <Image
                            src={unit.image}
                            alt={unit.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                      </div>
                      <div className="flex flex-col items-center px-2 mt-1">
                        <p className="text-sm font-bold text-center leading-3.5 line-clamp-2">
                          {unit.title}
                        </p>
                        <p className="text-xs text-vibe text-center">
                          {unit.universe}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-start">
              <div className="relative flex flex-col items-center justify-center m-2">
                <div className="absolute right-full top-6 w-12 h-1 bg-hulk" />
                <p className="text-4xl text-center font-alt whitespace-nowrap">
                  Earth-616
                </p>
                <p className="text-base text-center whitespace-nowrap">
                  The Sacred Timeline
                </p>
              </div>
              {earth616.map((unit) => {
                const roots = nonEarth616.filter((branch) =>
                  getConnections(branch.connections).includes(unit.title),
                );

                return (
                  <div
                    key={unit.titleId}
                    className="relative flex flex-col items-center"
                  >
                    <div className="flex items-center flex-col w-full">
                      <div className="flex items-start w-full">
                        <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                        <div className="flex flex-col items-center justify-center w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer mx-1">
                          <Image
                            src={unit.image}
                            alt={unit.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="min-w-6 h-1 flex-1 bg-hulk mt-8" />
                      </div>
                      <div className="flex flex-col items-center px-2 mt-1">
                        <p className="text-sm font-bold text-center leading-3.5 line-clamp-2">
                          {unit.title}
                        </p>
                        <p className="text-xs text-vibe text-center">
                          {unit.timeline}
                        </p>
                      </div>
                    </div>

                    {roots.length > 0 && (
                      <div className="relative mt-6 flex items-start gap-8">
                        <div className="absolute left-1/2 top-[-24px] h-6 w-1 -translate-x-1/2 bg-accent" />
                        {roots.length > 1 && (
                          <div
                            className="absolute top-0 h-1 bg-accent"
                            style={{ left: 0, right: 0 }}
                          />
                        )}

                        {roots.map((branch) => (
                          <div
                            key={branch.titleId}
                            className="relative flex flex-col items-center"
                          >
                            <div className="h-6 w-1 bg-accent" />
                            <BranchNode node={branch} titles={nonEarth616} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
