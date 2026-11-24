import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { contactLinks, linkDescription, linkTarget } from "./contact-links";
import type { ContactLink } from "./contact-links";
import type { Contact } from "../content";

const card = "flex flex-col rounded-2xl bg-card p-4 text-card-foreground ring-1 ring-foreground/5";
const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

// The full card: on /info, in search and in contact groups. Every way to reach the contact as its own row.
export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <article className={card}>
      <ContactHeader contact={contact} />
      {contact.description && <p className="mt-3 text-small">{contact.description}</p>}
      <ul className="mt-2 flex flex-col divide-y divide-border/60">
        {contactLinks(contact).map((link) => (
          <li key={link.href}>
            <LinkRow link={link} />
          </li>
        ))}
      </ul>
    </article>
  );
}

// The small card in the AI chat: who it is, and the ways to reach them as icons.
export function CompactContactCard({ contact }: { contact: Contact }) {
  return (
    <article className={card}>
      <ContactHeader contact={contact} />
      {/* Each link is a full tap target around a smaller circle, so circles sit 8px apart both ways.
          The margins take that 4px inset back, so the first circle lines up with the name. */}
      <ul className="mt-1 -mb-1 ml-14 flex flex-wrap">
        {contactLinks(contact).map((link) => (
          <li key={link.href}>
            <IconLink link={link} />
          </li>
        ))}
      </ul>
    </article>
  );
}

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

function ContactHeader({ contact }: { contact: Contact }) {
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
      </div>
    </header>
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

// Text hidden, so the full info goes into the accessible name and tooltip.
function IconLink({ link }: { link: ContactLink }) {
  const Icon = link.icon;
  const description = linkDescription(link);
  return (
    <a
      href={link.href}
      {...linkTarget(link)}
      aria-label={description}
      title={description}
      className="group flex size-tap-min items-center justify-center rounded-full outline-none transition-opacity active:opacity-60"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}
