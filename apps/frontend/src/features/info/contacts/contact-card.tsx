import { Globe, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "cn";
import type { Contact } from "../content";

type Channel = Contact["channels"][number];

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

// Stored as +49… without spaces, the space after the country code only helps reading.
const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

// A way to reach the contact: phone, mail or website.
type Link = {
  href: string;
  icon: LucideIcon;
  title: string;
  details?: string;
  external?: boolean;
};

const channelLink = (channel: Channel): Link => {
  const phone = channel.type === "phone";
  return {
    href: `${phone ? "tel" : "mailto"}:${channel.value}`,
    icon: phone ? Phone : Mail,
    title: phone ? formatPhone(channel.value) : channel.value,
    details: [channel.label, channel.person, channel.availability].filter(Boolean).join(" · "),
  };
};

const contactLinks = (contact: Contact): Link[] => [
  ...contact.channels.map(channelLink),
  ...(contact.website
    ? [
        {
          href: contact.website,
          icon: Globe,
          title: "Website",
          details: new URL(contact.website).hostname.replace(/^www\./, ""),
          external: true,
        },
      ]
    : []),
];

const linkTarget = (link: Link) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

// `compact` shows only avatar, name and the contact ways as icons
export function ContactCard({ contact, compact }: { contact: Contact; compact?: boolean }) {
  const links = contactLinks(contact);

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground ring-1 ring-foreground/5">
      <header className={cn("flex gap-3", compact ? "items-start" : "items-center")}>
        <Avatar aria-hidden="true" className="size-12 after:hidden">
          <AvatarFallback className="bg-secondary text-label text-secondary-foreground">
            {initials(contact.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h4 className="text-label">{contact.name}</h4>
          {compact && (
            <ul className="-my-1.5 -ml-2 flex flex-wrap">
              {links.map((link) => (
                <li key={link.href}>
                  <IconLink link={link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {!compact && (
        <>
          {contact.description && <p className="text-small">{contact.description}</p>}
          <ul className="flex flex-col divide-y divide-border/60">
            {links.map((link) => (
              <li key={link.href}>
                <Row link={link} />
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

function Row({ link }: { link: Link }) {
  const Icon = link.icon;
  return (
    <a
      href={link.href}
      {...linkTarget(link)}
      className="flex min-h-tap-min items-center gap-3 rounded-lg py-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-medium break-all text-primary tabular-nums">{link.title}</span>
        {link.details && <span className="text-caption text-muted-foreground">{link.details}</span>}
      </span>
    </a>
  );
}

// Text hidden, so the full info goes into the accessible name and tooltip.
function IconLink({ link }: { link: Link }) {
  const Icon = link.icon;
  const label = [link.title, link.details].filter(Boolean).join(", ");
  return (
    <a
      href={link.href}
      {...linkTarget(link)}
      aria-label={label}
      title={label}
      className="group flex size-tap-min items-center justify-center rounded-full outline-none"
    >
      {/* Smaller circle, the link keeps the full tap size. */}
      <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}
