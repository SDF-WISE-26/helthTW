CREATE TABLE "incident_steps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "incident_steps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"incident_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"done_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "incident_steps_incident_id_type_unique" UNIQUE("incident_id","type")
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "incidents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"account_id" uuid NOT NULL,
	"date" date NOT NULL,
	"time" time,
	"note" text,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "incidents_account_id_date_index" ON "incidents" ("account_id","date");--> statement-breakpoint
ALTER TABLE "incident_steps" ADD CONSTRAINT "incident_steps_incident_id_incidents_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;