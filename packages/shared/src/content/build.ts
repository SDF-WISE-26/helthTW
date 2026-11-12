import { readContacts, type Contact } from "./contacts";
import { readItems, type ContentItem } from "./items";
import { readList, type ContentFiles, type ContentProblem } from "./read";
import { categoryFile, tagFile, topicFile, type Category, type Tag, type Topic } from "./schemas";

export type Content = {
  topics: Topic[];
  categories: Category[];
  tags: Tag[];
  items: ContentItem[];
  contacts: Contact[];
};

/**
 * Turns the raw files of content/ into the data the app shows (decision 0020).
 * Never throws: whatever is broken is left out and reported in `problems`.
 * The content test fails on any problem, the app only logs them in dev.
 */
export const buildContent = (files: ContentFiles) => {
  const problems: ContentProblem[] = [];
  const topics = readList(files, "topics.yaml", topicFile, problems);
  const categories = readList(files, "contact-categories.yaml", categoryFile, problems);
  const tags = readList(files, "tags.yaml", tagFile, problems);
  const items = readItems(files, { topics, tags }, problems);
  const contacts = readContacts(files, { categories, tags }, problems);

  const content: Content = { topics, categories, tags, items, contacts };
  return { content, problems };
};
