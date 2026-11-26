import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Contact } from "../content";

type Channel = Contact["channels"][number];

// A way to reach a contact: phone, mail or website.
export type ContactLink = {
  href: string;
  icon: LucideIcon;
  value: string;
  details?: string;
  external?: boolean;
};

const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

// When every channel has the same hours, the card says them once under the name instead of on every row.
// Not for a single labeled channel: its hours belong to that line, not to the whole contact.
export const sharedAvailability = ({ channels }: Contact) => {
  if (channels.length === 1 && channels[0].label) return undefined;
  const hours = new Set(channels.map((channel) => channel.availability));
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
const byType = (type: Channel["type"], contact: Contact, shared?: string) =>
  contact.channels
    .filter((channel) => channel.type === type)
    .map((channel) => channelLink(channel, shared));

export const contactLinks = (contact: Contact): ContactLink[] => {
  const shared = sharedAvailability(contact);
  return [
    ...byType("phone", contact, shared),
    ...byType("email", contact, shared),
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
};

export const linkTarget = (link: ContactLink) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
