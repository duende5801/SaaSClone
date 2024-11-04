ALTER TABLE "products" RENAME COLUMN "cler_user_id" TO "clerk_user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "products.clerk_user_id_index";--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "location_message" SET DEFAULT 'Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off.';--> statement-breakpoint
ALTER TABLE "product_customizations" ALTER COLUMN "text_color" SET DEFAULT 'hsl(0, 0%, 100%)';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products.clerk_user_id_index" ON "products" USING btree ("clerk_user_id");