import assert from "node:assert/strict";
import test from "node:test";

import { buildProfileUpsert } from "../src/lib/supabase/profile";

test("profile usa o id do usuario Auth como identidade", () => {
  assert.deepEqual(
    buildProfileUpsert({
      id: "00000000-0000-0000-0000-000000000001",
      email: "ana@example.com",
      user_metadata: { full_name: "Ana Engenheira" },
    }),
    {
      id: "00000000-0000-0000-0000-000000000001",
      display_name: "Ana Engenheira",
    },
  );
});

test("profile usa name e depois email como fallback", () => {
  assert.equal(
    buildProfileUpsert({
      id: "00000000-0000-0000-0000-000000000002",
      email: "bruno@example.com",
      user_metadata: { name: "Bruno" },
    }).display_name,
    "Bruno",
  );

  assert.equal(
    buildProfileUpsert({
      id: "00000000-0000-0000-0000-000000000003",
      email: "carla@example.com",
      user_metadata: {},
    }).display_name,
    "carla@example.com",
  );
});

test("profile nao usa metadata vazia como nome", () => {
  assert.equal(
    buildProfileUpsert({
      id: "00000000-0000-0000-0000-000000000004",
      email: null,
      user_metadata: { full_name: "  " },
    }).display_name,
    null,
  );
});
