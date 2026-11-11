import { index, integer, jsonb, pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core";
// Types only: drizzle-kit must not have to load the shared package.
import type { Answers, QuestionnaireDefinition } from "@helthtw/shared/questionnaires";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Questionnaires, see decision 0020. The Zod schemas in packages/shared/src/questionnaires
// describe `definition` and `answers`, the database does not look inside.

// A questionnaire as a whole, e.g. "check-in-kurz". Its content is in the versions.
export const questionnairesTable = pgTable("questionnaires", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per version. Rows are never updated: a change is a new row with a higher version,
// so answers always point to the exact questions that were asked.
export const questionnaireVersionsTable = pgTable(
  "questionnaire_versions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    questionnaireId: integer("questionnaire_id")
      .notNull()
      .references(() => questionnairesTable.id, { onDelete: "restrict" }),
    version: integer().notNull(),
    kind: varchar({ length: 32 }).notNull(),
    title: varchar({ length: 120 }).notNull(),
    tags: varchar({ length: 100 }).array().notNull(),
    // The questions and the optional scoring rule.
    definition: jsonb().$type<QuestionnaireDefinition>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.questionnaireId, table.version)],
);

// A questionnaire that is due on a day. The status is not stored, it follows from `dueAt`
// and `completedAt`. The version is not fixed here, the newest one is used when answering.
export const scheduledQuestionnairesTable = pgTable(
  "scheduled_questionnaires",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    questionnaireId: integer("questionnaire_id")
      .notNull()
      .references(() => questionnairesTable.id, { onDelete: "restrict" }),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.userId, table.dueAt)],
);

// One row per submitted questionnaire. `answers` holds the answer per question id.
// The score is stored with it, so a history needs no recalculation.
export const questionnaireResponsesTable = pgTable(
  "questionnaire_responses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    versionId: integer("version_id")
      .notNull()
      .references(() => questionnaireVersionsTable.id, { onDelete: "restrict" }),
    // Set when it answers a scheduled questionnaire, at most one response per scheduled one.
    scheduledId: integer("scheduled_id")
      .unique()
      .references(() => scheduledQuestionnairesTable.id, { onDelete: "set null" }),
    answers: jsonb().$type<Answers>().notNull(),
    // Empty for a questionnaire without a scoring rule.
    score: integer(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.userId, table.createdAt)],
);
