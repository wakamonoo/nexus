"use client";

import { Handle, Position } from "@xyflow/react";

const universeColors = {
  "Earth-616": "#dc2626",
  "Sony": "#2563eb",
  "Fox": "#f59e0b",
  "Netflix": "#16a34a",
  "ABC": "#9333ea",
  "Animated": "#0f766e",
};

export default function ConnectionNode({ data }) {
  const { title } = data;

  const color =
    universeColors[title.universe] || "#6b7280";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
      />

      <div
        className="rounded-xl shadow-lg border bg-background overflow-hidden w-52"
        style={{
          borderColor: color,
          borderWidth: 2,
        }}
      >
        {title.image && (
          <img
            src={title.image}
            alt={title.title}
            className="w-full h-72 object-cover"
          />
        )}

        <div className="p-3">
          <p className="font-bold text-sm">
            {title.title}
          </p>

          <p
            className="text-xs mt-1 font-semibold"
            style={{
              color,
            }}
          >
            {title.universe}
          </p>

          <p className="text-xs opacity-70 mt-2">
            {title.type}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </>
  );
}