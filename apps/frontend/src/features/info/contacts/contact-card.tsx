import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { contactLinks, linkTarget } from "./contact-links";
import type { ContactLink } from "./contact-links";
import type { Contact } from "../content";

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactCard({
  contact,
  size = "default",
}: {
  contact: Contact;
  size?: "default" | "sm";
}) {
  const links = contactLinks(contact);
  const limit = size === "sm" ? 2 : undefined;

  const cut = limit && links.length > limit + 1 ? limit : links.length;
  const rest = links.slice(cut);

  return (
    <Card role="article" size={size}>
      <CardContent>
        <ContactHeader contact={contact} />
        {contact.description && (
          <p className="mt-3 text-small group-data-[size=sm]/card:text-caption">
            {contact.description}
          </p>
        )}
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
                  className="group mt-1 -ml-2.5 h-tap-min text-muted-foreground group-data-[size=sm]/card:text-caption aria-expanded:bg-transparent aria-expanded:text-muted-foreground"
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

const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

function ContactHeader({ contact }: { contact: Contact }) {
  return (
    <header className="flex items-center gap-3">
      <Avatar
        aria-hidden="true"
        className="size-12 shrink-0 after:hidden group-data-[size=sm]/card:size-10"
      >
        {/* The size sits on a span: cn reads text-label as a color and drops it next to text-secondary-foreground. */}
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          <span className="text-label group-data-[size=sm]/card:text-small">
            {initials(contact.name)}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <h4 className="text-label text-balance group-data-[size=sm]/card:text-small group-data-[size=sm]/card:font-semibold">
          {contact.name}
        </h4>
        {/* The content writes audience to read after "Für", without repeating the name. */}
        {contact.audience && (
          <p className="text-small text-muted-foreground group-data-[size=sm]/card:text-caption">
            Für {contact.audience}
          </p>
        )}
        {contact.availability && (
          <p className="text-small text-muted-foreground group-data-[size=sm]/card:text-caption">
            {contact.availability}
          </p>
        )}
      </div>
    </header>
  );
}

function LinkList({ links, className = "" }: { links: ContactLink[]; className?: string }) {
  if (links.length === 0) return null;
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
        <span className="text-body font-medium break-all text-primary tabular-nums group-data-[size=sm]/card:text-small">
          {link.value}
        </span>
        {link.details && <span className="text-caption text-muted-foreground">{link.details}</span>}
        {link.external && <span className="sr-only">, öffnet in neuem Tab</span>}
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground group-data-[size=sm]/card:size-8">
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}
