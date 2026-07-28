import assert from "node:assert/strict";
import test from "node:test";

import {
  emptyNotes,
  makeNoteKey,
  parseStoredNotes,
  readNote,
  serializeStoredNotes,
  writeNote,
} from "../src/lib/notes";

test("monta chaves estaveis e distintas para tarefa e sessoes", () => {
  const fundamentSession = makeNoteKey({
    scope: "fundament-session",
    fundamentSlug: "cli-para-ferramentas",
    sessionSlug: "modelo-mental",
  });
  const taskSession = makeNoteKey({
    scope: "task-session",
    fundamentSlug: "cli-para-ferramentas",
    taskSlug: "testar-argumento-invalido",
    sessionSlug: "casos-de-teste",
  });
  const task = makeNoteKey({
    scope: "task",
    fundamentSlug: "cli-para-ferramentas",
    taskSlug: "testar-argumento-invalido",
  });

  assert.equal(fundamentSession, "session:fundamento/cli-para-ferramentas/modelo-mental");
  assert.equal(taskSession, "session:tarefa/cli-para-ferramentas/testar-argumento-invalido/casos-de-teste");
  assert.equal(task, "task:cli-para-ferramentas/testar-argumento-invalido");
  assert.notEqual(fundamentSession, taskSession);
  assert.notEqual(taskSession, task);
});

test("serializa e restaura o payload versionado de anotacoes", () => {
  const stored = writeNote(emptyNotes(), "task:cli/demo", "Uma observacao", "2026-07-27T12:00:00.000Z");

  const restored = parseStoredNotes(serializeStoredNotes(stored));

  assert.deepEqual(readNote(restored, "task:cli/demo"), {
    text: "Uma observacao",
    updatedAt: "2026-07-27T12:00:00.000Z",
  });
});

test("ignora JSON invalido e formatos incompatíveis", () => {
  assert.deepEqual(parseStoredNotes("nao e json"), emptyNotes());
  assert.deepEqual(parseStoredNotes(JSON.stringify({ version: 2, notes: {} })), emptyNotes());
  assert.deepEqual(parseStoredNotes(JSON.stringify({ version: 1, notes: { broken: 42 } })), emptyNotes());
});

test("isola a leitura por chave", () => {
  const stored = writeNote(emptyNotes(), "session:fundamento/cli/a", "Nota A", "2026-07-27T12:00:00.000Z");
  const next = writeNote(stored, "session:tarefa/cli/tarefa/b", "Nota B", "2026-07-27T12:01:00.000Z");

  assert.equal(readNote(next, "session:fundamento/cli/a")?.text, "Nota A");
  assert.equal(readNote(next, "session:tarefa/cli/tarefa/b")?.text, "Nota B");
  assert.equal(readNote(next, "session:fundamento/cli/outra"), undefined);
});
