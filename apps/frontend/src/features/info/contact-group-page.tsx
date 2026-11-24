import { cn } from "cn";
import { ContactCard } from "./contact-card";
import { groupSurface, groupTransition } from "./contact-look";
import { ContactWays } from "./contact-ways";
import { categoryContacts, content } from "./content";
import { InfoNotFound } from "./not-found";
import { coverHeader } from "./topic-look";

// A contact group with all its contacts. The header repeats the group card, like a topic page.
export function ContactGroupPage({ categoryId }: { categoryId: string }) {
  const category = content.categories.find((c) => c.id === categoryId);
  if (!category) return <InfoNotFound />;

  const contacts = categoryContacts(category.id);

  return (
    <>
      <header
        style={groupTransition(category.id, "card")}
        className={cn(coverHeader, groupSurface)}
      >
        <h1 style={groupTransition(category.id, "title")} className="text-title">
          {category.label}
        </h1>
        <ContactWays contacts={contacts} style={groupTransition(category.id, "meta")} />
      </header>

      <ul className="mt-2 flex flex-col gap-3">
        {contacts.map((contact) => (
          <li key={contact.id}>
            <ContactCard contact={contact} />
          </li>
        ))}
      </ul>
    </>
  );
}
