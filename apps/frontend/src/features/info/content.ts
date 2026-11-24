import { allContacts, allItems, categoryList, tagList, topicList } from "content-collections";
import type { CategoryList, TagList, TopicList } from "content-collections";
import { itemKinds } from "./item-kind";

export type { Contact, ContentItem } from "content-collections";
export type Topic = TopicList["entries"][number];
export type Category = CategoryList["entries"][number];
export type Tag = TagList["entries"][number];

const categoryOrder = new Map(categoryList.entries.map((c, i) => [c.id, i]));
const kindOrder = Object.keys(itemKinds);

export const content = {
  topics: topicList.entries,
  categories: categoryList.entries,
  tags: tagList.entries,
  // In the order of itemKinds, so own articles come first.
  items: allItems.toSorted((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind)),
  // In the order of contact-categories.yaml.
  contacts: allContacts.toSorted(
    (a, b) => categoryOrder.get(a.category)! - categoryOrder.get(b.category)!,
  ),
};

export const topicItems = (topicId: string) =>
  content.items.filter((item) => item.topic === topicId);

export const categoryContacts = (categoryId: string) =>
  content.contacts.filter((contact) => contact.category === categoryId);
