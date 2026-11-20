import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ContentItem } from "./content";
import { itemKinds, kindLabel } from "./item-kind";
import { itemLink } from "./item-link";

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function ItemCard({ item }: { item: ContentItem }) {
  const Icon = itemKinds[item.kind].icon;

  return (
    <Link
      {...itemLink(item.id)}
      className={`flex items-center gap-3 rounded-2xl bg-card p-4 text-card-foreground ring-1 ring-foreground/5 transition-transform active:scale-[0.98] ${focus}`}
    >
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
    </Link>
  );
}

// The first article of a topic: readable right here, so it is the suggested start.
export function FeaturedItemCard({ item }: { item: ContentItem }) {
  return (
    <Link
      {...itemLink(item.id)}
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
