import { describe, expect, it } from "vite-plus/test";
import { buildContent } from "./build";

// The smallest complete content/. Each test adds or replaces files.
const base: Record<string, string> = {
  "topics.yaml": "- id: was-jetzt-hilft\n  title: Was jetzt hilft",
  "contact-categories.yaml": "- id: psnv-e\n  label: PSNV-E\n- id: hotlines\n  label: Hotlines",
  "tags.yaml": "- id: schlaf\n  label: Schlaf",
  "items/nach-dem-einsatz.md":
    "---\ntitle: Nach dem Einsatz\nsummary: S\nkind: article\ntopic: was-jetzt-hilft\n---\nText.",
  "contacts/a.yaml": "name: A\ncategory: hotlines",
  "contacts/b.yaml":
    'name: B\ncategory: psnv-e\nchannels:\n  - { type: phone, value: "+4930123456" }',
};
const pdf = (extra: string) =>
  `---\ntitle: X\nsummary: S\nkind: pdf\ntopic: was-jetzt-hilft\nurl: https://x.de/f.pdf\n${extra}\n---\n`;

describe("buildContent", () => {
  it("turns the files into content", () => {
    const { content, problems } = buildContent({
      ...base,
      "items/crlf.md":
        "---\r\ntitle: X\r\nsummary: S\r\nkind: article\r\ntopic: was-jetzt-hilft\r\n---\r\nA\r\n---\r\nB",
      "items/flyer.md": pdf("tags: [schlaf]"),
    });

    expect(problems).toEqual([]);
    expect(content.items).toMatchObject([
      { id: "crlf", body: "A\r\n---\r\nB" },
      { id: "flyer", kind: "pdf", url: "https://x.de/f.pdf", tags: ["schlaf"] },
      { id: "nach-dem-einsatz", kind: "article", body: "Text." },
    ]);
    // In the order of contact-categories.yaml, not of the files.
    expect(content.contacts.map((c) => c.id)).toEqual(["b", "a"]);
  });

  // Each rule from content/README.md: the broken file is reported, the rest still loads.
  it.each([
    ["no frontmatter", "items/x.md", "Nur Text"],
    ["invalid YAML", "items/x.md", "---\ntitle: [\n---\n"],
    ["unknown topic", "items/x.md", pdf("").replace("was-jetzt-hilft", "nope")],
    ["unknown tag", "items/x.md", pdf("tags: [nope]")],
    ["no web URL", "items/x.md", pdf("").replace("https://x.de/f.pdf", "ftp://x.de/f.pdf")],
    ["bad file name", "items/Bad_Name.md", pdf("")],
    ["unknown category", "contacts/x.yaml", "name: X\ncategory: nope"],
    [
      "phone with spaces",
      "contacts/x.yaml",
      "name: X\ncategory: psnv-e\nchannels:\n  - { type: phone, value: 030 123 }",
    ],
    ["duplicate id", "tags.yaml", "- id: schlaf\n  label: A\n- id: schlaf\n  label: B"],
  ])("reports %s", (_, file, text) => {
    const { content, problems } = buildContent({ ...base, [file]: text });

    expect(problems.map((p) => p.file)).toEqual([file]);
    expect(content.items.map((i) => i.id)).toContain("nach-dem-einsatz");
  });
});
