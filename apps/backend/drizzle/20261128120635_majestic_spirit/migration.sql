ALTER TABLE "questionnaire_responses" DROP CONSTRAINT "questionnaire_responses_ZOPo15jLTYq9_fkey";--> statement-breakpoint
ALTER TABLE "questionnaire_responses" DROP CONSTRAINT "questionnaire_responses_81QRfXkdHGn5_fkey";--> statement-breakpoint
ALTER TABLE "questionnaire_versions" DROP CONSTRAINT "questionnaire_versions_questionnaire_id_questionnaires_id_fkey";--> statement-breakpoint
ALTER TABLE "scheduled_questionnaires" DROP CONSTRAINT "scheduled_questionnaires_1bGzEdwoarrh_fkey";--> statement-breakpoint
DROP TABLE "questionnaire_versions";--> statement-breakpoint
DROP TABLE "questionnaires";--> statement-breakpoint
ALTER TABLE "questionnaire_responses" DROP COLUMN "version_id";--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ALTER COLUMN "questionnaire_id" SET DATA TYPE varchar(100) USING "questionnaire_id"::varchar(100);--> statement-breakpoint
ALTER TABLE "scheduled_questionnaires" ALTER COLUMN "questionnaire_id" SET DATA TYPE varchar(100) USING "questionnaire_id"::varchar(100);--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_81QRfXkdHGn5_fkey" FOREIGN KEY ("scheduled_id","account_id","questionnaire_id") REFERENCES "scheduled_questionnaires"("id","account_id","questionnaire_id");
