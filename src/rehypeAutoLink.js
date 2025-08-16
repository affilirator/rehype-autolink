import fs from "fs";
import { visit } from "unist-util-visit";

export function rehypeAutoLink(jsonPath) {
  let data;
  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`[rehypeAutoLink] Failed to read or parse JSON at ${jsonPath}`, err);
    return () => {};
  }

  const { entries = [], maxLinks = Infinity } = data;
  return function transformer(tree, file) {
    const filePath = file.history?.[0] || "";
    if (!/\/blog\//.test(filePath)) return;

    let linkCount = 0;
    const entryLinkCounts = {};

    visit(tree, "text", (node, index, parent) => {
      if (!parent || parent.tagName === "a" || !node.value) return;
      for (const entry of entries) {
        if (linkCount >= maxLinks) return;
        const { href, texts = [], maxOccurrences = Infinity, id } = entry;
        entryLinkCounts[id] ||= 0;
        if (entryLinkCounts[id] >= maxOccurrences) continue;
        for (const t of texts) {
          const regex = new RegExp(`\\b${t.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
          if (regex.test(node.value)) {
            const matchText = t.text;
            const [before, ...after] = node.value.split(regex);
            const linkNode = {
              type: "element",
              tagName: "a",
              properties: { href, className: ["auto-link"] },
              children: [{ type: "text", value: matchText }]
            };
            parent.children.splice(index, 1, { type: "text", value: before }, linkNode, { type: "text", value: after.join(matchText) });
            linkCount++;
            entryLinkCounts[id]++;
            return [visit.SKIP, index + 3];
          }
        }
      }
    });
  };
}