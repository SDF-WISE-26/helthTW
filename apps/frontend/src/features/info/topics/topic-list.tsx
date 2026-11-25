import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { content, topicItems } from "../content";
import type { Topic } from "../content";
import { summarizeKinds } from "../item-kind";
import { TopicArt } from "./topic-art";
import { coverCard, topicSurface, topicTransition } from "../cover-look";

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
  const items = topicItems(topic.id);

  return (
    <Link
      to="/info/$topic"
      params={{ topic: topic.id }}
      style={topicTransition(topic.id, "card")}
      className={cn(coverCard, topicSurface(index))}
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
