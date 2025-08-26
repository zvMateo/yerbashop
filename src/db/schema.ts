import { date, integer, numeric, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const varieties = pgTable("varieties", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
});

export const purchaseLots = pgTable("purchase_lots", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  varietyId: integer().notNull().references(() => varieties.id),
  date: date().notNull(),
  initialWeightKg: numeric({ precision: 10, scale: 2 }).notNull(),
  remainingWeightKg: numeric({ precision: 10, scale: 2 }).notNull(),
  cost: numeric({ precision: 10, scale: 2 }).notNull(),
});
