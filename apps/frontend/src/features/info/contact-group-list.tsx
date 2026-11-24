import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { categoryContacts, content } from "./content";
import type { Category } from "./content";
import { ContactFaces } from "./contact-faces";
import { contactCount, groupSurface, groupTransition } from "./contact-look";
import { coverCard } from "./topic-look";

// One card per contact group, in the order of contact-categories.yaml. Empty groups are left out.
export function ContactGroupList() {
  const groups = content.categories.filter((category) => categoryContacts(category.id).length);

  return (
    <ul className="flex flex-col gap-3">
      {groups.map((category) => (
        <li key={category.id}>
          <ContactGroupCard category={category} />
        </li>
      ))}
    </ul>
  );
}

function ContactGroupCard({ category }: { category: Category }) {
  const contacts = categoryContacts(category.id);

  return (
    <Link
      to="/info/contacts/$category"
      params={{ category: category.id }}
      style={groupTransition(category.id, "card")}
      className={cn(coverCard, groupSurface)}
    >
      <span style={groupTransition(category.id, "title")} className="text-card-title">
        {category.label}
      </span>
      <span style={groupTransition(category.id, "meta")} className="text-small text-white/85">
        {contactCount(contacts.length)}
      </span>
      <ContactFaces contacts={contacts} style={groupTransition(category.id, "art")} />
    </Link>
  );
}
