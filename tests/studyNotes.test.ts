import assert from "node:assert/strict";
import test from "node:test";

import {
  buildStudyNoteTarget,
  buildStudyNoteUpsert,
  getLegacyNoteKey,
  removeLegacyNote,
} from "../src/lib/studyNotes";
import { emptyNotes, readNote, writeNote } from "../src/lib/notes";

test("monta targets estáveis para tarefa, fundamento e sessão", () => {
  assert.deepEqual(
    buildStudyNoteTarget({
      scope: "task",
      fundamentId: "FUN-000006",
      taskId: "TASK-000034",
    }),
    { target_type: "task", target_key: "TASK-000034" },
  );
  assert.deepEqual(
    buildStudyNoteTarget({ scope: "fundament", fundamentId: "FUN-000006" }),
    { target_type: "fundament", target_key: "FUN-000006" },
  );
  assert.deepEqual(
    buildStudyNoteTarget({
      scope: "task-session",
      taskId: "TASK-000034",
      sessionSlug: "casos-de-teste",
    }),
    { target_type: "session", target_key: "task/TASK-000034/session/casos-de-teste" },
  );
});

test("normaliza o corpo e mantém o isolamento pelo UUID do usuário no upsert", () => {
  const target = { scope: "fundament" as const, fundamentId: "FUN-000006" };

  assert.deepEqual(
    buildStudyNoteUpsert({ userId: "c83b9c64-6a53-47db-a216-52c8c5282b54", target, body: "  Teste concluído.  " }),
    {
      user_id: "c83b9c64-6a53-47db-a216-52c8c5282b54",
      target_type: "fundament",
      target_key: "FUN-000006",
      body: "Teste concluído.",
    },
  );
  assert.throws(
    () => buildStudyNoteUpsert({ userId: "4c5eaa4c-2f2f-48b1-a92b-0e7a33f9b541", target, body: "   " }),
    /não pode estar vazia/i,
  );
});

test("localiza e remove somente a nota legada correspondente", () => {
  const target = {
    scope: "fundament-session" as const,
      fundamentSlug: "cli-para-ferramentas",
      sessionSlug: "modelo-mental",
  };
  const legacyKey = getLegacyNoteKey(target);
  const stored = writeNote(emptyNotes(), legacyKey, "Registro local", "2026-08-07T12:00:00.000Z");
  const next = removeLegacyNote(stored, target);

  assert.equal(readNote(stored, legacyKey)?.text, "Registro local");
  assert.equal(readNote(next, legacyKey), undefined);
});
