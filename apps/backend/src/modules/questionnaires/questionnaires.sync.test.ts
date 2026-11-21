import "dotenv/config";
import { eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vite-plus/test";
import type { QuestionnaireTemplate } from "@helthtw/shared/questionnaires";
import { questionnaireVersionsTable, questionnairesTable } from "../../db/schema";

const hasDb = !!process.env.DATABASE_URL;
process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { db } = await import("../../db");
const { syncQuestionnaires } = await import("./questionnaires.sync");

const slugs: string[] = [];

const template = (version = 1, text = "Frage?"): QuestionnaireTemplate => ({
  id: slugs[0],
  version,
  title: "Test",
  tags: ["schlaf"],
  questions: [{ id: "frage", type: "yes-no", text, safety: false }],
});

const versionsOf = async (slug: string) =>
  db
    .select({
      version: questionnaireVersionsTable.version,
      definition: questionnaireVersionsTable.definition,
    })
    .from(questionnaireVersionsTable)
    .innerJoin(
      questionnairesTable,
      eq(questionnairesTable.id, questionnaireVersionsTable.questionnaireId),
    )
    .where(eq(questionnairesTable.slug, slug));

describe.skipIf(!hasDb)("syncQuestionnaires", () => {
  afterAll(async () => {
    const rows = await db
      .select({ id: questionnairesTable.id })
      .from(questionnairesTable)
      .where(inArray(questionnairesTable.slug, slugs));
    const ids = rows.map((row) => row.id);
    if (ids.length > 0) {
      await db
        .delete(questionnaireVersionsTable)
        .where(inArray(questionnaireVersionsTable.questionnaireId, ids));
      await db.delete(questionnairesTable).where(inArray(questionnairesTable.id, ids));
    }
    await db.$client.end();
  });

  const fresh = () => {
    slugs.unshift(`sync-test-${crypto.randomUUID()}`);
    return slugs[0];
  };

  it("adds a new questionnaire with its first version", async () => {
    const slug = fresh();
    expect(await syncQuestionnaires([template()])).toEqual([`${slug} v1`]);
    expect(await versionsOf(slug)).toHaveLength(1);
  });

  it("does nothing when the same file is synced again", async () => {
    const slug = fresh();
    await syncQuestionnaires([template()]);
    expect(await syncQuestionnaires([template()])).toEqual([]);
    expect(await versionsOf(slug)).toHaveLength(1);
  });

  it("adds a higher version and keeps the old one", async () => {
    const slug = fresh();
    await syncQuestionnaires([template(1)]);
    expect(await syncQuestionnaires([template(2, "Neue Frage?")])).toEqual([`${slug} v2`]);
    expect((await versionsOf(slug)).map((row) => row.version).sort((a, b) => a - b)).toEqual([
      1, 2,
    ]);
  });

  it("refuses a changed file with the same version and leaves the old one", async () => {
    const slug = fresh();
    await syncQuestionnaires([template(1)]);
    await expect(syncQuestionnaires([template(1, "Geändert?")])).rejects.toThrow(
      "needs a higher version",
    );
    expect((await versionsOf(slug))[0].definition.questions[0]).toMatchObject({ text: "Frage?" });
  });

  it("refuses a version that is lower than the one in the database", async () => {
    fresh();
    await syncQuestionnaires([template(2)]);
    await expect(syncQuestionnaires([template(1)])).rejects.toThrow("lower than 2");
  });

  it("adds nothing when one file of several is refused", async () => {
    const good = template();
    const slug = fresh();
    await syncQuestionnaires([template(1)]);
    const other = { ...good, id: `${slug}-b` };
    slugs.push(other.id);
    await expect(syncQuestionnaires([other, template(1, "Geändert?")])).rejects.toThrow();
    expect(await versionsOf(other.id)).toHaveLength(0);
  });
});
