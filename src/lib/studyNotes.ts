import {
  makeNoteKey,
  removeNote,
  type NoteRecord,
  type NoteTarget,
} from "./notes";

export type StableStudyNoteTarget =
  | { scope: "task"; fundamentId: string; taskId: string }
  | { scope: "fundament"; fundamentId: string }
  | { scope: "task-session"; taskId: string; sessionSlug: string }
  | { scope: "fundament-session"; fundamentId: string; sessionSlug: string };

export type StudyNoteTargetPayload = {
  target_type: "task" | "fundament" | "session";
  target_key: string;
};

export type StudyNoteUpsert = StudyNoteTargetPayload & {
  user_id: string;
  body: string;
};

export function buildStudyNoteTarget(target: StableStudyNoteTarget): StudyNoteTargetPayload {
  if (target.scope === "task") {
    return {
      target_type: "task",
      target_key: requireId(target.taskId, "tarefa"),
    };
  }

  if (target.scope === "fundament") {
    return {
      target_type: "fundament",
      target_key: requireId(target.fundamentId, "fundamento"),
    };
  }

  const sessionSlug = requirePart(target.sessionSlug, "sessão");

  if (target.scope === "task-session") {
    return {
      target_type: "session",
      target_key: `task/${requireId(target.taskId, "tarefa")}/session/${sessionSlug}`,
    };
  }

  return {
    target_type: "session",
    target_key: `fundament/${requireId(target.fundamentId, "fundamento")}/session/${sessionSlug}`,
  };
}

export function buildStudyNoteUpsert(input: {
  userId: string;
  target: StableStudyNoteTarget;
  body: string;
}): StudyNoteUpsert {
  const userId = requirePart(input.userId, "usuário");
  const body = input.body.trim();

  if (!body) {
    throw new Error("nota não pode estar vazia");
  }

  return {
    user_id: userId,
    ...buildStudyNoteTarget(input.target),
    body,
  };
}

export function getLegacyNoteKey(target: NoteTarget): string {
  return makeNoteKey(target);
}

export function removeLegacyNote(record: NoteRecord, target: NoteTarget): NoteRecord {
  return removeNote(record, getLegacyNoteKey(target));
}

function requireId(value: string, label: string): string {
  const normalized = requirePart(value, label);

  if (!/^(FUN|TASK)-\d{6}$/.test(normalized)) {
    throw new Error(`${label} inválido`);
  }

  return normalized;
}

function requirePart(value: string, label: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} obrigatório`);
  }

  return normalized;
}
