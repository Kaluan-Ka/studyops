export const NOTES_VERSION = 1 as const;

export type NoteEntry = {
  text: string;
  updatedAt: string;
};

export type NoteRecord = {
  version: typeof NOTES_VERSION;
  notes: Record<string, NoteEntry>;
};

type FundamentSessionTarget = {
  scope: "fundament-session";
  fundamentSlug: string;
  sessionSlug: string;
};

type TaskSessionTarget = {
  scope: "task-session";
  fundamentSlug: string;
  taskSlug: string;
  sessionSlug: string;
};

type TaskTarget = {
  scope: "task";
  fundamentSlug: string;
  taskSlug: string;
};

export type NoteTarget = FundamentSessionTarget | TaskSessionTarget | TaskTarget;

export function emptyNotes(): NoteRecord {
  return {
    version: NOTES_VERSION,
    notes: {},
  };
}

export function makeNoteKey(target: NoteTarget): string {
  if (target.scope === "fundament-session") {
    return `session:fundamento/${part(target.fundamentSlug)}/${part(target.sessionSlug)}`;
  }

  if (target.scope === "task-session") {
    return `session:tarefa/${part(target.fundamentSlug)}/${part(target.taskSlug)}/${part(target.sessionSlug)}`;
  }

  return `task:${part(target.fundamentSlug)}/${part(target.taskSlug)}`;
}

export function parseStoredNotes(raw: string | null): NoteRecord {
  if (!raw) {
    return emptyNotes();
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || parsed.version !== NOTES_VERSION || !isRecord(parsed.notes)) {
      return emptyNotes();
    }

    const notes: Record<string, NoteEntry> = {};

    for (const [key, value] of Object.entries(parsed.notes)) {
      if (isNoteEntry(value)) {
        notes[key] = value;
      }
    }

    return { version: NOTES_VERSION, notes };
  } catch {
    return emptyNotes();
  }
}

export function serializeStoredNotes(record: NoteRecord): string {
  return JSON.stringify(record);
}

export function readNote(record: NoteRecord, key: string): NoteEntry | undefined {
  return record.notes[key];
}

export function writeNote(
  record: NoteRecord,
  key: string,
  text: string,
  updatedAt = new Date().toISOString(),
): NoteRecord {
  return {
    version: NOTES_VERSION,
    notes: {
      ...record.notes,
      [key]: { text, updatedAt },
    },
  };
}

export function removeNote(record: NoteRecord, key: string): NoteRecord {
  const notes = { ...record.notes };
  delete notes[key];

  return {
    version: NOTES_VERSION,
    notes,
  };
}

function part(value: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("A chave da anotação exige partes não vazias");
  }

  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNoteEntry(value: unknown): value is NoteEntry {
  return (
    isRecord(value) &&
    typeof value.text === "string" &&
    typeof value.updatedAt === "string" &&
    value.updatedAt.length > 0
  );
}
