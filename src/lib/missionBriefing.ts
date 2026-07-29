import type { Fundament, Step, Task } from "./content";

type BriefingLink = {
  href: string;
  label: string;
};

export type MissionBriefing = {
  kicker: string;
  title: string;
  context: string;
  description: string;
  primary: BriefingLink;
  secondary?: BriefingLink;
  evidence: string[];
  status?: string;
};

type ReadingBriefingInput = {
  fundament: Pick<Fundament, "title">;
  currentTitle: string;
  currentOrder: number;
  total: number;
  expectedEvidence: string[];
  nextHref?: string;
  nextLabel?: string;
};

const evidenceLabels: Record<string, string> = {
  nota_markdown: "Produzir nota Markdown",
  teste_automatizado: "Criar teste automatizado",
  exemplo_reproduzivel: "Registrar exemplo reproduzível",
  link_analisado: "Registrar link analisado",
  decisao_tecnica: "Documentar decisão técnica",
  comparacao: "Registrar comparação",
  benchmark: "Executar benchmark",
  readme_atualizado: "Atualizar README",
  fixture_json: "Produzir fixture JSON",
};

const statusLabels: Record<string, string> = {
  a_fazer: "Ainda não iniciada",
  a_estudar: "A estudar",
  em_andamento: "Em andamento",
  concluido: "Concluída",
  bloqueado: "Bloqueada",
};

export function formatEvidenceLabel(value: string): string {
  return evidenceLabels[value] ?? humanizeAction(value);
}

export function formatStatusLabel(value: string): string {
  return statusLabels[value] ?? humanizeSentence(value);
}

export function buildFundamentBriefing(fundament: Fundament): MissionBriefing {
  const step = fundament.steps.find((item) => item.tasks.length > 0) ?? fundament.steps[0];
  const task = step?.tasks[0] ?? fundament.tasks[0];

  if (task && step) {
    return {
      kicker: "Próxima ação da região",
      title: task.title,
      context: `Rota ${step.order}: ${step.title}`,
      description: task.intro || "Abra a missão recomendada e produza a evidência mínima antes de ampliar a leitura.",
      primary: {
        href: taskHref(fundament, task),
        label: "Abrir missão",
      },
      secondary: {
        href: `/fundamentos/${fundament.slug}/etapas/${step.slug}`,
        label: "Ver rota",
      },
      evidence: evidenceFor(task, step),
      status: formatStatusLabel(task.status),
    };
  }

  const section = fundament.sections[0];

  return {
    kicker: "Próxima ação da região",
    title: section?.title ?? fundament.title,
    context: "Briefing inicial",
    description: "Comece pela primeira sessão e registre a evidência mínima antes de seguir para a rota prática.",
    primary: {
      href: section ? `/fundamentos/${fundament.slug}/sessoes/${section.slug}` : `/fundamentos/${fundament.slug}`,
      label: "Abrir sessão",
    },
    evidence: ["Produzir nota Markdown"],
    status: formatStatusLabel(fundament.status),
  };
}

export function buildStepBriefing(fundament: Fundament, step: Step): MissionBriefing {
  const task = step.tasks[0];

  if (!task) {
    return {
      kicker: "Próxima ação da rota",
      title: step.title,
      context: "Rota sem missão cadastrada",
      description: "Use esta rota para definir a menor evidência possível antes de abrir novas leituras.",
      primary: {
        href: `/fundamentos/${fundament.slug}`,
        label: "Voltar ao fundamento",
      },
      evidence: step.expectedEvidence.map(formatEvidenceLabel),
    };
  }

  return {
    kicker: "Próxima ação da rota",
    title: task.title,
    context: `Missão ${task.order.toString().padStart(2, "0")} da rota`,
    description: task.intro || "Execute a missão em uma entrega pequena e verificável.",
    primary: {
      href: taskHref(fundament, task),
      label: "Abrir missão",
    },
    secondary: {
      href: `/fundamentos/${fundament.slug}`,
      label: "Ver região",
    },
    evidence: evidenceFor(task, step),
    status: formatStatusLabel(task.status),
  };
}

export function buildTaskBriefing(fundament: Fundament, task: Task, step?: Step): MissionBriefing {
  const section = task.sections[0];

  return {
    kicker: "Próximo passo da missão",
    title: section?.title ?? task.title,
    context: step ? `Rota: ${step.title}` : `Fundamento: ${fundament.title}`,
    description: "Avance por uma sessão curta, registre o que decidiu e conecte o resultado a uma evidência concreta.",
    primary: {
      href: section ? `${taskHref(fundament, task)}/sessoes/${section.slug}` : taskHref(fundament, task),
      label: section ? "Iniciar sessão" : "Revisar missão",
    },
    secondary: step
      ? {
          href: `/fundamentos/${fundament.slug}/etapas/${step.slug}`,
          label: "Ver rota",
        }
      : undefined,
    evidence: task.expectedEvidence.map(formatEvidenceLabel),
    status: formatStatusLabel(task.status),
  };
}

export function buildReadingBriefing(input: ReadingBriefingInput): MissionBriefing {
  return {
    kicker: "Contexto de missão",
    title: input.currentTitle,
    context: `Sessão ${input.currentOrder} de ${input.total}`,
    description: `Esta leitura alimenta o fundamento ${input.fundament.title}. Termine com uma evidência pequena antes de avançar.`,
    primary: {
      href: input.nextHref ?? "#registro-de-campo",
      label: input.nextLabel ? `Próxima: ${input.nextLabel}` : "Registrar evidência",
    },
    evidence: input.expectedEvidence.map(formatEvidenceLabel),
  };
}

function taskHref(fundament: Pick<Fundament, "slug">, task: Pick<Task, "slug">): string {
  return `/fundamentos/${fundament.slug}/tarefas/${task.slug}`;
}

function evidenceFor(task: Task, step: Step): string[] {
  const values = task.expectedEvidence.length ? task.expectedEvidence : step.expectedEvidence;
  return values.map(formatEvidenceLabel);
}

function humanizeAction(value: string): string {
  return `Produzir ${value.replaceAll("_", " ")}`;
}

function humanizeSentence(value: string): string {
  const label = value.replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
