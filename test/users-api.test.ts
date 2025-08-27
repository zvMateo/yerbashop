import test from "node:test";
import assert from "node:assert";
import { GET, POST, DELETE } from "../src/app/api/users/route";

// Prueba de obtención de usuarios sin base de datos

test("GET /api/users devuelve array vacío sin base de datos", async () => {
  const res = await GET();
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, []);
});

// Prueba de creación de usuarios sin base de datos

test("POST /api/users devuelve 503 sin base de datos", async () => {
  const req = new Request("http://localhost/api/users", {
    method: "POST",
    body: JSON.stringify({
      name: "Ana",
      age: 30,
      email: "ana@example.com",
    }),
  });
  const res = await POST(req);
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.ok(data.error);
});

// Prueba de eliminación de usuarios sin base de datos

test("DELETE /api/users devuelve 503 sin base de datos", async () => {
  const req = new Request("http://localhost/api/users", {
    method: "DELETE",
    body: JSON.stringify({ id: 1 }),
  });
  const res = await DELETE(req);
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.ok(data.error);
});
