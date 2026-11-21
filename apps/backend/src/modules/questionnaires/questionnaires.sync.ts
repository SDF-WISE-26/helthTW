import { isDeepStrictEqual } from "node:util";
import { desc, eq } from "drizzle-orm";
import type { QuestionnaireTemplate } from "@helthtw/shared/questionnaires";
import { db } from "../../db";
import { questionnaireVersionsTable, questionnairesTable } from "../../db/schema";

// As the database hands it back: JSON drops fields that are undefined, such as a missing scoring.
const asJson = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// Nothing is updated or deleted, so old answers keep the questions they were given on.
export const syncQuestionnaires = (templates: QuestionnaireTemplate[]) =>
  db.transaction(async (tx) => {
    const added: string[] = [];

    for (const template of templates) {
      const { id: slug, version, title, tags, questions, scoring } = template;
      const definition = asJson({ questions, scoring });

      const [questionnaire] = await tx
        .insert(questionnairesTable)
        .values({ slug })
        .onConflictDoUpdate({ target: questionnairesTable.slug, set: { slug } })
        .returning({ id: questionnairesTable.id });

      const [latest] = await tx
        .select()
        .from(questionnaireVersionsTable)
        .where(eq(questionnaireVersionsTable.questionnaireId, questionnaire.id))
        .orderBy(desc(questionnaireVersionsTable.version))
        .limit(1);

      if (latest && version < latest.version) {
        throw new Error(
          `${slug}: version ${version} is lower than ${latest.version} in the database`,
        );
      }
      if (latest?.version === version) {
        if (
          !isDeepStrictEqual(
            asJson({ title, tags, definition }),
            asJson({ title: latest.title, tags: latest.tags, definition: latest.definition }),
          )
        ) {
          throw new Error(
            `${slug}: version ${version} was changed, a change needs a higher version`,
          );
        }
        continue;
      }

      await tx
        .insert(questionnaireVersionsTable)
        .values({ questionnaireId: questionnaire.id, version, title, tags, definition });
      added.push(`${slug} v${version}`);
    }

    return added;
  });
