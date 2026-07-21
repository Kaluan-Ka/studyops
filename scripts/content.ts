import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";

type RegistryKey = "fundamentos" | "steps" | "tasks" | "projects" | "evidence";
type Registry = {
  version: number;
  issued: Record<RegistryKey, string[]>;
  deprecated?: Record<string, unknown>;
};

type Fundament = {
  filePath: string;
  id: string;
  slug: string;
  stepIds: Set<string>;
};

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const registryPath = path.join(contentDir, ".registry", "ids.json");

const registryKeys: RegistryKey[] = [
  "fundamentos",
  "steps",
  "tasks",
  "projects",
  "evidence",
];

const prefixes: Record<RegistryKey, string> = {
  fundamentos: "FUN",
  steps: "STEP",
  tasks: "TASK",
  projects: "PROJ",
  evidence: "EVID",
};

const defaultSteps = [
  "Registrar referencia",
  "Explicar com as proprias palavras",
  "Fazer implementacao minima",
  "Aplicar em projeto de portfolio",
  "Produzir teste ou evidencia",
  "Registrar nota do aprendizado",
  "Definir proxima aplicacao ou revisao",
];

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  if (command === "validate") {
    validateContent();
    return;
  }

  if (command === "create") {
    createContent(args);
    return;
  }

  fail([`Comando invalido: ${command ?? "(vazio)"}. Use "validate" ou "create".`]);
}

function validateContent(): void {
  const errors: string[] = [];
  const registry = readRegistry(errors);

  if (!registry) {
    fail(errors);
  }

  validateRegistry(registry, errors);
  const fundamentos = readFundamentos(registry, errors);
  readTasks(registry, fundamentos, errors);
  validateSummaries(errors);

  if (errors.length > 0) {
    fail(errors);
  }

  console.log("Conteudo valido.");
}

function createContent(args: string[]): void {
  const [entity, ...rest] = args;
  const errors: string[] = [];
  const registry = readRegistry(errors);

  if (!registry) {
    fail(errors);
  }

  validateRegistry(registry, errors);

  if (entity === "fundamento") {
    createFundamento(registry, rest, errors);
  } else if (entity === "task") {
    createTask(registry, rest, errors);
  } else {
    errors.push('Entidade invalida. Use "fundamento" ou "task".');
  }

  if (errors.length > 0) {
    fail(errors);
  }
}

function createFundamento(registry: Registry, args: string[], errors: string[]): void {
  const title = args.join(" ").trim();

  if (!title) {
    errors.push('Uso: npm run content:create -- fundamento "Titulo do fundamento"');
    return;
  }

  const slug = slugify(title);
  const filePath = path.join(contentDir, "fundamentos", `${slug}.md`);

  if (fs.existsSync(filePath)) {
    errors.push(`Arquivo ja existe: ${relative(filePath)}`);
    return;
  }

  const id = nextId(registry, "fundamentos");
  const steps = defaultSteps.map((stepTitle, index) => ({
    id: nextId(registry, "steps", index),
    title: stepTitle,
    order: index + 1,
  }));

  registry.issued.fundamentos.push(id);
  registry.issued.steps.push(...steps.map((step) => step.id));

  const frontmatter = [
    "---",
    `id: ${id}`,
    `title: ${title}`,
    `slug: ${slug}`,
    "status: a_estudar",
    `order: ${registry.issued.fundamentos.length}`,
    `summary: ${title} ainda precisa de resumo curado.`,
    "steps:",
    ...steps.flatMap((step) => [
      `  - id: ${step.id}`,
      `    title: ${step.title}`,
      `    order: ${step.order}`,
      "    expected_evidence: []",
    ]),
    "---",
    "",
    `# ${title}`,
    "",
    "## O que e",
    "",
    "Descreva o fundamento com as proprias palavras.",
    "",
    "## Proxima aplicacao",
    "",
    "Defina a menor aplicacao pratica para este fundamento.",
    "",
  ].join("\n");

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, frontmatter, "utf8");
  writeRegistry(registry);
  console.log(`Fundamento criado: ${relative(filePath)} (${id})`);
}

function createTask(registry: Registry, args: string[], errors: string[]): void {
  const [fundamentoId, etapaId, ...titleParts] = args;
  const title = titleParts.join(" ").trim();

  if (!fundamentoId || !etapaId || !title) {
    errors.push(
      'Uso: npm run content:create -- task FUN-000001 STEP-000001 "Titulo da tarefa"',
    );
    return;
  }

  const fundamentos = readFundamentos(registry, errors);
  const fundamento = fundamentos.get(fundamentoId);

  if (!fundamento) {
    errors.push(`Fundamento nao encontrado: ${fundamentoId}`);
    return;
  }

  if (!fundamento.stepIds.has(etapaId)) {
    errors.push(`Etapa ${etapaId} nao pertence ao fundamento ${fundamentoId}.`);
    return;
  }

  const slug = slugify(title);
  const filePath = path.join(contentDir, "tasks", fundamento.slug, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    errors.push(`Arquivo ja existe: ${relative(filePath)}`);
    return;
  }

  const id = nextId(registry, "tasks");
  registry.issued.tasks.push(id);

  const markdown = [
    "---",
    `id: ${id}`,
    `fundamento_id: ${fundamentoId}`,
    `etapa_id: ${etapaId}`,
    `title: ${title}`,
    `slug: ${slug}`,
    "status: a_fazer",
    `order: ${registry.issued.tasks.length}`,
    "expected_evidence:",
    "  - nota_markdown",
    "---",
    "",
    `# ${title}`,
    "",
    "## Resultado esperado",
    "",
    "Descreva a entrega concreta e a evidencia que comprova o aprendizado.",
    "",
  ].join("\n");

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, markdown, "utf8");
  writeRegistry(registry);
  console.log(`Tarefa criada: ${relative(filePath)} (${id})`);
}

function readRegistry(errors: string[]): Registry | null {
  if (!fs.existsSync(registryPath)) {
    errors.push(`Registry nao encontrado: ${relative(registryPath)}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(registryPath, "utf8");
    return JSON.parse(raw) as Registry;
  } catch (error) {
    errors.push(`Registry invalido: ${formatError(error)}`);
    return null;
  }
}

function validateRegistry(registry: Registry, errors: string[]): void {
  if (registry.version !== 1) {
    errors.push("Registry deve ter version igual a 1.");
  }

  for (const key of registryKeys) {
    if (!Array.isArray(registry.issued?.[key])) {
      errors.push(`Registry deve conter issued.${key} como array.`);
      continue;
    }

    for (const id of registry.issued[key]) {
      if (!matchesPrefix(id, key)) {
        errors.push(`ID ${id} em issued.${key} nao segue o formato esperado.`);
      }
    }
  }

  const allIds = registryKeys.flatMap((key) => registry.issued?.[key] ?? []);
  allIds.push(...collectDeprecatedIds(registry.deprecated));
  const seen = new Set<string>();

  for (const id of allIds) {
    if (seen.has(id)) {
      errors.push(`ID duplicado no registry: ${id}`);
    }
    seen.add(id);
  }
}

function readFundamentos(registry: Registry, errors: string[]): Map<string, Fundament> {
  const fundamentos = new Map<string, Fundament>();
  const contentIds = new Set<string>();
  const files = listMarkdownFiles(path.join(contentDir, "fundamentos"));

  for (const filePath of files) {
    const data = readFrontmatter(filePath, errors);
    if (!data) {
      continue;
    }

    requireString(data, "id", filePath, errors);
    requireString(data, "title", filePath, errors);
    requireString(data, "slug", filePath, errors);
    requireString(data, "status", filePath, errors);
    requireNumber(data, "order", filePath, errors);
    requireString(data, "summary", filePath, errors);

    const id = getString(data, "id");
    const slug = getString(data, "slug");
    const steps = data.steps;

    if (!Array.isArray(steps)) {
      errors.push(`${relative(filePath)}: steps deve ser um array.`);
      continue;
    }

    const stepIds = new Set<string>();

    for (const [index, rawStep] of steps.entries()) {
      const step = asRecord(rawStep);

      if (!step) {
        errors.push(`${relative(filePath)}: steps[${index}] deve ser objeto.`);
        continue;
      }

      const stepId = getString(step, "id");
      requireString(step, "id", filePath, errors, `steps[${index}].`);
      requireString(step, "title", filePath, errors, `steps[${index}].`);
      requireNumber(step, "order", filePath, errors, `steps[${index}].`);

      if (stepId) {
        if (stepIds.has(stepId) || contentIds.has(stepId)) {
          errors.push(`${relative(filePath)}: ID duplicado no conteudo: ${stepId}`);
        }
        stepIds.add(stepId);
        contentIds.add(stepId);

        if (!registry.issued.steps.includes(stepId)) {
          errors.push(`${relative(filePath)}: etapa ${stepId} nao consta no registry.`);
        }
      }
    }

    if (!id || !slug) {
      continue;
    }

    if (fundamentos.has(id) || contentIds.has(id)) {
      errors.push(`${relative(filePath)}: ID duplicado no conteudo: ${id}`);
    }

    if (!registry.issued.fundamentos.includes(id)) {
      errors.push(`${relative(filePath)}: fundamento ${id} nao consta no registry.`);
    }

    fundamentos.set(id, { filePath, id, slug, stepIds });
    contentIds.add(id);
  }

  return fundamentos;
}

function readTasks(
  registry: Registry,
  fundamentos: Map<string, Fundament>,
  errors: string[],
): void {
  const files = listMarkdownFiles(path.join(contentDir, "tasks"));
  const taskIds = new Set<string>();

  for (const filePath of files) {
    const data = readFrontmatter(filePath, errors);
    if (!data) {
      continue;
    }

    requireString(data, "id", filePath, errors);
    requireString(data, "fundamento_id", filePath, errors);
    requireString(data, "etapa_id", filePath, errors);
    requireString(data, "title", filePath, errors);
    requireString(data, "slug", filePath, errors);
    requireString(data, "status", filePath, errors);
    requireNumber(data, "order", filePath, errors);

    if (!Array.isArray(data.expected_evidence)) {
      errors.push(`${relative(filePath)}: expected_evidence deve ser array.`);
    }

    const id = getString(data, "id");
    const fundamentoId = getString(data, "fundamento_id");
    const etapaId = getString(data, "etapa_id");

    if (id) {
      if (taskIds.has(id)) {
        errors.push(`${relative(filePath)}: ID duplicado no conteudo: ${id}`);
      }
      taskIds.add(id);

      if (!registry.issued.tasks.includes(id)) {
        errors.push(`${relative(filePath)}: tarefa ${id} nao consta no registry.`);
      }
    }

    const fundamento = fundamentoId ? fundamentos.get(fundamentoId) : undefined;

    if (fundamentoId && !fundamento) {
      errors.push(`${relative(filePath)}: fundamento_id orfao: ${fundamentoId}`);
    }

    if (fundamento && etapaId && !fundamento.stepIds.has(etapaId)) {
      errors.push(
        `${relative(filePath)}: etapa_id ${etapaId} nao pertence a ${fundamentoId}.`,
      );
    }
  }
}

function validateSummaries(errors: string[]): void {
  const summariesDir = path.join(contentDir, "summaries");

  if (!fs.existsSync(summariesDir)) {
    return;
  }

  const files = fs.readdirSync(summariesDir, { withFileTypes: true });
  const markdownBasenames = new Set(
    files
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name.replace(/\.md$/, "")),
  );

  for (const entry of files) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const basename = entry.name.replace(/\.json$/, "");
    const jsonPath = path.join(summariesDir, entry.name);

    if (!markdownBasenames.has(basename)) {
      errors.push(`${relative(jsonPath)}: companion JSON sem Markdown correspondente.`);
    }

    try {
      JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (error) {
      errors.push(`${relative(jsonPath)}: JSON invalido: ${formatError(error)}`);
    }
  }
}

function readFrontmatter(filePath: string, errors: string[]): Record<string, unknown> | null {
  try {
    const parsed = matter(fs.readFileSync(filePath, "utf8"));
    return parsed.data as Record<string, unknown>;
  } catch (error) {
    errors.push(`${relative(filePath)}: frontmatter invalido: ${formatError(error)}`);
    return null;
  }
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function nextId(registry: Registry, key: RegistryKey, offset = 0): string {
  const prefix = prefixes[key];
  const ids = [...registry.issued[key], ...collectDeprecatedIds(registry.deprecated)]
    .filter((id) => id.startsWith(`${prefix}-`))
    .map((id) => Number(id.replace(`${prefix}-`, "")))
    .filter(Number.isFinite);
  const nextNumber = (ids.length > 0 ? Math.max(...ids) : 0) + 1 + offset;

  return `${prefix}-${String(nextNumber).padStart(6, "0")}`;
}

function collectDeprecatedIds(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectDeprecatedIds(item));
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  return Object.values(record).flatMap((item) => collectDeprecatedIds(item));
}

function matchesPrefix(id: string, key: RegistryKey): boolean {
  return new RegExp(`^${prefixes[key]}-\\d{6}$`).test(id);
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  filePath: string,
  errors: string[],
  prefix = "",
): void {
  if (!getString(data, key)) {
    errors.push(`${relative(filePath)}: campo obrigatorio ausente ou invalido: ${prefix}${key}`);
  }
}

function requireNumber(
  data: Record<string, unknown>,
  key: string,
  filePath: string,
  errors: string[],
  prefix = "",
): void {
  if (typeof data[key] !== "number") {
    errors.push(`${relative(filePath)}: campo obrigatorio ausente ou invalido: ${prefix}${key}`);
  }
}

function getString(data: Record<string, unknown>, key: string): string {
  return typeof data[key] === "string" ? data[key] : "";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function writeRegistry(registry: Registry): void {
  const sortedRegistry: Registry = {
    version: registry.version,
    issued: registry.issued,
    deprecated: registry.deprecated ?? {},
  };

  fs.writeFileSync(registryPath, `${JSON.stringify(sortedRegistry, null, 2)}\n`, "utf8");
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function relative(filePath: string): string {
  return path.relative(rootDir, filePath);
}

function fail(errors: string[]): never {
  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main();
