import { allContacts, allItems, categoryList, tagList, topicList } from "content-collections";

export type { Contact, ContentItem } from "content-collections";

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
