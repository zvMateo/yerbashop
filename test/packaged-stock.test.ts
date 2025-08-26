import test from "node:test";
import assert from "node:assert";
import { POST } from "../src/app/api/packaged-stock/route";

// Verifica que el endpoint responda adecuadamente ante cuerpos inválidos
// En este caso falta el campo lotId, por lo que debería devolverse un 400

test("POST /api/packaged-stock devuelve 400 con cuerpo inválido", async () => {
  const req = new Request("http://localhost/api/packaged-stock", {
    method: "POST",
    body: JSON.stringify({ varietyId: 1 }),
  });
  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.ok(data.error);
});
