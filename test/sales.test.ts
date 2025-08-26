import test from "node:test";
import assert from "node:assert";
import { POST } from "../src/app/api/sales/route";

// Prueba que el endpoint rechaza items inválidos

test("POST /api/sales devuelve 400 cuando el item es inválido", async () => {
  const req = new Request("http://localhost/api/sales", {
    method: "POST",
    body: JSON.stringify({ items: [{ varietyId: 1, size: 10 }] }),
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});
