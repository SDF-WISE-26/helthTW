import { FileDown, FileText, Link } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ContentItem } from "../content.ts";

type Kind = ContentItem["kind"];

// Display order is the order here: own articles first.
export const itemKinds: Record<Kind, { icon: LucideIcon; one: string; many: string }> = {
  article: { icon: FileText, one: "Artikel", many: "Artikel" },
  pdf: { icon: FileDown, one: "PDF", many: "PDFs" },
  link: { icon: Link, one: "Link", many: "Links" },
};

// What is inside at a glance, e.g. "1 Artikel · 3 PDFs · 1 Link".
export const summarizeKinds = (items: ContentItem[]) =>
  (Object.keys(itemKinds) as Kind[])
    .map((kind) => {
      const count = items.filter((item) => item.kind === kind).length;
      return count && `${count} ${count === 1 ? itemKinds[kind].one : itemKinds[kind].many}`;
    })
    .filter(Boolean)
    .join(" · ");

// About 200 words a minute, at least one.
const readingMinutes = (text: string) =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));

// The kind of one item, an article with its reading time, e.g. "Artikel · 5 Min. lesen".
export const kindLabel = (item: ContentItem) =>
  item.kind === "article"
    ? `${itemKinds.article.one} · ${readingMinutes(item.body)} Min. lesen`
    : itemKinds[item.kind].one;
