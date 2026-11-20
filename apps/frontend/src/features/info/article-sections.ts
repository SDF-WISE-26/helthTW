export type ArticleSection = {
  title: string;
  markdown: string;
};

export function splitArticleSections(markdown: string): ArticleSection[] {
  const matches = [...markdown.matchAll(/^##[ \t]+(.+)$/gm)];
  if (matches.length === 0) return [];

  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    return {
      title: match[1].trim(),
      markdown: markdown.slice(start, end).trim(),
    };
  });
}

export function getArticleSection(markdown: string, title: string): ArticleSection | undefined {
  return splitArticleSections(markdown).find((section) => section.title === title);
}
