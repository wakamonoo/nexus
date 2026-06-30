"use client";
import { useContext, useMemo } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TitleContext } from "@/context/titleContext";
import ConnectionNode from "./connectionNode";
import { buildGraph } from "@/lib/layoutTree";

const nodeTypes = { connectionNode: ConnectionNode };

export default function ConnectionGraph() {
  const { titles } = useContext(TitleContext);

  const { nodes, edges } = useMemo(() => {
    if (!titles?.length)
      return {
        nodes: [],
        edges: [],
      };

    return buildGraph(titles);
  }, [titles]);

  return (
    <div className="w-full h-screen bg-panel">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
