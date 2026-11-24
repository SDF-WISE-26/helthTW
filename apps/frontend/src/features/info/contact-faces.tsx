import type { CSSProperties } from "react";
import { initials } from "./contact-look";
import type { Contact } from "./content";

const face = "flex size-11 items-center justify-center rounded-full text-small font-semibold";

// A group card's art: who is in the group, up to four initials. With more, the fourth place counts the rest.
export function ContactFaces({ contacts, style }: { contacts: Contact[]; style?: CSSProperties }) {
  const shown = contacts.length > 4 ? contacts.slice(0, 3) : contacts;
  const rest = contacts.length - shown.length;

  return (
    <div
      aria-hidden="true"
      style={style}
      className="absolute top-1/2 right-5 grid -translate-y-1/2 grid-cols-2 gap-1.5"
    >
      {shown.map((contact) => (
        <span key={contact.id} className={`${face} bg-white/15 text-white`}>
          {initials(contact.name)}
        </span>
      ))}
      {rest > 0 && <span className={`${face} bg-(--ochre-300) text-topic-4`}>+{rest}</span>}
    </div>
  );
}
