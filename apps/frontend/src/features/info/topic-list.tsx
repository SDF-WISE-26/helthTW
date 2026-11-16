import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { content } from "./content";
import type { ContentItem, Topic } from "./content";
import { TopicArt } from "./topic-art";

const surfaces = ["bg-topic-1", "bg-topic-2", "bg-topic-3", "bg-topic-4"];

const kindNames: Record<ContentItem["kind"], [one: string, many: string]> = {
  article: ["Artikel", "Artikel"],
  pdf: ["PDF", "PDFs"],
  link: ["Link", "Links"],
};

const summarize = (items: ContentItem[]) =>
  (Object.keys(kindNames) as ContentItem["kind"][])
    .map((kind) => {
      const count = items.filter((item) => item.kind === kind).length;
      return count && `${count} ${kindNames[kind][count === 1 ? 0 : 1]}`;
    })
    .filter(Boolean)
    .join(" · ");

export function TopicList() {
  return (
    <ul className="flex flex-col gap-3">
      {content.topics.map((topic, index) => (
        <li key={topic.id}>
          <TopicCard topic={topic} index={index} />
        </li>
      ))}
    </ul>
  );
}

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const items = content.items.filter((item) => item.topic === topic.id);

  return (
    <Link
      to="/info/$topic"
      params={{ topic: topic.id }}
      className={cn(
        "relative flex min-h-28 flex-col justify-center gap-1 overflow-hidden rounded-2xl py-4 pr-32 pl-5 text-white",
        "transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]",
        surfaces[index % surfaces.length],
      )}
    >
      <span className="text-card-title">{topic.title}</span>
      {items.length > 0 && <span className="text-small text-white/85">{summarize(items)}</span>}
      <TopicArt variant={index} className="absolute inset-y-0 right-0 h-full w-32" />
    </Link>
  );
}
