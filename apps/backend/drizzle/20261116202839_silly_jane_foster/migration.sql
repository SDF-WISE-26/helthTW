CREATE TABLE "questionnaire_responses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questionnaire_responses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_id" uuid NOT NULL,
	"questionnaire_id" integer NOT NULL,
	"version_id" integer NOT NULL,
	"scheduled_id" integer UNIQUE,
	"answers" jsonb NOT NULL,
	"score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaire_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questionnaire_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"questionnaire_id" integer NOT NULL,
	"version" integer NOT NULL,
	"title" varchar(120) NOT NULL,
	"tags" varchar(100)[] NOT NULL,
	"definition" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "questionnaire_versions_questionnaire_id_version_unique" UNIQUE("questionnaire_id","version"),
	CONSTRAINT "questionnaire_versions_id_questionnaire_id_unique" UNIQUE("id","questionnaire_id")
);
--> statement-breakpoint
CREATE TABLE "questionnaires" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questionnaires_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(100) NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_questionnaires" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scheduled_questionnaires_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_id" uuid NOT NULL,
	"questionnaire_id" integer NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scheduled_questionnaires_id_account_id_questionnaire_id_unique" UNIQUE("id","account_id","questionnaire_id")
);
--> statement-breakpoint
CREATE INDEX "questionnaire_responses_account_id_created_at_index" ON "questionnaire_responses" ("account_id","created_at");--> statement-breakpoint
CREATE INDEX "scheduled_questionnaires_account_id_due_at_index" ON "scheduled_questionnaires" ("account_id","due_at");--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_ZOPo15jLTYq9_fkey" FOREIGN KEY ("version_id","questionnaire_id") REFERENCES "questionnaire_versions"("id","questionnaire_id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_81QRfXkdHGn5_fkey" FOREIGN KEY ("scheduled_id","account_id","questionnaire_id") REFERENCES "scheduled_questionnaires"("id","account_id","questionnaire_id");--> statement-breakpoint
ALTER TABLE "questionnaire_versions" ADD CONSTRAINT "questionnaire_versions_questionnaire_id_questionnaires_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "scheduled_questionnaires" ADD CONSTRAINT "scheduled_questionnaires_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scheduled_questionnaires" ADD CONSTRAINT "scheduled_questionnaires_1bGzEdwoarrh_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaires"("id") ON DELETE RESTRICT;