import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { ArticleBody } from "./article-body.tsx";
import { content } from "../content.ts";
import type { ContentItem } from "../content.ts";
import { useCloseItem } from "./item-link.ts";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

// The sheet for `?item=<id>` on any screen, mounted once in the root layout (see item-link.ts).
export function ItemSheet({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(true);
  const leave = useCloseItem();
  const item = content.items.find((i) => i.id === itemId);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      // Leave only after the slide-out, otherwise the sheet just vanishes.
      onAnimationEnd={(isOpen) => !isOpen && leave()}
    >
      <DrawerContent>
        {item ? (
          <ItemDetails item={item} />
        ) : (
          <>
            <DrawerBody>
              <DrawerTitle>Beitrag nicht gefunden</DrawerTitle>
              <DrawerDescription>Diesen Beitrag gibt es nicht (mehr).</DrawerDescription>
            </DrawerBody>
            <DrawerFooter>
              <Button size="lg" onClick={() => setOpen(false)}>
                Zurück
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export function ItemDetails({ item }: { item: ContentItem }) {
  const meta = [
    item.source && `Quelle: ${item.source}`,
    item.lastReviewed && `Zuletzt geprüft am ${formatDate(item.lastReviewed)}`,
  ].filter(Boolean);

  return (
    <>
      <DrawerBody>
        <DrawerTitle>{item.title}</DrawerTitle>
        <DrawerDescription>{item.summary}</DrawerDescription>
        {meta.length > 0 && <p className="text-small text-muted-foreground">{meta.join(" · ")}</p>}
        {/* An article is read right in the sheet, which grows to almost full height and scrolls. */}
        {item.kind === "article" && (
          <div className="mt-3">
            <ArticleBody markdown={item.body} />
          </div>
        )}
      </DrawerBody>

      {item.kind !== "article" && (
        <DrawerFooter>
          <Button asChild size="lg">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.kind === "pdf" ? "PDF öffnen" : "Website öffnen"}
              <ExternalLink aria-hidden="true" />
              <span className="sr-only">(öffnet in neuem Tab)</span>
            </a>
          </Button>
        </DrawerFooter>
      )}
    </>
  );
}
