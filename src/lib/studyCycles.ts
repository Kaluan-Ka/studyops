export type StudyCycleStatus = "planned" | "active" | "completed" | "cancelled";

export type StudyCycleTaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed"
  | "skipped";

export type BuildStudyCycleInsertInput = {
  userId: string;
  startsOn: string;
  endsOn: string;
  objective: string;
  status?: StudyCycleStatus;
};

export type BuildStudyCycleUpdateInput = {
  startsOn: string;
  endsOn: string;
  objective: string;
  status: StudyCycleStatus;
  review: string | null | undefined;
  nextStep: string | null | undefined;
  reviewedAt: string | null | undefined;
  completedAt: string | null | undefined;
};

export type BuildStudyCycleTaskInsertInput = {
  userId: string;
  cycleId: string;
  contentId: string;
  position: number;
  plannedNote: string | null | undefined;
};

export type StudyCycleInsert = {
  user_id: string;
  starts_on: string;
  ends_on: string;
  objective: string;
  status: StudyCycleStatus;
  review: null;
  next_step: null;
  reviewed_at: null;
  completed_at: null;
};

export type StudyCycleUpdate = {
  starts_on: string;
  ends_on: string;
  objective: string;
  status: StudyCycleStatus;
  review: string | null;
  next_step: string | null;
  reviewed_at: string | null;
  completed_at: string | null;
};

export type StudyCycleTaskInsert = {
  user_id: string;
  cycle_id: string;
  content_id: string;
  position: number;
  planned_note: string | null;
};

const contentIdPattern = /^TASK-[0-9]{6}$/;
const studyCycleStatuses = new Set<string>([
  "planned",
  "active",
  "completed",
  "cancelled",
]);

export function isStudyCycleStatus(value: string): value is StudyCycleStatus {
  return studyCycleStatuses.has(value);
}

export function getStudyCycleStatusLabel(status: StudyCycleStatus): string {
  if (status === "planned") {
    return "Planejado";
  }

  if (status === "active") {
    return "Em andamento";
  }

  if (status === "completed") {
    return "Concluído";
  }

  return "Cancelado";
}

export function buildStudyCycleInsert(input: BuildStudyCycleInsertInput): StudyCycleInsert {
  const userId = requireNonEmpty(input.userId, "usuário");
  const objective = requireNonEmpty(input.objective, "objetivo");
  const { startsOn, endsOn } = validateDates(input.startsOn, input.endsOn);
  const status = input.status ?? "planned";

  if (!isStudyCycleStatus(status)) {
    throw new Error("status de ciclo inválido");
  }

  return {
    user_id: userId,
    starts_on: startsOn,
    ends_on: endsOn,
    objective,
    status,
    review: null,
    next_step: null,
    reviewed_at: null,
    completed_at: null,
  };
}

export function buildStudyCycleUpdate(input: BuildStudyCycleUpdateInput): StudyCycleUpdate {
  const objective = requireNonEmpty(input.objective, "objetivo");
  const { startsOn, endsOn } = validateDates(input.startsOn, input.endsOn);

  if (!isStudyCycleStatus(input.status)) {
    throw new Error("status de ciclo inválido");
  }

  return {
    starts_on: startsOn,
    ends_on: endsOn,
    objective,
    status: input.status,
    review: normalizeOptionalText(input.review),
    next_step: normalizeOptionalText(input.nextStep),
    reviewed_at: normalizeOptionalText(input.reviewedAt),
    completed_at: normalizeOptionalText(input.completedAt),
  };
}

export function buildStudyCycleTaskInsert(
  input: BuildStudyCycleTaskInsertInput,
): StudyCycleTaskInsert {
  const userId = requireNonEmpty(input.userId, "usuário");
  const cycleId = requireNonEmpty(input.cycleId, "ciclo");
  const contentId = input.contentId.trim();

  if (!contentIdPattern.test(contentId)) {
    throw new Error("content_id de tarefa inválido");
  }

  if (!Number.isInteger(input.position) || input.position < 1 || input.position > 32767) {
    throw new Error("posição da tarefa deve ser um inteiro positivo");
  }

  return {
    user_id: userId,
    cycle_id: cycleId,
    content_id: contentId,
    position: input.position,
    planned_note: normalizeOptionalText(input.plannedNote),
  };
}

function validateDates(startsOnInput: string, endsOnInput: string): {
  startsOn: string;
  endsOn: string;
} {
  const startsOn = startsOnInput.trim();
  const endsOn = endsOnInput.trim();

  if (!isValidDateOnly(startsOn) || !isValidDateOnly(endsOn)) {
    throw new Error("data do ciclo inválida");
  }

  if (endsOn < startsOn) {
    throw new Error("período do ciclo inválido");
  }

  return { startsOn, endsOn };
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function requireNonEmpty(value: string, label: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} obrigatório`);
  }

  return normalized;
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}
