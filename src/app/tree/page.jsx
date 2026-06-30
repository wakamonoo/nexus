"use client";
import { TitleContext } from "@/context/titleContext";
import Image from "next/image";
import { useContext } from "react";
import { GoDot } from "react-icons/go";

function BranchNode({ node, titles }) {
  const children = titles.filter((t) =>
    t.connections
      ?.split(",")
      .map((c) => c.trim())
      .includes(node.title),
  );

  return (
    <div className="flex flex-col items-center">
      {children.length > 0 && (
        <div className="flex items-end justify-center gap-6 mb-6">
          {children.map((child) => (
            <BranchNode key={child.titleId} node={child} titles={titles} />
          ))}
        </div>
      )}

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
    </div>
  );
}

export default function Tree() {
  const { titles } = useContext(TitleContext);

  const earth616 = titles
    ?.filter((t) => t?.universe === "Earth-616")
    .sort((a, b) => a.order - b.order);

  const nonEarth616 = titles
    ?.filter((t) => t?.universe !== "Earth-616")
    .sort((a, b) => a.date - b.date);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex min-h-screen items-end mb-12">
        <div className="flex items-center justify-center gap-2 mr-2">
          <div>
            <p className="text-4xl text-center font-alt whitespace-nowrap">
              Earth-616
            </p>
            <p className="text-base text-center whitespace-nowrap">
              The Sacred Timeline
            </p>
          </div>
          <div className="w-6 h-px bg-accent" />
        </div>
        {earth616.map((unit) => {
          const roots = nonEarth616.filter((branch) =>
            branch.connections
              ?.split(",")
              .map((c) => c.trim())
              .includes(unit.title),
          );
          return (
            <div key={unit.titleId} className="flex flex-col items-center mx-2">
              {roots.length > 0 && (
                <>
                  <div className="flex items-end gap-8 mb-8">
                    {roots.map((branch) => (
                      <BranchNode
                        key={branch.titleId}
                        node={branch}
                        titles={nonEarth616}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-col items-center justify-center w-26 h-40 md:w-32 md:h-46 flex-shrink-0 cursor-pointer">
                <Image
                  src={unit.image}
                  alt={unit.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
