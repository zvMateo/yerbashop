import test from "node:test";
import assert from "node:assert";
import { buildUrl, normalizeUrl } from "../src/lib/route-utils";

test("buildUrl construye URLs con parámetros", () => {
  const url = buildUrl("https://ejemplo.com", "/buscar", { q: "yerba", page: 1 });
  assert.equal(url, "https://ejemplo.com/buscar?q=yerba&page=1");
});

test("normalizeUrl elimina barras repetidas y finales", () => {
  const url = normalizeUrl("https://ejemplo.com//foo/bar/");
  assert.equal(url, "https://ejemplo.com/foo/bar");
});
