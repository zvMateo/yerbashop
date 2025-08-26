import test from "node:test";
import assert from "node:assert";
import { ChartAreaInteractive } from "../src/components/chart-area-interactive";

test("ChartAreaInteractive está definido", () => {
  assert.equal(typeof ChartAreaInteractive, "function");
});
