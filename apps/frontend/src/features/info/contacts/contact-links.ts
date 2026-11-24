import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Contact } from "../content";

type Channel = Contact["channels"][number];

// A way to reach a contact: phone, mail or website.
export type ContactLink = {
  href: string;
  icon: LucideIcon;
  // Not shown, names the link for screen readers and tooltips, e.g. "Anrufen".
  action: string;
  value: string;
  // Always in this order: which line, who answers, when. E.g. "Zentrale · Silvia Zesch · Mo–Fr 8–18 Uhr".
  details?: string;
  external?: boolean;
};

// Stored as +49… without spaces, the space after the country code only helps reading.
const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

const channelLink = (channel: Channel): ContactLink => {
  const phone = channel.type === "phone";
  return {
    href: `${phone ? "tel" : "mailto"}:${channel.value}`,
    icon: phone ? Phone : Mail,
    action: phone ? "Anrufen" : "E-Mail schreiben",
    value: phone ? formatPhone(channel.value) : channel.value,
    details:
      [channel.label, channel.person, channel.availability].filter(Boolean).join(" · ") ||
      undefined,
  };
};

// Phones first, then mail, the website last, so every card reads the same way. Within a type, the order of the file.
const byType = (type: Channel["type"], contact: Contact) =>
  contact.channels.filter((channel) => channel.type === type).map(channelLink);

export const contactLinks = (contact: Contact): ContactLink[] => [
  ...byType("phone", contact),
  ...byType("email", contact),
  ...(contact.website
    ? [
        {
          href: contact.website,
          // An arrow out, like iOS and most apps use for "this leaves the app".
          icon: ArrowUpRight,
          action: "Website öffnen, neuer Tab",
          value: new URL(contact.website).hostname.replace(/^www\./, ""),
          external: true,
        },
      ]
    : []),
];

// Everything a link says in one line, for icon-only links that hide their text.
export const linkDescription = (link: ContactLink) =>
  [link.action, link.value, link.details].filter(Boolean).join(", ");

export const linkTarget = (link: ContactLink) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
