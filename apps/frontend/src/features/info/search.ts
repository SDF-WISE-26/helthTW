import MiniSearch from "minisearch";
import type { Query } from "minisearch";
import { content } from "./content";
import type { Contact, ContentItem } from "./content";
import { itemKinds } from "./item-kind";

export type Hits = { items: ContentItem[]; contacts: Contact[] };

// What the results can be narrowed to: one item kind (in the order of itemKinds) or contacts.
export type SearchType = ContentItem["kind"] | "contact";
export const searchTypes = [...Object.keys(itemKinds), "contact"] as SearchType[];
export const typeLabel = (type: SearchType) =>
  type === "contact" ? "Kontakte" : itemKinds[type].many;

export const minQueryLength = 2;

// "Angehörige" → "angehorige", "Maßnahme" → "massnahme", so typing without umlauts works.
const fold = (term: string) =>
  term
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ß/g, "ss");

// Words of a sentence that say nothing about the topic left out of the query, so they neither have to match nor count as a match.
const fillers = new Set(
  (
    "ich du er sie es wir ihr man mich mir dich dir sich mein meine dein deine " +
    "der die das den dem des ein eine einen einem einer und oder aber auch noch nur " +
    "in im an am auf aus bei mit nach von vor zu zum zur für über um bis seit als " +
    "ist bin bist sind war hat habe haben hab kann können will muss soll " +
    "nicht kein keine nichts so wie was wer wo wann warum wenn dass ob ja nein sehr mehr"
  )
    .split(" ")
    .map(fold),
);

// Items and contacts share one index, so how rare a word is counts across both.
// `parts` holds the inner endings of every word, so a search also finds text inside
// a compound word: "unfallversicherung" → "nfallversicherung", …, "versicherung", …, "ng".
type Doc = { id: string; title: string; tags: string; text: string; parts: string };
const wordFields = ["title", "tags", "text"];

// A tag is found by its label and by the words people use for it ("schlafen" for "Schlaf").
const tagWords = new Map(content.tags.map((tag) => [tag.id, [tag.label, ...tag.synonyms]]));
const categoryLabel = new Map(content.categories.map((c) => [c.id, c.label]));
const labels = (ids: string[]) => ids.flatMap((id) => tagWords.get(id) ?? []).join(" ");

const doc = (id: string, title: string, tags: string, text: string): Doc => ({
  id,
  title,
  tags,
  text,
  parts: [title, tags, text].join(" "),
});

const index = new MiniSearch<Doc>({
  fields: [...wordFields, "parts"],
  processTerm: (term, field) => {
    const word = fold(term);
    if (field !== "parts") return word;
    const count = Math.max(0, word.length - minQueryLength);
    return Array.from({ length: count }, (_, i) => word.slice(i + 1));
  },
  searchOptions: {
    // Words shorter than 2 letters (e.g. while typing the next one) are left out.
    processTerm: (term) => (term.length < minQueryLength ? null : fold(term)),
    prefix: true,
    boost: { title: 3, tags: 2 },
  },
});
index.addAll([
  ...content.items.map((item) =>
    doc(`item:${item.id}`, item.title, labels(item.tags), item.summary),
  ),
  ...content.contacts.map((contact) =>
    doc(
      `contact:${contact.id}`,
      contact.name,
      labels(contact.tags),
      [categoryLabel.get(contact.category), contact.audience, contact.description].join(" "),
    ),
  ),
]);

// One word of the query: a whole word, typos allowed on longer ones ("albtraume" finds
// "albtraum"), or a literal part of a compound word. Typos on parts would match bits of
// unrelated words ("essen" → "gedankenkr-eisen").
const word = (term: string): Query => ({
  combineWith: "OR",
  queries: [
    {
      queries: [term],
      fields: wordFields,
      fuzzy: term.length < 5 ? false : term.length < 9 ? 1 : 2,
    },
    { queries: [term], fields: ["parts"] },
  ],
});

const items = new Map(content.items.map((item) => [`item:${item.id}`, item]));
const contacts = new Map(content.contacts.map((contact) => [`contact:${contact.id}`, contact]));

// Best match first, in two groups.
export function searchInfo(query: string): Hits {
  const results: Hits = { items: [], contacts: [] };
  const terms = query
    .split(/[\n\r\p{Z}\p{P}]+/u)
    .map(fold)
    .filter((term) => term.length >= minQueryLength && !fillers.has(term));
  if (terms.length === 0) return results;

  // Every word must match, so each further word narrows the results. If nothing has all
  // of them ("scheidung geld"), any word counts, most matches first.
  const search = (combineWith: "AND" | "OR") =>
    index.search({ combineWith, queries: terms.map(word) });
  const and = search("AND");

  for (const { id } of and.length > 0 ? and : search("OR")) {
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
