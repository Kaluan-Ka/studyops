export type MissionProgressStatus = "in_progress" | "blocked" | "completed";

export type MissionEvidenceType =
  | "note"
  | "commit"
  | "link"
  | "screenshot"
  | "readme"
  | "test"
  | "benchmark"
  | "comparison"
  | "decision"
  | "implementation"
  | "file"
  | "other";

export type BuildProgressUpsertInput = {
  userId: string;
  contentId: string;
  nextStatus: MissionProgressStatus;
  currentStartedAt?: string | null;
};

export type MissionProgressUpsert = {
  user_id: string;
  content_id: string;
  status: MissionProgressStatus;
  started_at: string | null;
  completed_at: string | null;
};

export type BuildEvidenceInsertInput = {
  userId: string;
  progressId: string;
  evidenceType: MissionEvidenceType;
  title: string;
  body: string;
  artifactUrl: string;
  artifactPath: string;
};

export type MissionEvidenceInsert = {
  user_id: string;
  progress_id: string;
  evidence_type: MissionEvidenceType;
  title: string;
  body: string | null;
  artifact_url: string | null;
  artifact_path: string | null;
};

const taskContentId = /^TASK-[0-9]{6}$/;
const missionProgressStatuses = new Set<string>([
  "in_progress",
  "blocked",
  "completed",
]);

export function isMissionProgressStatus(value: string): value is MissionProgressStatus {
  return missionProgressStatuses.has(value);
}

export function getMissionProgressStatusLabel(status?: MissionProgressStatus | null): string {
  if (status === "in_progress") {
    return "Em execucao";
  }

  if (status === "blocked") {
    return "Bloqueada";
  }

  if (status === "completed") {
    return "Concluida com evidencia";
  }

  return "Sem progresso persistido";
}

export function buildProgressUpsert(
  input: BuildProgressUpsertInput,
  now = new Date().toISOString(),
): MissionProgressUpsert {
  if (!taskContentId.test(input.contentId)) {
    throw new Error("content_id de tarefa invalido");
  }

  const startedAt = input.currentStartedAt ?? now;

  return {
    user_id: input.userId,
    content_id: input.contentId,
    status: input.nextStatus,
    started_at: startedAt,
    completed_at: input.nextStatus === "completed" ? now : null,
  };
}

export function buildEvidenceInsert(input: BuildEvidenceInsertInput): MissionEvidenceInsert {
  const title = input.title.trim();
  const body = normalizeOptionalText(input.body);
  const artifactUrl = normalizeOptionalText(input.artifactUrl);
  const artifactPath = normalizeOptionalText(input.artifactPath);

  if (!title) {
    throw new Error("titulo da evidencia obrigatorio");
  }

  if (!body && !artifactUrl && !artifactPath) {
    throw new Error("evidencia precisa de payload real");
  }

  return {
    user_id: input.userId,
    progress_id: input.progressId,
    evidence_type: input.evidenceType,
    title,
    body,
    artifact_url: artifactUrl,
    artifact_path: artifactPath,
  };
}

function normalizeOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
