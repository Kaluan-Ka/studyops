import assert from "node:assert/strict";
import test from "node:test";

import { canMutateWithAuth } from "../src/lib/authAccess";

test("somente sessao autenticada com id permite mutacao", () => {
  assert.equal(canMutateWithAuth("authenticated", "user-1"), true);
  assert.equal(canMutateWithAuth("authenticated", ""), false);
  assert.equal(canMutateWithAuth("signed_out", "user-1"), false);
  assert.equal(canMutateWithAuth("loading", "user-1"), false);
  assert.equal(canMutateWithAuth("unconfigured", null), false);
  assert.equal(canMutateWithAuth("error", "user-1"), false);
});
