import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export type ContentSection = {
  title: string;
  slug: string;
  order: number;
  markdown: string;
};

export type ExternalSource = {
  label: string;
  url: string;
};

export type ParsedMarkdown = {
  intro: string;
  sections: ContentSection[];
};

export type Task = {
  id: string;
  fundamentId: string;
  stepId: string;
  title: string;
  slug: string;
  status: string;
  order: number;
  goal: string;
  expectedEvidence: string[];
  intro: string;
  sections: ContentSection[];
};

export type Step = {
  id: string;
  title: string;
  slug: string;
  order: number;
  expectedEvidence: string[];
  tasks: Task[];
};

export type Fundament = {
  id: string;
  title: string;
  slug: string;
  status: string;
  order: number;
  summary: string;
  intro: string;
  sections: ContentSection[];
  steps: Step[];
  tasks: Task[];
};

const contentRoot = path.join(process.cwd(), "content");

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitIntoSections(markdown: string): ParsedMarkdown {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const introLines: string[] = [];
  const sections: ContentSection[] = [];
  const usedSlugs = new Map<string, number>();
  let current: { title: string; lines: string[] } | null = null;
  let fenced = false;

  const pushCurrent = (): void => {
    if (!current) {
      return;
    }

    const baseSlug = slugify(current.title) || `sessao-${sections.length + 1}`;
    const occurrence = (usedSlugs.get(baseSlug) ?? 0) + 1;
    usedSlugs.set(baseSlug, occurrence);
    const sectionSlug = occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`;

    sections.push({
      title: current.title,
      slug: sectionSlug,
      order: sections.length + 1,
      markdown: current.lines.join("\n").trim(),
    });
  };

  for (const line of lines) {
    const heading = !fenced ? line.match(/^##\s+(.+?)\s*$/) : null;

    if (heading) {
      pushCurrent();
      current = { title: heading[1], lines: [] };
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else {
      introLines.push(line);
    }

    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
    }
  }

  pushCurrent();

  return {
    intro: introLines
      .filter((line) => !/^#\s+/.test(line))
      .join("\n")
      .trim(),
    sections,
  };
}

export function getExternalSources(sections: ContentSection[]): ExternalSource[] {
  const sources = new Map<string, ExternalSource>();
  const markdownLink = /\[([^\]]*)\]\((https:\/\/github\.com\/[^)\s]+)\)/g;

  for (const section of sections) {
    for (const match of section.markdown.matchAll(markdownLink)) {
      const url = match[2];

      if (!sources.has(url)) {
        sources.set(url, { label: match[1].trim() || url, url });
      }
    }
  }

  return [...sources.values()];
}

export function getFundamentos(): Fundament[] {
  return readFundamentRecords()
    .map((record) => buildFundament(record))
    .sort((left, right) => left.order - right.order);
}

export function getFundamentBySlug(slug: string): Fundament | undefined {
  return getFundamentos().find((fundament) => fundament.slug === slug);
}

export function getStepBySlug(
  fundamentSlug: string,
  stepSlug: string,
): { fundament: Fundament; step: Step } | undefined {
  const fundament = getFundamentBySlug(fundamentSlug);
  const step = fundament?.steps.find((item) => item.slug === stepSlug);

  return fundament && step ? { fundament, step } : undefined;
}

export function getTaskBySlug(
  taskSlug: string,
  fundamentSlug?: string,
): Task & { fundament: Fundament } {
  const fundamentos = fundamentSlug
    ? [getFundamentBySlug(fundamentSlug)].filter((item): item is Fundament => Boolean(item))
    : getFundamentos();
  const matches = fundamentos.flatMap((fundament) =>
    fundament.tasks
      .filter((task) => task.slug === taskSlug)
      .map((task) => ({ ...task, fundament })),
  );

  if (matches.length !== 1) {
    throw new Error(`Tarefa não encontrada ou ambígua: ${taskSlug}`);
  }

  return matches[0];
}

type FundamentRecord = {
  filePath: string;
  data: Record<string, unknown>;
  parsed: ParsedMarkdown;
};

function readFundamentRecords(): FundamentRecord[] {
  const directory = path.join(contentRoot, "fundamentos");

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(directory, fileName);
      const parsedFile = matter(fs.readFileSync(filePath, "utf8"));

      return {
        filePath,
        data: parsedFile.data as Record<string, unknown>,
        parsed: splitIntoSections(parsedFile.content),
      };
    });
}

function buildFundament(record: FundamentRecord): Fundament {
  const data = record.data;
  const fundamentId = requiredString(data, "id", record.filePath);
  const fundamentSlug = requiredString(data, "slug", record.filePath);
  const rawSteps = requiredArray(data, "steps", record.filePath);
  const tasks = readTasks(fundamentSlug, fundamentId);
  const steps = rawSteps
    .map((rawStep, index) => {
      const step = asRecord(rawStep, `${record.filePath}: steps[${index}]`);
      const stepId = requiredString(step, "id", record.filePath);
      const stepTitle = requiredString(step, "title", record.filePath);

      return {
        id: stepId,
        title: stepTitle,
        slug: slugify(stepTitle),
        order: requiredNumber(step, "order", record.filePath),
        expectedEvidence: stringArray(step.expected_evidence),
        tasks: tasks
          .filter((task) => task.stepId === stepId)
          .sort((left, right) => left.order - right.order),
      } satisfies Step;
    })
    .sort((left, right) => left.order - right.order);

  return {
    id: fundamentId,
    title: requiredString(data, "title", record.filePath),
    slug: fundamentSlug,
    status: requiredString(data, "status", record.filePath),
    order: requiredNumber(data, "order", record.filePath),
    summary: requiredString(data, "summary", record.filePath),
    intro: record.parsed.intro,
    sections: record.parsed.sections,
    steps,
    tasks: tasks.sort((left, right) => left.order - right.order),
  };
}

function readTasks(fundamentSlug: string, fundamentId: string): Task[] {
  const directory = path.join(contentRoot, "tasks", fundamentSlug);

  if (!fs.existsSync(directory)) {
    throw new Error(`Diretório de tarefas não encontrado: ${directory}`);
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(directory, fileName);
      const parsedFile = matter(fs.readFileSync(filePath, "utf8"));
      const data = parsedFile.data as Record<string, unknown>;

      if (requiredString(data, "fundamento_id", filePath) !== fundamentId) {
        throw new Error(`Tarefa aponta para fundamento incorreto: ${filePath}`);
      }

      const parsed = splitIntoSections(parsedFile.content);

      return {
        id: requiredString(data, "id", filePath),
        fundamentId,
        stepId: requiredString(data, "etapa_id", filePath),
        title: requiredString(data, "title", filePath),
        slug: requiredString(data, "slug", filePath),
        status: requiredString(data, "status", filePath),
        order: requiredNumber(data, "order", filePath),
        goal: requiredString(data, "goal", filePath),
        expectedEvidence: stringArray(data.expected_evidence),
        intro: parsed.intro,
        sections: parsed.sections,
      } satisfies Task;
    });
}

function requiredString(
  data: Record<string, unknown>,
  key: string,
  filePath: string,
): string {
  const value = data[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Campo ${key} inválido em ${filePath}`);
  }

  return value;
}

function requiredNumber(
  data: Record<string, unknown>,
  key: string,
  filePath: string,
): number {
  const value = data[key];

  if (typeof value !== "number") {
    throw new Error(`Campo ${key} inválido em ${filePath}`);
  }

  return value;
}

function requiredArray(
  data: Record<string, unknown>,
  key: string,
  filePath: string,
): unknown[] {
  const value = data[key];

  if (!Array.isArray(value)) {
    throw new Error(`Campo ${key} inválido em ${filePath}`);
  }

  return value;
}

function asRecord(value: unknown, context: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Objeto inválido em ${context}`);
  }

  return value as Record<string, unknown>;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
