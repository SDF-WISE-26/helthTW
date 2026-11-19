import { Globe, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "cn";
import { content } from "./content";
import type { Contact } from "./content";

type Channel = Contact["channels"][number];

// Avatar tint by category position, so the groups are told apart at a glance.
const tints = [
  "bg-secondary text-secondary-foreground",
  "bg-status-watch-surface text-status-watch",
];

// Stored as +49… without spaces, the space after the country code only helps reading.
const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export function ContactCard({ contact }: { contact: Contact }) {
  const tint = tints[content.categories.findIndex((c) => c.id === contact.category) % tints.length];

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground ring-1 ring-foreground/5">
      <header className="flex items-center gap-3">
        {/* Initials until the contacts get logos. */}
        <Avatar aria-hidden="true" className="size-12 after:hidden">
          <AvatarFallback className={cn("text-label", tint)}>
            {initials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <h4 className="min-w-0 text-label">{contact.name}</h4>
      </header>

      {contact.description && <p className="text-small">{contact.description}</p>}

      <ul className="flex flex-col divide-y divide-border/60">
        {contact.channels.map((channel) => (
          <li key={channel.value}>
            <ChannelRow channel={channel} />
          </li>
        ))}
        {contact.website && (
          <li>
            <Row
              href={contact.website}
              icon={Globe}
              title="Website"
              details={new URL(contact.website).hostname.replace(/^www\./, "")}
              external
            />
          </li>
        )}
      </ul>
    </article>
  );
}

function ChannelRow({ channel }: { channel: Channel }) {
  const phone = channel.type === "phone";
  return (
    <Row
      href={`${phone ? "tel" : "mailto"}:${channel.value}`}
      icon={phone ? Phone : Mail}
      title={phone ? formatPhone(channel.value) : channel.value}
      details={[channel.label, channel.person, channel.availability].filter(Boolean).join(" · ")}
    />
  );
}

function Row({
  href,
  icon: Icon,
  title,
  details,
  external,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  details?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="flex min-h-tap-min items-center gap-3 rounded-lg py-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-medium break-all text-primary tabular-nums">{title}</span>
        {details && <span className="text-caption text-muted-foreground">{details}</span>}
      </span>
    </a>
  );
}
