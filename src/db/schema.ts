import { sql, eq } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  pgView,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// --- Purchases and packaging -------------------------------------------------

// Base table that tracks lot weights by variety.
export const varieties = pgTable("varieties", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
});

export const purchaseLots = pgTable("purchase_lots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  varietyId: integer("variety_id").notNull().references(() => varieties.id),
  date: date().notNull(),
  initialWeightKg: numeric({ precision: 10, scale: 2 }).notNull(),
  remainingWeightKg: numeric({ precision: 10, scale: 2 }).notNull(),
  cost: numeric({ precision: 10, scale: 2 }).notNull(),
});

// Packaging size options.
export const packagingSizeEnum = pgEnum("packaging_size", ["1kg", "0.5kg"]);

// Sessions where product is packaged into retail units.
export const packagingSessions = pgTable("packaging_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lotId: integer("lot_id")
    .references(() => purchaseLots.id)
    .notNull(),
  size: packagingSizeEnum("size").notNull(),
  units: integer("units").notNull(),
  pesoDescontadoKg: numeric("peso_descontado_kg", { precision: 10, scale: 2 })
    .notNull(),
  fecha: date("fecha").notNull(),
});

// Trigger to subtract packaged weight from the source lot.
export const packagingSessionsWeightTrigger = sql`
  CREATE OR REPLACE FUNCTION subtract_packaging_weight()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE purchase_lots
    SET "remaining_weight_kg" = "remaining_weight_kg" - NEW."peso_descontado_kg"
    WHERE id = NEW."lot_id";
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS packaging_sessions_subtract_weight ON packaging_sessions;
  CREATE TRIGGER packaging_sessions_subtract_weight
  AFTER INSERT ON packaging_sessions
  FOR EACH ROW EXECUTE FUNCTION subtract_packaging_weight();
`;

// View that aggregates packaged units by variety and package size.
export const packagedStock = pgView("packaged_stock").as((qb) =>
  qb
    .select({
      varietyId: purchaseLots.varietyId,
      size: packagingSessions.size,
      units: sql<number>`sum(${packagingSessions.units})`,
    })
    .from(packagingSessions)
    .innerJoin(purchaseLots, eq(packagingSessions.lotId, purchaseLots.id))
    .groupBy(purchaseLots.varietyId, packagingSessions.size)
);
