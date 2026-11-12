import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import { slug, type Tag } from "./schemas";

/** Raw text of every file, keyed by its path inside content/, e.g. "items/nach-dem-einsatz.md". */
export type ContentFiles = Record<string, string>;

/** Something broken in content/. The content test fails on any, the app leaves the broken part out. */
export type ContentProblem = { file: string; message: string };

/** Parses YAML and checks it against the schema. Returns undefined if broken, with the reason in `problems`. */
export const readYaml = <T>(
  file: string,
  raw: string | undefined,
  schema: z.ZodType<T>,
  problems: ContentProblem[],
): T | undefined => {
  if (raw === undefined) {
    problems.push({ file, message: "file missing" });
    return undefined;
  }
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (error) {
    problems.push({ file, message: `invalid YAML: ${(error as Error).message.split("\n")[0]}` });
    return undefined;
  }
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const issues = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
  problems.push({ file, message: issues.join("; ") });
  return undefined;
};

/** A YAML list with ids, e.g. tags.yaml. An entry whose id came before is left out. */
export const readList = <T extends { id: string }>(
  files: ContentFiles,
  file: string,
  schema: z.ZodType<T[]>,
  problems: ContentProblem[],
) => {
  const seen = new Set<string>();
  return (readYaml(file, files[file], schema, problems) ?? []).filter((entry) => {
    if (seen.has(entry.id)) {
      problems.push({ file, message: `duplicate id: ${entry.id}` });
      return false;
    }
    seen.add(entry.id);
    return true;
  });
};

/** Every file in a folder as [file, id], the file name is the id. Sorted, so the order never depends on how the files were read. */
export const filesIn = (
  files: ContentFiles,
  dir: string,
  ext: string,
  problems: ContentProblem[],
) =>
  Object.keys(files)
    .sort()
    .filter((file) => file.startsWith(dir))
    .flatMap((file) => {
      const id = file.slice(dir.length, -ext.length);
      if (file.endsWith(ext) && slug.safeParse(id).success) return [[file, id] as const];
      problems.push({
        file,
        message: `must be ${dir}<id>${ext}, the id in lowercase letters, digits, hyphens`,
      });
      return [];
    });

// "---\n<yaml>\n---\n<body>" at the very start of the file.
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

/** Splits a Markdown file into its YAML frontmatter and the body. Undefined if there is no frontmatter. */
export const splitFrontmatter = (raw: string) => {
  const match = FRONTMATTER.exec(raw);
  return match ? { frontmatter: match[1], body: match[2].trim() } : undefined;
};

/** Keeps only tags from tags.yaml and reports the others. */
export const knownTags = (file: string, ids: string[], tags: Tag[], problems: ContentProblem[]) =>
  ids.filter((id) => {
    if (tags.some((tag) => tag.id === id)) return true;
    problems.push({ file, message: `unknown tag: ${id}` });
    return false;
  });
