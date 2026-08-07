import assert from "node:assert/strict";
import test from "node:test";

import {
  buildStudyCycleInsert,
  buildStudyCycleTaskInsert,
  buildStudyCycleUpdate,
  getStudyCycleStatusLabel,
  isStudyCycleStatus,
} from "../src/lib/studyCycles";

const userId = "00000000-0000-0000-0000-000000000001";
const cycleId = "10000000-0000-0000-0000-000000000001";

test("aceita somente status de ciclo suportados", () => {
  assert.equal(isStudyCycleStatus("planned"), true);
  assert.equal(isStudyCycleStatus("active"), true);
  assert.equal(isStudyCycleStatus("completed"), true);
  assert.equal(isStudyCycleStatus("cancelled"), true);
  assert.equal(isStudyCycleStatus("in_progress"), false);
});

test("monta ciclo novo com objetivo normalizado e status planejado", () => {
  assert.deepEqual(buildStudyCycleInsert({
    userId,
    startsOn: "2026-08-03",
    endsOn: "2026-08-09",
    objective: "  Implementar o primeiro ciclo  ",
  }), {
    user_id: userId,
    starts_on: "2026-08-03",
    ends_on: "2026-08-09",
    objective: "Implementar o primeiro ciclo",
    status: "planned",
    review: null,
    next_step: null,
    reviewed_at: null,
    completed_at: null,
  });
});

test("rejeita ciclo sem objetivo, com data inválida ou período invertido", () => {
  assert.throws(
    () => buildStudyCycleInsert({
      userId,
      startsOn: "2026-08-03",
      endsOn: "2026-08-09",
      objective: "   ",
    }),
    /objetivo/i,
  );

  assert.throws(
    () => buildStudyCycleInsert({
      userId,
      startsOn: "2026-08-10",
      endsOn: "2026-08-09",
      objective: "Objetivo",
    }),
    /período/i,
  );

  assert.throws(
    () => buildStudyCycleInsert({
      userId,
      startsOn: "2026-02-31",
      endsOn: "2026-03-07",
      objective: "Objetivo",
    }),
    /data/i,
  );
});

test("monta atualização com revisão e próximo passo opcionais normalizados", () => {
  assert.deepEqual(buildStudyCycleUpdate({
    startsOn: "2026-08-03",
    endsOn: "2026-08-09",
    objective: " Objetivo revisado ",
    status: "completed",
    review: "  O teste passou  ",
    nextStep: "  Adicionar evidência  ",
    reviewedAt: "2026-08-09T18:00:00.000Z",
    completedAt: "2026-08-09T18:00:00.000Z",
  }), {
    starts_on: "2026-08-03",
    ends_on: "2026-08-09",
    objective: "Objetivo revisado",
    status: "completed",
    review: "O teste passou",
    next_step: "Adicionar evidência",
    reviewed_at: "2026-08-09T18:00:00.000Z",
    completed_at: "2026-08-09T18:00:00.000Z",
  });
});

test("monta tarefa associada ao ciclo com nota planejada", () => {
  assert.deepEqual(buildStudyCycleTaskInsert({
    userId,
    cycleId,
    contentId: "TASK-000037",
    position: 1,
    plannedNote: "  Implementar e testar  ",
  }), {
    user_id: userId,
    cycle_id: cycleId,
    content_id: "TASK-000037",
    position: 1,
    planned_note: "Implementar e testar",
  });
});

test("rejeita tarefa sem ids, content_id válido ou posição positiva", () => {
  assert.throws(
    () => buildStudyCycleTaskInsert({
      userId: "",
      cycleId,
      contentId: "TASK-000037",
      position: 1,
      plannedNote: "",
    }),
    /usuário/i,
  );

  assert.throws(
    () => buildStudyCycleTaskInsert({
      userId,
      cycleId,
      contentId: "task-37",
      position: 1,
      plannedNote: "",
    }),
    /content_id/i,
  );

  assert.throws(
    () => buildStudyCycleTaskInsert({
      userId,
      cycleId,
      contentId: "TASK-000037",
      position: 0,
      plannedNote: "",
    }),
    /posição/i,
  );
});

test("traduz status de ciclo para texto operacional", () => {
  assert.equal(getStudyCycleStatusLabel("planned"), "Planejado");
  assert.equal(getStudyCycleStatusLabel("active"), "Em andamento");
  assert.equal(getStudyCycleStatusLabel("completed"), "Concluído");
  assert.equal(getStudyCycleStatusLabel("cancelled"), "Cancelado");
});
