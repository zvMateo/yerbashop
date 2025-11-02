-- ========================================
-- SCRIPT DE MIGRACIÓN PARA YERBASHOP
-- Ejecuta este script en Supabase SQL Editor
-- ========================================

-- 1. CREAR ENUMS
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'draft');
CREATE TYPE "public"."sale_channel" AS ENUM('online', 'whatsapp', 'instagram', 'presencial');
CREATE TYPE "public"."stock_movement_type" AS ENUM('in', 'out', 'adjustment', 'transfer');

-- 2. CREAR TABLA CATEGORIES
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

-- 3. CREAR TABLA CUSTOMERS
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"phone" text,
	"first_name" text,
	"last_name" text,
	"full_name" text NOT NULL,
	"date_of_birth" timestamp,
	"gender" text,
	"avatar" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"preferences" jsonb DEFAULT '{"notifications":true,"newsletter":false,"preferredChannel":"whatsapp"}'::jsonb,
	"total_orders" integer DEFAULT 0,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"last_order_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);

-- 4. CREAR TABLA CUSTOMER_ADDRESSES
CREATE TABLE "customer_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"type" text DEFAULT 'shipping' NOT NULL,
	"is_default" boolean DEFAULT false,
	"street" text NOT NULL,
	"number" text NOT NULL,
	"floor" text,
	"apartment" text,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text DEFAULT 'Argentina' NOT NULL,
	"instructions" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- 5. CREAR TABLA PRODUCTS
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"long_description" text,
	"category_id" uuid NOT NULL,
	"brand" text,
	"origin" text,
	"type" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);

-- 6. CREAR TABLA PRODUCT_VARIANTS
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"unit" text DEFAULT 'kg' NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"cost" numeric(10, 2),
	"sku" text NOT NULL,
	"barcode" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);

-- 7. CREAR TABLA INVENTORY
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"available_quantity" integer DEFAULT 0 NOT NULL,
	"min_stock_level" integer DEFAULT 10,
	"max_stock_level" integer DEFAULT 1000,
	"last_restocked" timestamp,
	"location" text DEFAULT 'principal',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- 8. CREAR TABLA ORDERS
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"channel" "sale_channel" DEFAULT 'online' NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"customer_phone" text NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"discount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"payment_method" text,
	"payment_status" text DEFAULT 'pending',
	"payment_reference" text,
	"shipping_method" text DEFAULT 'standard',
	"tracking_number" text,
	"estimated_delivery" timestamp,
	"delivered_at" timestamp,
	"notes" text,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	"shipped_at" timestamp,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

-- 9. CREAR TABLA ORDER_ITEMS
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"product_name" text NOT NULL,
	"variant_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- 10. CREAR TABLA STOCK_MOVEMENTS
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"type" "stock_movement_type" NOT NULL,
	"quantity" integer NOT NULL,
	"previous_stock" integer NOT NULL,
	"new_stock" integer NOT NULL,
	"reason" text,
	"reference_id" uuid,
	"reference_type" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- 11. AGREGAR FOREIGN KEYS
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_customers_id_fk" 
FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variant_id_product_variants_id_fk" 
FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" 
FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" 
FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" 
FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" 
FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" 
FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_variant_id_product_variants_id_fk" 
FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- 12. CREAR ÍNDICES PARA MEJOR PERFORMANCE
CREATE INDEX "idx_products_category_id" ON "products"("category_id");
CREATE INDEX "idx_products_slug" ON "products"("slug");
CREATE INDEX "idx_product_variants_product_id" ON "product_variants"("product_id");
CREATE INDEX "idx_product_variants_sku" ON "product_variants"("sku");
CREATE INDEX "idx_inventory_variant_id" ON "inventory"("variant_id");
CREATE INDEX "idx_orders_customer_id" ON "orders"("customer_id");
CREATE INDEX "idx_orders_status" ON "orders"("status");
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");
CREATE INDEX "idx_stock_movements_variant_id" ON "stock_movements"("variant_id");
CREATE INDEX "idx_stock_movements_created_at" ON "stock_movements"("created_at");

-- ========================================
-- ¡LISTO! Ahora ejecuta este script completo en Supabase SQL Editor
-- ========================================
