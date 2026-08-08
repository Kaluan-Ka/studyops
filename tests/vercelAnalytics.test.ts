import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

type PackageJson = {
  dependencies?: Record<string, string>;
};

test("integra Vercel Web Analytics no layout raiz do app", () => {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as PackageJson;
  const layout = fs.readFileSync("src/app/layout.tsx", "utf8");

  assert.ok(packageJson.dependencies?.["@vercel/analytics"]);
  assert.match(layout, /import\s+\{\s*Analytics\s*\}\s+from\s+"@vercel\/analytics\/next"/);
  assert.match(layout, /<Analytics\s*\/>/);
});
