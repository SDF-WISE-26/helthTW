import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { content } from "./content";
import type { Topic } from "./content";
import { summarizeKinds } from "./item-kind";
import { TopicArt } from "./topic-art";
import { topicSurface, topicTransition } from "./topic-look";

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
      style={topicTransition(topic.id, "card")}
      className={cn(
        "relative flex min-h-28 flex-col justify-center gap-1 overflow-hidden rounded-2xl py-4 pr-32 pl-5 text-white",
        "transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]",
        topicSurface(index),
      )}
    >
      <span style={topicTransition(topic.id, "title")} className="text-card-title">
        {topic.title}
      </span>
      {items.length > 0 && (
        <span style={topicTransition(topic.id, "meta")} className="text-small text-white/85">
          {summarizeKinds(items)}
        </span>
      )}
      <TopicArt
        variant={index}
        style={topicTransition(topic.id, "art")}
        className="absolute right-0 bottom-0 aspect-[7/6] h-28"
      />
    </Link>
  );
}
