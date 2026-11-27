CREATE TABLE "chat_messages" (
	"id" varchar(64),
	"account_id" uuid,
	"role" varchar(16) NOT NULL,
	"parts" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_messages_pkey" PRIMARY KEY("account_id","id")
);
--> statement-breakpoint
CREATE INDEX "chat_messages_account_id_created_at_index" ON "chat_messages" ("account_id","created_at");--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_account_id_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;