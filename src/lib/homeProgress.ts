import type { MissionEvidenceType, MissionProgressStatus } from "./missionProgress";

export type HomeProgressRow = {
  id: string;
  content_id: string;
  status: MissionProgressStatus | "not_started" | "skipped";
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type HomeEvidenceRow = {
  id: string;
  title: string;
  evidence_type: MissionEvidenceType;
  produced_at: string;
};

export type HomeProgressSummary = {
  state: "empty" | "ready";
  persistedMissionCount: number;
  completedMissionCount: number;
  evidenceCount: number;
  progressPercentage: number | null;
  statusLabel: string;
  inventoryLabel: string;
  recentEvidence: HomeEvidenceRow[];
};

type BuildHomeProgressSummaryInput = {
  missionIds: string[];
  progressRows: HomeProgressRow[];
  evidenceRows: HomeEvidenceRow[];
};

export function buildHomeProgressSummary({
  missionIds,
  progressRows,
  evidenceRows,
}: BuildHomeProgressSummaryInput): HomeProgressSummary {
  const missionIdSet = new Set(missionIds);
  const visibleProgressRows = progressRows.filter((row) => missionIdSet.has(row.content_id));
  const persistedMissionCount = visibleProgressRows.length;
  const completedMissionCount = visibleProgressRows.filter(
    (row) => row.status === "completed",
  ).length;
  const evidenceCount = evidenceRows.length;
  const hasPersistedData = persistedMissionCount > 0 || evidenceCount > 0;
  const progressPercentage = hasPersistedData && missionIds.length > 0
    ? Math.round((completedMissionCount / missionIds.length) * 100)
    : null;

  return {
    state: hasPersistedData ? "ready" : "empty",
    persistedMissionCount,
    completedMissionCount,
    evidenceCount,
    progressPercentage,
    statusLabel: hasPersistedData
      ? `${completedMissionCount} de ${missionIds.length} ${pluralizeMission(missionIds.length)} concluídas`
      : "Sem progresso persistido",
    inventoryLabel: hasPersistedData
      ? `${persistedMissionCount} ${pluralizeMission(persistedMissionCount)} com progresso · ${evidenceCount} ${pluralizeEvidence(evidenceCount)} reais`
      : `${missionIds.length} ${pluralizeMission(missionIds.length)} públicas no mapa`,
    recentEvidence: [...evidenceRows]
      .sort((left, right) => right.produced_at.localeCompare(left.produced_at))
      .slice(0, 3),
  };
}

function pluralizeMission(count: number): string {
  return count === 1 ? "missão" : "missões";
}

function pluralizeEvidence(count: number): string {
  return count === 1 ? "evidência" : "evidências";
}
