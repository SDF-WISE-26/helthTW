import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
// Types only: drizzle-kit must not have to load the shared package.
import type { Answers, QuestionnaireDefinition } from "@helthtw/shared/questionnaires";

// The ID is generated on the device. Tables with account data reference it with onDelete: "cascade".
export const accountsTable = pgTable("accounts", {
  id: uuid().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Questionnaires, see decision 0021. The Zod schemas in packages/shared/src/questionnaires
// describe `definition` and `answers`, the database does not look inside.

// The same values as `kind` in the shared package.
export const questionnaireKindEnum = pgEnum("questionnaire_kind", ["check-in", "screening"]);

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
    kind: questionnaireKindEnum().notNull(),
    title: varchar({ length: 120 }).notNull(),
    tags: varchar({ length: 100 }).array().notNull(),
    // The questions and the optional scoring rule.
    definition: jsonb().$type<QuestionnaireDefinition>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.questionnaireId, table.version)],
);

// A questionnaire that is due on a day. There is no status column: it counts as answered once
// a response points to it, and as due once `dueAt` has passed. The version is not fixed here,
// the newest one is used when answering.
export const scheduledQuestionnairesTable = pgTable(
  "scheduled_questionnaires",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    questionnaireId: integer("questionnaire_id")
      .notNull()
      .references(() => questionnairesTable.id, { onDelete: "restrict" }),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.accountId, table.dueAt)],
);

// One row per submitted questionnaire. `answers` holds the answer per question id.
// The score is stored with it, so a history needs no recalculation.
export const questionnaireResponsesTable = pgTable(
  "questionnaire_responses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
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
  (table) => [index().on(table.accountId, table.createdAt)],
);
