import dagre from "@dagrejs/dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 380;

export function getLayoutedElements(nodes, edges) {
  dagreGraph.setGraph({
    rankdir: "LR", // Left → Right

    nodesep: 80,
    ranksep: 180,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(node.id);

    return {
      ...node,

      targetPosition: "left",
      sourcePosition: "right",

      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}