export type PortfolioProjectProgressStatus = "planned" | "in_progress" | "paused" | "completed";

export type PortfolioProjectProgressRow = {
  id: string;
  user_id: string;
  project_id: string;
  status: PortfolioProjectProgressStatus;
  objective: string | null;
  notes: string | null;
  next_step: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioProjectProgressUpsert = {
  user_id: string;
  project_id: string;
  status: PortfolioProjectProgressStatus;
  objective: string | null;
  notes: string | null;
  next_step: string | null;
};

const projectIdPattern = /^PROJ-[0-9]{6}$/;
const statuses = new Set<string>(["planned", "in_progress", "paused", "completed"]);

export function isPortfolioProjectProgressStatus(value: string): value is PortfolioProjectProgressStatus {
  return statuses.has(value);
}

export function getPortfolioProjectProgressStatusLabel(status: PortfolioProjectProgressStatus): string {
  return {
    planned: "Planejado",
    in_progress: "Em andamento",
    paused: "Pausado",
    completed: "Concluído",
  }[status];
}

export function buildPortfolioProjectProgressUpsert(input: {
  userId: string;
  projectId: string;
  status: PortfolioProjectProgressStatus;
  objective?: string | null;
  notes?: string | null;
  nextStep?: string | null;
}): PortfolioProjectProgressUpsert {
  const userId = required(input.userId, "usuário");
  const projectId = required(input.projectId, "projeto");

  if (!projectIdPattern.test(projectId)) throw new Error("project_id inválido");
  if (!isPortfolioProjectProgressStatus(input.status)) throw new Error("status de projeto inválido");

  return {
    user_id: userId,
    project_id: projectId,
    status: input.status,
    objective: optional(input.objective),
    notes: optional(input.notes),
    next_step: optional(input.nextStep),
  };
}

function required(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} obrigatório`);
  return normalized;
}

function optional(value: string | null | undefined): string | null {
  if (value == null) return null;
  const normalized = value.trim();
  return normalized || null;
}
