import MiniSearch from "minisearch";
import { content } from "../content";
import type { Contact, ContentItem } from "../content";
import { itemKinds } from "../item-kind";

export type Hits = { items: ContentItem[]; contacts: Contact[] };

// What the results can be narrowed to: one item kind (in the order of itemKinds) or contacts.
export type SearchType = ContentItem["kind"] | "contact";
export const searchTypes = [...Object.keys(itemKinds), "contact"] as SearchType[];
export const typeLabel = (type: SearchType) =>
  type === "contact" ? "Kontakte" : itemKinds[type].many;

// Items and contacts share one index, so how rare a word is counts across both.
type Doc = { id: string; title: string; tags: string; text: string };

export const minQueryLength = 2;

// "Angehörige" → "angehorige", "Maßnahme" → "massnahme", so typing without umlauts works.
const fold = (term: string) =>
  term
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ß/g, "ss");

// Every ending of a word is indexed too, so a prefix search also finds text inside a word:
// "unfallversicherung" → …, "versicherung", …, "ng". German has many compound words.
const suffixes = (term: string) =>
  Array.from({ length: Math.max(1, term.length - minQueryLength + 1) }, (_, i) => term.slice(i));

const tagLabel = new Map(content.tags.map((tag) => [tag.id, tag.label]));
const categoryLabel = new Map(content.categories.map((c) => [c.id, c.label]));
const labels = (ids: string[]) => ids.map((id) => tagLabel.get(id)).join(" ");

const itemDocs = content.items.map((item): Doc => ({
  id: `item:${item.id}`,
  title: item.title,
  tags: labels(item.tags),
  text: item.summary,
}));
const contactDocs = content.contacts.map((contact): Doc => ({
  id: `contact:${contact.id}`,
  title: contact.name,
  tags: labels(contact.tags),
  text: [categoryLabel.get(contact.category), contact.audience, contact.description].join(" "),
}));

const index = new MiniSearch<Doc>({
  fields: ["title", "tags", "text"],
  processTerm: (term) => suffixes(fold(term)),
  searchOptions: {
    // The query is folded the same way, but not split into endings.
    // Words shorter than 2 letters (e.g. while typing the next one) are left out.
    processTerm: (term) => (term.length < minQueryLength ? null : fold(term)),
    prefix: true,
    // Every word must match, so each further word narrows the results.
    combineWith: "AND",
    boost: { title: 3, tags: 2 },
  },
});
index.addAll([...itemDocs, ...contactDocs]);

const items = new Map(content.items.map((item) => [`item:${item.id}`, item]));
const contacts = new Map(content.contacts.map((contact) => [`contact:${contact.id}`, contact]));

// Best match first, in two groups.
export function searchInfo(query: string): Hits {
  const results: Hits = { items: [], contacts: [] };
  if (query.trim().length < minQueryLength) return results;

  for (const { id } of index.search(query)) {
    const item = items.get(id);
    if (item) results.items.push(item);
    const contact = contacts.get(id);
    if (contact) results.contacts.push(contact);
  }
  return results;
}

// The types among the results, in the order of searchTypes: the filters worth offering.
export const typesIn = ({ items, contacts }: Hits) =>
  searchTypes.filter((type) =>
    type === "contact" ? contacts.length > 0 : items.some((item) => item.kind === type),
  );

export const ofType = (hits: Hits, type?: SearchType): Hits =>
  type
    ? {
        items: hits.items.filter((item) => item.kind === type),
        contacts: type === "contact" ? hits.contacts : [],
      }
    : hits;

// Suggestions when the field is focused: a few tags as a start, those of the most items.
// Items only: contacts share a few broad tags, which would push out the rest.
const tagUse = new Map<string, number>();
for (const entry of content.items) {
  for (const tag of entry.tags) tagUse.set(tag, (tagUse.get(tag) ?? 0) + 1);
}
const uses = (id: string) => tagUse.get(id) ?? 0;
export const suggestedTags = content.tags
  .filter((tag) => uses(tag.id) > 0)
  .toSorted((a, b) => uses(b.id) - uses(a.id))
  .slice(0, 6);
