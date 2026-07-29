import type { Fundament } from "./content";

export type StudyMapTileState = "current" | "available";

export type StudyMapTile = {
  title: string;
  slug: string;
  order: number;
  state: StudyMapTileState;
  summary: string;
  href: string;
  sessionHref?: string;
  sessionLabel?: string;
  taskCount: number;
  sessionCount: number;
  evidenceCount: number;
};

export type FutureRegion = {
  title: string;
  label: string;
};

export type StudyMapViewModel = {
  activeBlock: {
    title: string;
    label: string;
    summary: string;
  };
  currentTile?: StudyMapTile;
  tiles: StudyMapTile[];
  futureRegions: FutureRegion[];
  stats: {
    fundamentos: number;
    tarefas: number;
    sessoes: number;
    evidencias: number;
  };
  realProgress: {
    state: "waiting_for_supabase";
    label: string;
    statusLabel: string;
    description: string;
    inventoryLabel: string;
  };
};

export function buildStudyMap(fundamentos: Fundament[]): StudyMapViewModel {
  const tiles = fundamentos.map((fundamento, index) => {
    const firstSection = fundamento.sections[0];
    const evidence = new Set<string>();

    for (const step of fundamento.steps) {
      for (const item of step.expectedEvidence) {
        evidence.add(item);
      }
    }

    return {
      title: fundamento.title,
      slug: fundamento.slug,
      order: fundamento.order,
      state: index === 0 ? "current" : "available",
      summary: fundamento.summary,
      href: `/fundamentos/${fundamento.slug}`,
      sessionHref: firstSection
        ? `/fundamentos/${fundamento.slug}/sessoes/${firstSection.slug}`
        : undefined,
      sessionLabel: firstSection?.title,
      taskCount: fundamento.tasks.length,
      sessionCount:
        fundamento.sections.length +
        fundamento.tasks.reduce((total, task) => total + task.sections.length, 0),
      evidenceCount: evidence.size,
    } satisfies StudyMapTile;
  });
  const stats = {
    fundamentos: fundamentos.length,
    tarefas: fundamentos.reduce((total, fundament) => total + fundament.tasks.length, 0),
    sessoes: tiles.reduce((total, tile) => total + tile.sessionCount, 0),
    evidencias: tiles.reduce((total, tile) => total + tile.evidenceCount, 0),
  };

  return {
    activeBlock: {
      title: "Bloco 1: Ferramentas para empacotar IA",
      label: "Região ativa",
      summary:
        "Autonomia para criar CLIs, APIs, processos, pipelines e testes que empacotam projetos de IA em entregas reproduzíveis.",
    },
    currentTile: tiles[0],
    tiles,
    futureRegions: [
      { title: "Dados, busca e memória", label: "Território futuro" },
      { title: "Modelos e IA aplicada", label: "Território futuro" },
      { title: "Infra e portfólio", label: "Território futuro" },
    ],
    stats,
    realProgress: {
      state: "waiting_for_supabase",
      label: "Progresso real",
      statusLabel: "Aguardando Supabase",
      description:
        "A barra volta quando o Supabase persistir evidências, tarefas e ciclos concluídos.",
      inventoryLabel: `${stats.evidencias} evidências esperadas mapeadas`,
    },
  };
}
