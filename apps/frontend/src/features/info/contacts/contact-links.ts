import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Contact } from "../content";

type Channel = Contact["channels"][number];

// A way to reach a contact: phone, mail or website.
export type ContactLink = {
  href: string;
  icon: LucideIcon;
  value: string;
  // Always in this order: which line, who answers, when. E.g. "Zentrale · Silvia Zesch · Mo–Fr 8–18 Uhr".
  details?: string;
  external?: boolean;
};

// Stored as +49… without spaces, the space after the country code only helps reading.
const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

// When every channel has the same hours, the card says them once under the name instead of on every row.
export const sharedAvailability = (contact: Contact) => {
  const hours = new Set(contact.channels.map((channel) => channel.availability));
  return hours.size === 1 ? [...hours][0] : undefined;
};

const channelLink = (channel: Channel, shared?: string): ContactLink => {
  const phone = channel.type === "phone";
  const availability = channel.availability === shared ? undefined : channel.availability;
  return {
    href: `${phone ? "tel" : "mailto"}:${channel.value}`,
    icon: phone ? Phone : Mail,
    value: phone ? formatPhone(channel.value) : channel.value,
    details: [channel.label, channel.person, availability].filter(Boolean).join(" · ") || undefined,
  };
};

// Phones first, then mail, the website last, so every card reads the same way. Within a type, the order of the file.
const byType = (type: Channel["type"], contact: Contact) =>
  contact.channels
    .filter((channel) => channel.type === type)
    .map((channel) => channelLink(channel, sharedAvailability(contact)));

export const contactLinks = (contact: Contact): ContactLink[] => [
  ...byType("phone", contact),
  ...byType("email", contact),
  ...(contact.website
    ? [
        {
          href: contact.website,
          // An arrow out, like iOS and most apps use for "this leaves the app".
          icon: ArrowUpRight,
          value: new URL(contact.website).hostname.replace(/^www\./, ""),
          external: true,
        },
      ]
    : []),
];

export const linkTarget = (link: ContactLink) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
