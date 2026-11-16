import { ContactCard } from "./contact-card";
import { content } from "./content";

// All contacts, grouped by category in the order of contact-categories.yaml.
export function ContactList() {
  return content.categories.map((category) => {
    const contacts = content.contacts.filter((contact) => contact.category === category.id);
    if (contacts.length === 0) return null;

    return (
      <section
        key={category.id}
        aria-labelledby={`contacts-${category.id}`}
        className="flex flex-col gap-3"
      >
        <h3 id={`contacts-${category.id}`} className="font-semibold">
          {category.label}
        </h3>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </section>
    );
  });
}
