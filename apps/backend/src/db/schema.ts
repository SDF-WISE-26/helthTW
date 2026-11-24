import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { UIMessage } from "ai";
// Types only: drizzle-kit must not have to load the shared package.
import type { Answers, QuestionnaireDefinition } from "@helthtw/shared/questionnaires";

// The ID is generated on the device. Tables with account data reference it with onDelete: "cascade".
export const accountsTable = pgTable("accounts", {
  id: uuid().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questionnairesTable = pgTable("questionnaires", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Rows are never updated: a change is a new row with a higher version,
// so an answer always points to the questions that were asked.
export const questionnaireVersionsTable = pgTable(
  "questionnaire_versions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    questionnaireId: integer("questionnaire_id")
      .notNull()
      .references(() => questionnairesTable.id, { onDelete: "restrict" }),
    version: integer().notNull(),
    title: varchar({ length: 120 }).notNull(),
    tags: varchar({ length: 100 }).array().notNull(),
    definition: jsonb().$type<QuestionnaireDefinition>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.questionnaireId, table.version),
    unique().on(table.id, table.questionnaireId),
  ],
);

// No status column: it counts as answered once a response points to it, and as due once
// `dueAt` has passed. The version is not fixed, the newest one is used when answering.
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
  (table) => [
    index().on(table.accountId, table.dueAt),
    unique().on(table.id, table.accountId, table.questionnaireId),
  ],
);

// `questionnaireId` repeats what the version says, so the composite foreign keys can check that
// version, account and questionnaire of a response match its scheduled questionnaire.
export const questionnaireResponsesTable = pgTable(
  "questionnaire_responses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    questionnaireId: integer("questionnaire_id").notNull(),
    versionId: integer("version_id").notNull(),
    scheduledId: integer("scheduled_id").unique(),
    answers: jsonb().$type<Answers>().notNull(),
    score: integer(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index().on(table.accountId, table.createdAt),
    foreignKey({
      columns: [table.versionId, table.questionnaireId],
      foreignColumns: [questionnaireVersionsTable.id, questionnaireVersionsTable.questionnaireId],
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.scheduledId, table.accountId, table.questionnaireId],
      foreignColumns: [
        scheduledQuestionnairesTable.id,
        scheduledQuestionnairesTable.accountId,
        scheduledQuestionnairesTable.questionnaireId,
      ],
    }),
  ],
);

// One row per UIMessage of the account's single chat. Rows are inserted, never updated.
export const chatMessagesTable = pgTable(
  "chat_messages",
  {
    id: varchar({ length: 64 }).primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    role: varchar({ length: 16 }).$type<"user" | "assistant">().notNull(),
    parts: jsonb().$type<UIMessage["parts"]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.accountId, table.createdAt)],
);
