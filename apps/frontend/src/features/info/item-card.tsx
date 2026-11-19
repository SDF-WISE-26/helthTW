import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ContentItem } from "./content";
import { itemKinds, kindLabel } from "./item-kind";

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

const itemLink = (item: ContentItem) =>
  ({
    to: "/info/$topic/$item",
    params: { topic: item.topic, item: item.id },
    viewTransition: false,
    resetScroll: false,
  }) as const;

// shared for chat feature
export const itemCardClass = `flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left text-card-foreground ring-1 ring-foreground/5 transition-transform active:scale-[0.98] ${focus}`;

// split content from behaviour: this component implements the content body of the ItemCard for info section and chat
export function ItemCardBody({ item }: { item: ContentItem }) {
  const Icon = itemKinds[item.kind].icon;

  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center self-start rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-caption font-semibold tracking-wide text-muted-foreground uppercase">
          {kindLabel(item)}
        </span>
        <span className="text-label">{item.title}</span>
        {/* Who it is from tells at a glance whether to trust it. */}
        {item.source && (
          <span className="mt-1 text-caption text-muted-foreground">{item.source}</span>
        )}
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
    </>
  );
}

// split content from behavior: this component implements the behavior of an itemCard in the info section
export function ItemCard({ item }: { item: ContentItem }) {
  return (
    <Link {...itemLink(item)} className={itemCardClass}>
      <ItemCardBody item={item} />
    </Link>
  );
}

// The first article of a topic: readable right here, so it is the suggested start.
export function FeaturedItemCard({ item }: { item: ContentItem }) {
  return (
    <Link
      {...itemLink(item)}
      className={`flex flex-col gap-2 rounded-2xl bg-secondary p-5 text-secondary-foreground transition-transform active:scale-[0.98] ${focus}`}
    >
      <span className="text-caption font-semibold tracking-wide uppercase opacity-80">
        {kindLabel(item)}
      </span>
      <span className="text-card-title">{item.title}</span>
      <span className="line-clamp-3 text-small opacity-90">{item.summary}</span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-label">
        Jetzt lesen
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  );
}
