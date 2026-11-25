import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { contactLinks, linkTarget, sharedAvailability } from "./contact-links";
import type { ContactLink } from "./contact-links";
import type { Contact } from "../content";

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

// Every way to reach the contact as its own row. With `limit` (the AI chat), the rest folds away behind a button.
export function ContactCard({ contact, limit }: { contact: Contact; limit?: number }) {
  const links = contactLinks(contact);
  // Hiding a single row would cost as much space as the button that shows it.
  const cut = limit && links.length > limit + 1 ? limit : links.length;
  const rest = links.slice(cut);

  return (
    <Card role="article">
      <CardContent>
        <ContactHeader contact={contact} />
        {contact.description && <p className="mt-3 text-small">{contact.description}</p>}
        <Collapsible>
          <LinkList links={links.slice(0, cut)} className="mt-2" />
          {rest.length > 0 && (
            <>
              <CollapsibleContent>
                <LinkList links={rest} className="border-t border-border/60" />
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="group mt-1 -ml-2.5 h-tap-min text-small text-muted-foreground"
                >
                  <span className="group-data-[state=open]:hidden">
                    {rest.length} weitere anzeigen
                  </span>
                  <span className="hidden group-data-[state=open]:inline">Weniger anzeigen</span>
                  <ChevronDown
                    aria-hidden="true"
                    className="transition-transform group-data-[state=open]:rotate-180"
                  />
                </Button>
              </CollapsibleTrigger>
            </>
          )}
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function ContactHeader({ contact }: { contact: Contact }) {
  const availability = sharedAvailability(contact);
  return (
    <header className="flex items-center gap-3">
      <Avatar aria-hidden="true" className="size-12 shrink-0 after:hidden">
        <AvatarFallback className="bg-secondary text-label text-secondary-foreground">
          {initials(contact.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <h4 className="text-label text-balance">{contact.name}</h4>
        {/* The content writes audience to read after "Für", without repeating the name. */}
        {contact.audience && (
          <p className="text-small text-muted-foreground">Für {contact.audience}</p>
        )}
        {availability && (
          <p className="text-small text-muted-foreground">{capitalize(availability)}</p>
        )}
      </div>
    </header>
  );
}

function LinkList({ links, className = "" }: { links: ContactLink[]; className?: string }) {
  return (
    <ul className={`flex flex-col divide-y divide-border/60 ${className}`}>
      {links.map((link) => (
        <li key={link.href}>
          <LinkRow link={link} />
        </li>
      ))}
    </ul>
  );
}

// Like a row in the iOS contact sheet: the number or address, what it is below, icon trailing.
function LinkRow({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  return (
    <a
      href={link.href}
      {...linkTarget(link)}
      className={`flex min-h-tap-min items-center gap-3 rounded-lg py-2 transition-opacity active:opacity-60 ${focus}`}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-body font-medium break-all text-primary tabular-nums">
          {link.value}
        </span>
        {link.details && <span className="text-caption text-muted-foreground">{link.details}</span>}
        {link.external && <span className="sr-only">, öffnet in neuem Tab</span>}
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}
