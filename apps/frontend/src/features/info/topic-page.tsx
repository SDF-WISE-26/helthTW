import { cn } from "cn";
import { content } from "./content";
import { FeaturedItemCard, ItemCard } from "./item-card";
import { itemKinds, summarizeKinds } from "./item-kind";
import { InfoNotFound } from "./not-found";
import { TopicArt } from "./topic-art";
import { topicSurface, topicTransition } from "./topic-look";

const kindOrder = Object.keys(itemKinds);

// A topic with all its items. The header repeats the topic card, so the tap feels continuous.
export function TopicPage({ topicId }: { topicId: string }) {
  const index = content.topics.findIndex((topic) => topic.id === topicId);
  if (index === -1) return <InfoNotFound />;

  const topic = content.topics[index];
  const items = content.items
    .filter((item) => item.topic === topic.id)
    .toSorted((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind));
  // Sorted articles first, so a topic with an article starts with it.
  const featured = items[0]?.kind === "article" ? items[0] : undefined;
  const rest = featured ? items.slice(1) : items;

  return (
    <>
      <header
        style={topicTransition(topic.id, "card")}
        className={cn(
          "relative flex min-h-36 flex-col justify-end gap-1 overflow-hidden rounded-2xl py-5 pr-32 pl-5 text-white",
          topicSurface(index),
        )}
      >
        <h1 style={topicTransition(topic.id, "title")} className="text-title">
          {topic.title}
        </h1>
        {items.length > 0 && (
          <p style={topicTransition(topic.id, "meta")} className="text-small text-white/85">
            {summarizeKinds(items)}
          </p>
        )}
        <TopicArt
          variant={index}
          style={topicTransition(topic.id, "art")}
          className="absolute right-0 bottom-0 aspect-[7/6] h-28"
        />
      </header>

      {topic.description && <p className="mt-1">{topic.description}</p>}

      {featured && (
        <div className="mt-2">
          <FeaturedItemCard item={featured} />
        </div>
      )}

      {(rest.length > 0 || !featured) && (
        <section aria-labelledby="topic-items" className="mt-4 flex flex-col gap-3">
          <h2 id="topic-items" className="text-heading">
            {featured ? "Mehr zum Thema" : "Beiträge"}
          </h2>
          {rest.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {rest.map((item) => (
                <li key={item.id}>
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Zu diesem Thema gibt es noch keine Beiträge.</p>
          )}
        </section>
      )}
    </>
  );
}
