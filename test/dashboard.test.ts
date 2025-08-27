import test from "node:test";
import assert from "node:assert";
import { getDashboardStats } from "../src/lib/dashboard";

// Verifica los valores por defecto cuando no hay base de datos
test("getDashboardStats devuelve ceros sin base de datos", async () => {
  const stats = await getDashboardStats();
  assert.deepEqual(stats, { summary: 0, sales: 0, products: 0 });
});
