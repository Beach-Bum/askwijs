CREATE TABLE "btw_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quarter" integer NOT NULL,
	"year" integer NOT NULL,
	"btw_collected" numeric(12, 2) DEFAULT '0',
	"btw_deducted" numeric(12, 2) DEFAULT '0',
	"btw_net" numeric(12, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'draft',
	"filed_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"address" text,
	"kvk_number" varchar(20),
	"btw_id" varchar(30),
	"default_payment_terms" integer DEFAULT 30,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counterparty_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"counterparty_pattern" varchar(255) NOT NULL,
	"category" varchar(100),
	"btw_rate" numeric(5, 2),
	"is_business" boolean DEFAULT true,
	"is_deductible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"client_id" uuid,
	"items" jsonb NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"btw_amount" numeric(12, 2) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"client_name" varchar(255),
	"client_email" varchar(255),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp,
	"sent_at" timestamp,
	"paid_at" timestamp,
	"is_recurring" boolean DEFAULT false,
	"recurring_interval" varchar(20),
	"pdf_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"image_url" text,
	"vendor" varchar(255),
	"amount" numeric(12, 2),
	"date" timestamp,
	"btw_amount" numeric(12, 2),
	"btw_rate" numeric(5, 2),
	"category" varchar(100),
	"source" varchar(20) DEFAULT 'upload',
	"transaction_id" uuid,
	"extracted_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"external_id" varchar(255),
	"date" timestamp NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"counterparty_name" varchar(255),
	"counterparty_iban" varchar(34),
	"description" text,
	"category" varchar(100),
	"btw_rate" numeric(5, 2),
	"btw_amount" numeric(12, 2),
	"is_business" boolean DEFAULT false,
	"is_deductible" boolean DEFAULT false,
	"confidence_score" numeric(3, 2),
	"status" varchar(20) DEFAULT 'pending_review' NOT NULL,
	"receipt_id" uuid,
	"import_source" varchar(20) DEFAULT 'psd2',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"company_name" varchar(255),
	"kvk_number" varchar(20),
	"btw_id" varchar(30),
	"iban" varchar(34),
	"address" text,
	"phone" varchar(20),
	"stripe_customer_id" varchar(255),
	"subscription_status" varchar(20) DEFAULT 'trial',
	"bank_connection_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id")
);
--> statement-breakpoint
ALTER TABLE "btw_returns" ADD CONSTRAINT "btw_returns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counterparty_rules" ADD CONSTRAINT "counterparty_rules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_invoices_user_status" ON "invoices" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_transactions_user_date" ON "transactions" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_transactions_status" ON "transactions" USING btree ("user_id","status");