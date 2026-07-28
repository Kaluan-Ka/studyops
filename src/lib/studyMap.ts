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

  return {
    activeBlock: {
      title: "Bloco 1: Ferramentas para empacotar IA",
      label: "Regiao ativa",
      summary:
        "Autonomia para criar CLIs, APIs, processos, pipelines e testes que empacotam projetos de IA em entregas reproduziveis.",
    },
    currentTile: tiles[0],
    tiles,
    futureRegions: [
      { title: "Dados, busca e memoria", label: "Territorio futuro" },
      { title: "Modelos e IA aplicada", label: "Territorio futuro" },
      { title: "Infra e portfolio", label: "Territorio futuro" },
    ],
    stats: {
      fundamentos: fundamentos.length,
      tarefas: fundamentos.reduce((total, fundament) => total + fundament.tasks.length, 0),
      sessoes: tiles.reduce((total, tile) => total + tile.sessionCount, 0),
      evidencias: tiles.reduce((total, tile) => total + tile.evidenceCount, 0),
    },
  };
}
