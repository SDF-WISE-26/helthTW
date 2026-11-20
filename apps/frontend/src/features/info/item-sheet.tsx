import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { splitArticleSections } from "./article-sections";
import { content } from "./content";
import type { ContentItem } from "./content";
import { useCloseItem } from "./item-link";

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
          <ItemDetails key={item.id} item={item} />
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
  const [sectionIndex, setSectionIndex] = useState(0);
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
        {item.kind === "article" && <ArticleReader item={item} sectionIndex={sectionIndex} />}
      </DrawerBody>

      {item.kind === "article" ? (
        <ArticleReaderFooter
          item={item}
          sectionIndex={sectionIndex}
          onSectionChange={setSectionIndex}
        />
      ) : (
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

function ArticleReader({
  item,
  sectionIndex,
}: {
  item: Extract<ContentItem, { kind: "article" }>;
  sectionIndex: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(
    () => bodyRef.current?.closest("[data-slot='drawer-body']")?.scrollTo({ top: 0 }),
    [sectionIndex],
  );
  const sections = splitArticleSections(item.body);
  const section = sections[sectionIndex];
  return (
    <div ref={bodyRef} className="mt-3">
      {section ? <ArticleBody markdown={section.markdown} /> : <ArticleBody markdown={item.body} />}
    </div>
  );
}

function ArticleReaderFooter({
  item,
  sectionIndex,
  onSectionChange,
}: {
  item: Extract<ContentItem, { kind: "article" }>;
  sectionIndex: number;
  onSectionChange: (index: number) => void;
}) {
  const sections = splitArticleSections(item.body);
  if (sections.length < 2) return null;

  const safeIndex = Math.min(sectionIndex, sections.length - 1);
  return (
    <DrawerFooter>
      <p className="text-center text-small text-muted-foreground" aria-live="polite">
        Abschnitt {safeIndex + 1} von {sections.length}
      </p>
      <div className="grid grid-cols-2 gap-2" aria-label="Artikel-Navigation">
        <Button
          size="lg"
          variant="outline"
          disabled={safeIndex === 0}
          onClick={() => onSectionChange(safeIndex - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Zurück
        </Button>
        <Button
          size="lg"
          disabled={safeIndex === sections.length - 1}
          onClick={() => onSectionChange(safeIndex + 1)}
        >
          Weiter
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </DrawerFooter>
  );
}
