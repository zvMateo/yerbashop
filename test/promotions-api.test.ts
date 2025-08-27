import test from "node:test";
import assert from "node:assert";
import { GET, POST, DELETE } from "../src/app/api/promotions/route";

// Prueba del ciclo completo de promociones

test("POST, GET y DELETE /api/promotions maneja promociones en memoria", async () => {
  const createReq = new Request("http://localhost/api/promotions", {
    method: "POST",
    body: JSON.stringify({ title: "Oferta", discount: 10 }),
  });
  const createRes = await POST(createReq);
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.title, "Oferta");

  const listRes = await GET();
  const list = await listRes.json();
  assert.equal(list.length, 1);

  const deleteReq = new Request("http://localhost/api/promotions", {
    method: "DELETE",
    body: JSON.stringify({ id: created.id }),
  });
  const deleteRes = await DELETE(deleteReq);
  assert.equal(deleteRes.status, 200);

  const finalRes = await GET();
  const finalList = await finalRes.json();
  assert.equal(finalList.length, 0);
});
