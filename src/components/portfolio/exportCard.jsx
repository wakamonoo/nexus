import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import logo from "@/assets/main_logo.png";
import Fallback from "@/assets/fallback.png";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export default function ExportCard({
  user,
  order,
  orderType,
  isTitleWatched,
  id,
}) {
  const itemsPerColumn = Math.ceil(order.length / 3);

  const columns = [
    order.slice(0, itemsPerColumn),
    order.slice(itemsPerColumn, itemsPerColumn * 2),
    order.slice(itemsPerColumn * 2),
  ];

  return (
    <div
      id={id}
      style={{ width: 1080, height: 1350 }}
      className="p-10 bg-gradient-to-b from-[var(--color-panel)] to-[var(--color-secondary)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-secondary)] pb-4">
        <div className="flex items-center gap-2">
          <img
            src={user?.picture || Fallback}
            alt={user?.name}
            loading="lazy"
            decoding="async"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-accent/50"
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
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-[0.25em]">
            {order.length} Titles
          </p>
          <p className="text-lg font-bold uppercase">
            Marvel Cinematic Universe
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 content-start gap-x-4 gap-y-1 mt-4 bg-second p-4 rounded-2xl">
        {columns.map((column, columnindex) => {
          const startIndex = columnindex * itemsPerColumn;
          return (
            <div key={columnindex} className="min-w-0 flex-1">
              {column.map((unit, index) => {
                const actualIndex = startIndex + index;
                return (
                  <div
                    key={unit.titleId}
                    className="flex min-w-0 items-start gap-2 py-1"
                  >
                    {isTitleWatched(unit.titleId) ? (
                      <MdRadioButtonChecked className="shrink-0 text-2xl text-zeus" />
                    ) : (
                      <MdRadioButtonUnchecked className="shrink-0 text-2xl text-accent" />
                    )}
                    <p className="text-base">
                      <span className="font-bold">{actualIndex + 1}. </span>
                      {unit.title}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between w-full mt-4 items-end">
        <div className="max-w-[55%]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]">
            Disclaimer
          </p>
          <p className="text-sm leading-relaxed">
            nexus is a fan-made, unofficial project and is not affiliated with,
            endorsed by, or sponsored by Marvel Studios The Walt Disney Company
            , or any other rights holders. All characters, titles, trademarks,
            and related intellectual property belong to their respective owners.
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
