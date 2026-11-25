import { Globe, Mail, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import type { Contact } from "./content";

const contactCount = (count: number) => `${count} ${count === 1 ? "Kontakt" : "Kontakte"}`;

export function ContactWays({ contacts, style }: { contacts: Contact[]; style?: CSSProperties }) {
  const channels = contacts.flatMap((contact) => contact.channels.map((channel) => channel.type));
  const hasPhone = channels.includes("phone");
  const hasEmail = channels.includes("email");
  const hasWebsite = contacts.some((contact) => contact.website);

  return (
    <span style={style} className="flex items-center gap-2 text-small">
      {(hasPhone || hasEmail || hasWebsite) && (
        <span aria-hidden="true" className="flex gap-1.5 text-primary">
          {hasPhone && <Phone className="size-4" />}
          {hasEmail && <Mail className="size-4" />}
          {hasWebsite && <Globe className="size-4" />}
        </span>
      )}
      <span className="text-muted-foreground">{contactCount(contacts.length)}</span>
    </span>
  );
}
