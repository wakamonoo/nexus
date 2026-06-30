"use client";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

const universeColors = {
  "Earth-616": "#3a9d23",
  "Earth-10005": "#d97706",
  "Earth-828": "#f59e0b",
  "Earth-26320": "#16a34a",
  "Earth-96283": "#9333ea",
  "Earth-701306": "#0f766e",
  "Earth-121698": "#0f766e",
  "Earth-120703": "#2563eb",
  "Earth-17315": "#701705",
  "Earth-688": "#13EDBC",
};

export default function ConnectionNode({ data }) {
  const { title } = data;

  const color = universeColors[title.universe] || "#6b7280";

  return (
    <>
      <Handle type="target" position={Position.Left} />

      <div
        className="flex flex-col items-center justify-center rounded-xl shadow-lg border bg-second overflow-hidden w-52 p-2"
        style={{ borderColor: color, borderWidth: 2 }}
      >
        {title.image && (
          <img
            src={title?.image}
            alt={title.title}
            className="w-full h-72 object-cover"
          />
        )}
        <div className="flex flex-col items-center justify-center mt-2">
          <p className="text-2xl text-center font-bold">{title.title}</p>
          <p className="text-base font-semibold opacity-60">{title.universe}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
