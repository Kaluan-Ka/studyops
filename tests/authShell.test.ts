import assert from "node:assert/strict";
import test from "node:test";

import { isCurrentAuthTransition } from "../src/components/AuthProvider";
import { getAuthControlView } from "../src/lib/authControl";
import { syncUserProfile } from "../src/lib/supabase/profile";

test("sincroniza o profile pelo id do usuario e interrompe quando o upsert falha", async () => {
  const calls: Array<{ table: string; payload: unknown; options: unknown }> = [];
  const user = {
    id: "00000000-0000-0000-0000-000000000010",
    email: "ana@example.com",
    user_metadata: { full_name: "Ana Engenheira" },
  };
  const supabase = {
    from(table: string) {
      return {
        async upsert(payload: unknown, options: unknown) {
          calls.push({ table, payload, options });
          return { error: null };
        },
      };
    },
  };

  await syncUserProfile(supabase as never, user as never);

  assert.deepEqual(calls, [
    {
      table: "profiles",
      payload: {
        id: "00000000-0000-0000-0000-000000000010",
        display_name: "Ana Engenheira",
      },
      options: { onConflict: "id" },
    },
  ]);

  const failingSupabase = {
    from() {
      return {
        async upsert() {
          return { error: new Error("RLS policy failed") };
        },
      };
    },
  };

  await assert.rejects(() => syncUserProfile(failingSupabase as never, user as never));
});

test("descarta uma transicao de autenticacao superada por evento mais novo", () => {
  assert.equal(isCurrentAuthTransition(4, 4), true);
  assert.equal(isCurrentAuthTransition(5, 4), false);
});

test("mapeia os estados do dock para mensagens e acoes seguras", () => {
  assert.deepEqual(getAuthControlView({ status: "unconfigured", email: null }), {
    message: "Modo leitura",
    action: "none",
  });
  assert.deepEqual(getAuthControlView({ status: "loading", email: null }), {
    message: "Verificando sessão...",
    action: "none",
  });
  assert.deepEqual(getAuthControlView({ status: "authenticated", email: "ana@example.com" }), {
    message: "ana@example.com",
    action: "sign_out",
  });
  assert.deepEqual(getAuthControlView({ status: "authenticated", email: null }), {
    message: "Sessão ativa",
    action: "sign_out",
  });
  assert.deepEqual(getAuthControlView({ status: "signed_out", email: null }), {
    message: null,
    action: "sign_in",
  });
  assert.deepEqual(getAuthControlView({ status: "error", email: null }), {
    message: "Não foi possível verificar a sessão. Tente entrar novamente.",
    action: "sign_in",
  });
});
