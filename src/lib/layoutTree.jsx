export function buildGraph(titles) {
  const nodes = [];
  const edges = [];

  const titleMap = {};
  const childrenMap = {};
  const visited = new Set();

  titles.forEach((title) => {
    titleMap[title.title] = title;
  });

  titles.forEach((title) => {
    if (!title.connections) return;

    const connections = title.connections
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    connections.forEach((connection) => {
      if (!childrenMap[connections]) {
        childrenMap[connection] = [];
      }

      childrenMap[connection].push(title);

      const target = titleMap[connection];

      if (!target) return;

      edges.push({
        id: `${title.titleId}-${target.titleId}`,
        source: title.titleId,
        target: target.titleId,
        animated: true,
        style: {
          stroke: "#ef4444",
          strokeWidth: 2,
        },
      });
    });
  });

  const earth616 = titles
    .filter((t) => t.category === "mcu" && t.universe === "Earth-616")
    .sort((a, b) => a.order - b.order);

  const NODE_X = 1000;
  const NODE_Y = 800;
  const INDENT = 600;

  function placeNode(title, x, y, depth = 0) {
    if (visited.has(title.titleId)) return;

    visited.add(title.titleId);

    nodes.push({
      id: title.titleId,
      type: "connectionNode",
      position: {
        x,
        y,
      },
      data: {
        title,
      },
    });

    const children = childrenMap[title.title] || [];

    children.forEach((child, index) => {
      placeNode(child, x - INDENT, y + (index + 1) * NODE_Y * 0.65, depth + 1);
    });
  }

  earth616.forEach((title, index) => {
    placeNode(title, NODE_X, index * NODE_Y);
  });

  return {
    nodes,
    edges,
  };
}
