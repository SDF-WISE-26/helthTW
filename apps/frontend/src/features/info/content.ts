import { allContacts, allItems, categoryList, tagList, topicList } from "content-collections";
import type { CategoryList, TagList, TopicList } from "content-collections";

export type { Contact, ContentItem } from "content-collections";
export type Topic = TopicList["entries"][number];
export type Category = CategoryList["entries"][number];
export type Tag = TagList["entries"][number];

const categoryOrder = new Map(categoryList.entries.map((c, i) => [c.id, i]));

export const content = {
  topics: topicList.entries,
  categories: categoryList.entries,
  tags: tagList.entries,
  items: allItems,
  // In the order of contact-categories.yaml.
  contacts: allContacts.toSorted(
    (a, b) => categoryOrder.get(a.category)! - categoryOrder.get(b.category)!,
  ),
};
