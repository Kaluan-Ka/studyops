import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEvidenceInsert,
  buildProgressUpsert,
  getMissionProgressStatusLabel,
  isMissionProgressStatus,
} from "../src/lib/missionProgress";

test("aceita apenas status editaveis pela UI", () => {
  assert.equal(isMissionProgressStatus("in_progress"), true);
  assert.equal(isMissionProgressStatus("blocked"), true);
  assert.equal(isMissionProgressStatus("completed"), true);
  assert.equal(isMissionProgressStatus("not_started"), false);
  assert.equal(isMissionProgressStatus("skipped"), false);
  assert.equal(isMissionProgressStatus("a_fazer"), false);
});

test("monta payload de progresso com content_id opaco de tarefa", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "in_progress",
    currentStartedAt: null,
  }, "2026-08-01T12:00:00.000Z");

  assert.deepEqual(payload, {
    user_id: "00000000-0000-0000-0000-000000000001",
    content_id: "TASK-000037",
    status: "in_progress",
    started_at: "2026-08-01T12:00:00.000Z",
    completed_at: null,
  });
});

test("rejeita content_id que nao seja tarefa opaca", () => {
  assert.throws(
    () => buildProgressUpsert({
      userId: "00000000-0000-0000-0000-000000000001",
      contentId: "desenhar-contrato-request-response",
      nextStatus: "in_progress",
      currentStartedAt: null,
    }),
    /content_id de tarefa invalido/i,
  );
});

test("preserva started_at existente e preenche completed_at ao concluir", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "completed",
    currentStartedAt: "2026-07-31T10:00:00.000Z",
  }, "2026-08-01T12:00:00.000Z");

  assert.equal(payload.started_at, "2026-07-31T10:00:00.000Z");
  assert.equal(payload.completed_at, "2026-08-01T12:00:00.000Z");
});

test("limpa completed_at quando a missao volta para bloqueada", () => {
  const payload = buildProgressUpsert({
    userId: "00000000-0000-0000-0000-000000000001",
    contentId: "TASK-000037",
    nextStatus: "blocked",
    currentStartedAt: "2026-07-31T10:00:00.000Z",
  }, "2026-08-01T12:00:00.000Z");

  assert.equal(payload.started_at, "2026-07-31T10:00:00.000Z");
  assert.equal(payload.completed_at, null);
});

test("monta evidencia com titulo e corpo reais", () => {
  const payload = buildEvidenceInsert({
    userId: "00000000-0000-0000-0000-000000000001",
    progressId: "10000000-0000-0000-0000-000000000001",
    evidenceType: "note",
    title: "Contrato desenhado",
    body: "Tabela request response criada no README.",
    artifactUrl: "",
    artifactPath: "",
  });

  assert.deepEqual(payload, {
    user_id: "00000000-0000-0000-0000-000000000001",
    progress_id: "10000000-0000-0000-0000-000000000001",
    evidence_type: "note",
    title: "Contrato desenhado",
    body: "Tabela request response criada no README.",
    artifact_url: null,
    artifact_path: null,
  });
});

test("rejeita evidencia sem titulo ou sem payload", () => {
  assert.throws(
    () => buildEvidenceInsert({
      userId: "00000000-0000-0000-0000-000000000001",
      progressId: "10000000-0000-0000-0000-000000000001",
      evidenceType: "note",
      title: "",
      body: "resultado",
      artifactUrl: "",
      artifactPath: "",
    }),
    /titulo da evidencia/i,
  );

  assert.throws(
    () => buildEvidenceInsert({
      userId: "00000000-0000-0000-0000-000000000001",
      progressId: "10000000-0000-0000-0000-000000000001",
      evidenceType: "note",
      title: "Contrato",
      body: "",
      artifactUrl: "",
      artifactPath: "",
    }),
    /payload real/i,
  );
});

test("traduz status persistido para texto operacional", () => {
  assert.equal(getMissionProgressStatusLabel(null), "Sem progresso persistido");
  assert.equal(getMissionProgressStatusLabel("in_progress"), "Em execucao");
  assert.equal(getMissionProgressStatusLabel("blocked"), "Bloqueada");
  assert.equal(getMissionProgressStatusLabel("completed"), "Concluida com evidencia");
});
