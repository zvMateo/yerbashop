import test from "node:test";
import assert from "node:assert";
import { navMain } from "../src/config/side-menus";

test("navMain contiene el enlace de Dashboard", () => {
  assert.ok(navMain.find((item) => item.title === "Dashboard"));
});
