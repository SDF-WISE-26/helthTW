import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { content } from "./content";
import type { ContentItem } from "./content";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

// `cn` does not know our custom text sizes, so overriding the drawer's text-base needs `!`.
const titleClass = "text-card-title! font-semibold text-foreground";

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
      <DrawerContent className="mx-auto w-full max-w-md data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
        {item ? (
          <ItemDetails item={item} />
        ) : (
          <>
            <div className="flex flex-col gap-2 px-5 pt-4">
              <DrawerTitle className={titleClass}>Beitrag nicht gefunden</DrawerTitle>
              <DrawerDescription>Diesen Beitrag gibt es nicht (mehr).</DrawerDescription>
            </div>
            <DrawerFooter className="px-5 pb-6">
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

function ItemDetails({ item }: { item: ContentItem }) {
  const meta = [
    item.source && `Quelle: ${item.source}`,
    item.lastReviewed && `Zuletzt geprüft am ${formatDate(item.lastReviewed)}`,
  ].filter(Boolean);

  return (
    <>
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-5 pt-4 pb-2">
        <DrawerTitle className={titleClass}>{item.title}</DrawerTitle>
        <DrawerDescription className="text-body! text-foreground">{item.summary}</DrawerDescription>
        {meta.length > 0 && <p className="text-small text-muted-foreground">{meta.join(" · ")}</p>}
      </div>

      {item.kind !== "article" && (
        <DrawerFooter className="px-5 pb-6">
          <Button asChild size="lg" className="w-full">
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
