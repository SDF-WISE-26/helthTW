import { expect, it } from "vite-plus/test";
import { getArticleSection, splitArticleSections } from "./article-sections";

const markdown = `## Erste Zeit

Erster Text.

## Wann du früher Hilfe holen solltest

Hilf dir selbst.

## Andere Zeit

Weiterer Text.`;

it("splits article Markdown at H2 headings", () => {
  const sections = splitArticleSections(markdown);
  expect(sections.map((section) => section.title)).toEqual([
    "Erste Zeit",
    "Wann du früher Hilfe holen solltest",
    "Andere Zeit",
  ]);
  expect(sections[0].markdown).toContain("Erster Text.");
});

it("gets one named section for reuse on another screen", () => {
  expect(getArticleSection(markdown, "Wann du früher Hilfe holen solltest")?.markdown).toContain(
    "Hilf dir selbst.",
  );
});
