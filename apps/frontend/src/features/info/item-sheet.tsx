import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ArticleBody } from "./article-body";
import { content } from "./content";
import type { ContentItem } from "./content";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

export function ItemSheet({ topicId, itemId }: { topicId: string; itemId: string }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const item = content.items.find((i) => i.id === itemId && i.topic === topicId);

  // Back to where the sheet was opened from, a deep link lands on the topic.
  const leave = () =>
    canGoBack
      ? router.history.back()
      : navigate({
          to: "/info/$topic",
          params: { topic: topicId },
          replace: true,
          resetScroll: false,
          viewTransition: false,
        });

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
                Zurück zum Thema
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
