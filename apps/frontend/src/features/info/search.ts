import MiniSearch from "minisearch";
import { content } from "./content";
import type { Contact, ContentItem } from "./content";
import { itemKinds } from "./item-kind";

type Hits = { items: ContentItem[]; contacts: Contact[] };

// What the results can be narrowed to: one item kind or contacts. In the URL as `?type=`.
export const searchTypes = ["article", "pdf", "link", "contact"] as const;
export type SearchType = (typeof searchTypes)[number];
export const typeLabel: Record<SearchType, string> = {
  article: itemKinds.article.many,
  pdf: itemKinds.pdf.many,
  link: itemKinds.link.many,
  contact: "Kontakte",
};

const showsItem = (item: ContentItem, type?: SearchType) => !type || item.kind === type;
const showsContacts = (type?: SearchType) => !type || type === "contact";

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

// Best match first, in two groups, only the given type if there is one.
export function searchInfo(query: string, type?: SearchType): Hits {
  const results: Hits = { items: [], contacts: [] };
  if (query.trim().length < minQueryLength) return results;

  for (const { id } of index.search(query)) {
    const item = items.get(id);
    if (item && showsItem(item, type)) results.items.push(item);
    const contact = contacts.get(id);
    if (contact && showsContacts(type)) results.contacts.push(contact);
  }
  return results;
}

// Tags in use by the given type (or any), in the order of tags.yaml: the suggestions before typing.
export function suggestedTags(type?: SearchType) {
  const entries = [
    ...content.items.filter((item) => showsItem(item, type)),
    ...(showsContacts(type) ? content.contacts : []),
  ];
  const used = new Set(entries.flatMap((entry) => entry.tags));
  return content.tags.filter((tag) => used.has(tag.id));
}
