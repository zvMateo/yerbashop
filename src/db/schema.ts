import {
  integer,
  pgTable,
  varchar,
  numeric,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const lotsTable = pgTable("lots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  remainingWeight: numeric().notNull(),
});

export const packagedStockTable = pgTable("packaged_stock", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  varietyId: integer().notNull(),
  size: integer().notNull(),
  units: integer().notNull(),
  lotId: integer().notNull().references(() => lotsTable.id),
});

export const salesTable = pgTable("sales", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fecha: timestamp({ mode: "date" }).defaultNow().notNull(),
  total: numeric().notNull(),
});

export const saleItemsTable = pgTable(
  "sale_items",
  {
    saleId: integer().notNull().references(() => salesTable.id),
    varietyId: integer().notNull(),
    size: integer().notNull(),
    units: integer().notNull(),
    precioUnitario: numeric().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.saleId, table.varietyId, table.size] }),
  })
);
