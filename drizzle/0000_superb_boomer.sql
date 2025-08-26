CREATE TABLE "purchase_lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "purchase_lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"varietyId" integer NOT NULL,
	"date" date NOT NULL,
	"initialWeightKg" numeric(10, 2) NOT NULL,
	"remainingWeightKg" numeric(10, 2) NOT NULL,
	"cost" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "varieties" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "varieties_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_varietyId_varieties_id_fk" FOREIGN KEY ("varietyId") REFERENCES "public"."varieties"("id") ON DELETE no action ON UPDATE no action;