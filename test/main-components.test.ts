import test from "node:test";
import assert from "node:assert";
import { DynamicSideMenu } from "../src/components/dynamic-side-menu";
import { SiteHeader } from "../src/components/site-header";
import { NavUser } from "../src/components/nav-user";

// Asegura que los componentes principales estén definidos

test("DynamicSideMenu está definido", () => {
  assert.equal(typeof DynamicSideMenu, "function");
});

test("SiteHeader está definido", () => {
  assert.equal(typeof SiteHeader, "function");
});

test("NavUser está definido", () => {
  assert.equal(typeof NavUser, "function");
});
