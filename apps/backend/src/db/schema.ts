import {
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  time,
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

// No status or progress column: closed once `closedAt` is set, progress comes from the steps.
// `date`, `time` and `note` are health data: never log them.
export const incidentsTable = pgTable(
  "incidents",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    // When the incident happened, in local time. A string, so no time zone shifts the day.
    date: date({ mode: "string" }).notNull(),
    time: time(),
    note: text(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index().on(table.accountId, table.date)],
);

// Aftercare steps the person checks off, e.g. "tips", created open with the incident.
// Questionnaires are no rows here: they are steps through `scheduled_questionnaires` (#67)
// and done once answered, so "done" is never stored twice.
export const incidentStepsTable = pgTable(
  "incident_steps",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    incidentId: integer("incident_id")
      .notNull()
      .references(() => incidentsTable.id, { onDelete: "cascade" }),
    // Checked with Zod instead of a Postgres enum, so a new type needs no migration.
    type: varchar({ length: 50 }).notNull(),
    // Open while null. The backend sets the time, the person only checks the step off.
    doneAt: timestamp("done_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.incidentId, table.type)],
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
