import assert from "node:assert/strict";
import test from "node:test";

import { getStudyNoteAuthView } from "../src/lib/studyNoteAccess";

test("loading bloqueia a nota e não revela conteúdo local", () => {
  assert.deepEqual(getStudyNoteAuthView("loading", null), {
    canMutate: false,
    mode: "loading",
    message: "Verificando sessão...",
    showSignIn: false,
  });
});

test("visitante recebe CTA para entrar com Google", () => {
  assert.deepEqual(getStudyNoteAuthView("signed_out", null), {
    canMutate: false,
    mode: "locked",
    message: "Entre com Google para registrar uma nota.",
    showSignIn: true,
  });
});

test("configuração ausente e erro usam mensagens operacionais seguras", () => {
  assert.deepEqual(getStudyNoteAuthView("unconfigured", null), {
    canMutate: false,
    mode: "locked",
    message: "Modo leitura: autenticação não configurada neste ambiente.",
    showSignIn: false,
  });
  assert.deepEqual(getStudyNoteAuthView("error", "user-1"), {
    canMutate: false,
    mode: "locked",
    message: "Não foi possível verificar a sessão. Tente entrar novamente.",
    showSignIn: false,
  });
});

test("sessão autenticada com id libera a nota", () => {
  assert.deepEqual(getStudyNoteAuthView("authenticated", "user-1"), {
    canMutate: true,
    mode: "ready",
    message: "",
    showSignIn: false,
  });

  assert.equal(getStudyNoteAuthView("authenticated", "").canMutate, false);
});
