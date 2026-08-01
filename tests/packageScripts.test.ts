import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

type PackageJson = {
  scripts?: Record<string, string>;
};

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as PackageJson;
const scripts = packageJson.scripts ?? {};

test("dev desliga source maps para reduzir pressao de memoria local", () => {
  assert.match(scripts.dev ?? "", /next dev/);
  assert.match(scripts.dev ?? "", /--disable-source-maps/);
});

test("preview usa somente start para inspecao visual mais leve", () => {
  assert.equal(scripts.preview, "next start");
});

test("preview fresh explicita o custo de build antes do start", () => {
  assert.equal(scripts["preview:fresh"], "npm run build && next start");
});
