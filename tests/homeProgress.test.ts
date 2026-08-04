import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHomeProgressSummary,
  type HomeEvidenceRow,
  type HomeProgressRow,
} from "../src/lib/homeProgress";

const missionIds = ["TASK-000001", "TASK-000002", "TASK-000003"];

test("resume progresso real persistido da home a partir das linhas do usuario", () => {
  const progressRows: HomeProgressRow[] = [
    {
      id: "progress-1",
      content_id: "TASK-000001",
      status: "completed",
      started_at: "2026-08-01T10:00:00.000Z",
      completed_at: "2026-08-02T10:00:00.000Z",
      updated_at: "2026-08-02T10:00:00.000Z",
    },
    {
      id: "progress-2",
      content_id: "TASK-000002",
      status: "blocked",
      started_at: "2026-08-03T10:00:00.000Z",
      completed_at: null,
      updated_at: "2026-08-03T10:00:00.000Z",
    },
  ];
  const evidenceRows: HomeEvidenceRow[] = [
    {
      id: "evidence-1",
      title: "README com contrato request response",
      evidence_type: "readme",
      produced_at: "2026-08-02T11:00:00.000Z",
    },
    {
      id: "evidence-2",
      title: "Teste automatizado da CLI",
      evidence_type: "test",
      produced_at: "2026-08-01T11:00:00.000Z",
    },
  ];

  const summary = buildHomeProgressSummary({ missionIds, progressRows, evidenceRows });

  assert.equal(summary.state, "ready");
  assert.equal(summary.persistedMissionCount, 2);
  assert.equal(summary.completedMissionCount, 1);
  assert.equal(summary.evidenceCount, 2);
  assert.equal(summary.progressPercentage, 33);
  assert.equal(summary.statusLabel, "1 de 3 missões concluídas");
  assert.equal(summary.inventoryLabel, "2 missões com progresso · 2 evidências reais");
  assert.deepEqual(summary.recentEvidence.map((evidence) => evidence.title), [
    "README com contrato request response",
    "Teste automatizado da CLI",
  ]);
});

test("nao cria barra quando nao ha dados persistidos", () => {
  const summary = buildHomeProgressSummary({
    missionIds,
    progressRows: [],
    evidenceRows: [],
  });

  assert.equal(summary.state, "empty");
  assert.equal(summary.progressPercentage, null);
  assert.equal(summary.statusLabel, "Sem progresso persistido");
  assert.equal(summary.inventoryLabel, "3 missões públicas no mapa");
});
