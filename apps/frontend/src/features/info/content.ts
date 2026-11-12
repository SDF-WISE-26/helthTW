import { buildContent } from "@helthtw/shared/content";

// content/ is bundled into the app at build time (decision 0020), so it works offline and
// changes go live with the next release. Vite picks up new and changed files in dev.
// With `base`, the keys are the paths inside content/, e.g. "./items/nach-dem-einsatz.md".
const raw = import.meta.glob<string>(["./*.yaml", "./{items,contacts}/*"], {
  base: "../../../../../content",
  query: "?raw",
  import: "default",
  eager: true,
});
const files = Object.fromEntries(
  Object.entries(raw).map(([path, text]) => [path.slice("./".length), text]),
);

export const { content, problems } = buildContent(files);

// The content test fails on these, in dev they only show up in the console.
if (import.meta.env.DEV) {
  for (const p of problems) console.warn(`content/${p.file}: ${p.message}`);
}
