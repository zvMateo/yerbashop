import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const lotsTable = pgTable("lots", {
  id: serial("id").primaryKey(),
  remainingWeight: numeric("remaining_weight", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const packagedStockTable = pgTable("packaged_stock", {
  id: serial("id").primaryKey(),
  varietyId: integer("variety_id").notNull(),
  lotId: integer("lot_id").notNull(),
  size: integer("size").notNull(),
  units: integer("units").notNull(),
});

export const salesTable = pgTable("sales", {
  id: serial("id").primaryKey(),
  fecha: timestamp("fecha"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
});

export const saleItemsTable = pgTable("sale_items", {
  saleId: integer("sale_id").notNull(),
  varietyId: integer("variety_id").notNull(),
  size: integer("size").notNull(),
  units: integer("units").notNull(),
  precioUnitario: numeric("precio_unitario", {
    precision: 10,
    scale: 2,
  }).notNull(),
});
