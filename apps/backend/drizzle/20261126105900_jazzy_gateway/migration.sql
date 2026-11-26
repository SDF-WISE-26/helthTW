CREATE TABLE "safety_events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "safety_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_id" uuid NOT NULL,
	"rule_name" varchar(100) NOT NULL,
	"result" varchar(100) NOT NULL,
	"category" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "safety_events_account_id_created_at_index" ON "safety_events" ("account_id","created_at");--> statement-breakpoint
ALTER TABLE "safety_events" ADD CONSTRAINT "safety_events_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;