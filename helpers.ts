export function shuffle(array: Array<any>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export type TreeDrawerNode = {
  label: string;
  children?: TreeDrawerNode[];
};

function drawTreeNode(node: TreeDrawerNode, prefix = "", isLast = true, isRoot = false): string[] {
  const connector = isRoot ? "" : isLast ? "`-- " : "|-- ";
  const lines = [`${prefix}${connector}${node.label}`];
  const nextPrefix = isRoot ? "" : `${prefix}${isLast ? "    " : "|   "}`;
  const children = node.children ?? [];

  children.forEach((child, index) => {
    lines.push(...drawTreeNode(child, nextPrefix, index === children.length - 1, false));
  });

  return lines;
}

export function drawTree(node: TreeDrawerNode): string {
  return drawTreeNode(node, "", true, true).join("\n");
}