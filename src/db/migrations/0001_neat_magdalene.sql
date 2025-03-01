ALTER TABLE "tenants" RENAME COLUMN "age" TO "dob";--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "user_id" uuid;