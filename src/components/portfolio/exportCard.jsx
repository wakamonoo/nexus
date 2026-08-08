import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import logo from "@/assets/main_logo.png";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { BiSolidCircle } from "react-icons/bi";

export default function ExportCard({
  user,
  order,
  pageOrder,
  orderType,
  isTitleWatched,
  id,
  isContinuum,
  cardWidth,
  cardHeight,
  pageNumber,
  totalPages,
  startIndex = 0,
}) {
  const currentOrder = pageOrder || order;

  const itemsPerColumn = Math.ceil(currentOrder.length / 3);

  const columns = [
    currentOrder.slice(0, itemsPerColumn),
    currentOrder.slice(itemsPerColumn, itemsPerColumn * 2),
    currentOrder.slice(itemsPerColumn * 2),
  ];
  const phaseStyles = {
    "Phase 1": "bg-blue-500",
    "Phase 2": "bg-red-500",
    "Phase 3": "bg-purple-500",
    "Phase 4": "bg-cyan-500",
    "Phase 5": "bg-orange-500",
    "Phase 6": "bg-yellow-500",
    "Not Part": "bg-zinc-500",
  };

  const phaseIconStyles = {
    "Phase 1": "text-blue-500",
    "Phase 2": "text-red-500",
    "Phase 3": "text-purple-500",
    "Phase 4": "text-cyan-500",
    "Phase 5": "text-orange-500",
    "Phase 6": "text-yellow-500",
    "Not Part": "text-zinc-500",
  };

  const categoryStyles = {
    mcu: "bg-[var(--color-accent)]",
    legacy: "bg-[var(--color-hulk)]",
    adjacent: "bg-[var(--color-infinity)]",
  };

  const categoryIconStyles = {
    mcu: "text-[var(--color-accent)]",
    legacy: "text-[var(--color-hulk)]",
    adjacent: "text-[var(--color-infinity)]",
  };

  return (
    <div
      id={id}
      style={{ width: cardWidth, height: cardHeight }}
      className="flex flex-col p-10 bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-secondary)] pb-8">
        <div className="flex items-start gap-3.5">
          <img
            src={user?.picture || Fallback}
            alt={user?.name}
            loading="lazy"
            decoding="async"
            className="w-18 h-18 rounded-full object-cover ring-2 ring-accent/50"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
              ournexus.space Portfolio
            </p>
            <h1 className="font-tall text-2xl uppercase leading-tight">
              {user?.name}'s MCU
            </h1>
            <p className="text-xl font-bold uppercase tracking-wider">
              {orderType} Order Checklist
            </p>
            <div className="flex items-center justify-start gap-2">
              {isContinuum
                ? Object.keys(categoryStyles).map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                    >
                      <BiSolidCircle
                        className={`text-lg ${categoryIconStyles[category]}`}
                      />
                      <p className="text-sm uppercase whitespace-nowrap">
                        {category}
                      </p>
                    </div>
                  ))
                : Object.keys(phaseStyles).map((phase) => (
                    <div
                      key={phase}
                      className="flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                    >
                      <BiSolidCircle
                        className={`text-lg ${phaseIconStyles[phase]}`}
                      />
                      <p className="text-sm uppercase whitespace-nowrap">
                        {phase}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.25em]">
            {currentOrder.length} Titles
          </p>
          {totalPages > 1 && (
            <p className="text-xs uppercase tracking-[0.25em]">
              Page {pageNumber} / {totalPages}
            </p>
          )}
          <p className="whitespace-nowrap text-lg font-bold uppercase">
            Marvel Cinematic Universe
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 content-start gap-x-4 gap-y-1 mt-8 bg-second p-4 rounded-2xl">
        {columns.map((column, columnindex) => {
          const columnStartIndex = columnindex * itemsPerColumn;
          return (
            <div key={columnindex} className="min-w-0 flex-1">
              {column.map((unit, index) => {
                const actualIndex = startIndex + columnStartIndex + index;
                return (
                  <div
                    key={unit.titleId}
                    className="flex min-w-0 items-start gap-2 py-[1.4px]"
                  >
                    {isTitleWatched(unit.titleId) ? (
                      <MdRadioButtonChecked className="shrink-0 text-2xl text-zeus" />
                    ) : (
                      <MdRadioButtonUnchecked className="shrink-0 text-2xl text-zeus" />
                    )}
                    <p className="text-base min-w-0 flex-1 leading-tight">
                      <span
                        className={`font-bold text-lg  ${isContinuum ? categoryIconStyles[unit.category] : phaseIconStyles[unit.phase]}`}
                      >
                        {actualIndex + 1}.
                      </span>{" "}
                      {unit.title}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between w-full mt-auto items-end">
        <div className="max-w-[55%]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Disclaimer
          </p>
          <p className="text-sm leading-relaxed">
            ournexus.space is a fan-made, unofficial project and is not
            affiliated with, endorsed by, or sponsored by Marvel Studios The
            Walt Disney Company , or any other rights holders. All characters,
            titles, trademarks, and related intellectual property belong to
            their respective owners.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-end">
            <Image
              src={logo}
              alt="nexus_logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-46 h-auto object-cover"
            />
            <p className="mt-1 text-sm font-bold tracking-wider">
              ournexus.space
            </p>
          </div>
          <div className="rounded-xl bg-white p-2">
            <QRCodeSVG
              value="https://ournexus.space"
              size={150}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
