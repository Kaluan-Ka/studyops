import assert from "node:assert/strict";
import test from "node:test";

import type { Fundament } from "../src/lib/content";
import { buildStudyMap } from "../src/lib/studyMap";

function fundament(
  partial: Partial<Fundament> & Pick<Fundament, "title" | "slug" | "order">,
): Fundament {
  return {
    id: `FUN-${partial.order}`,
    title: partial.title,
    slug: partial.slug,
    status: partial.status ?? "a_estudar",
    order: partial.order,
    summary: partial.summary ?? `${partial.title} summary`,
    intro: "",
    sections: partial.sections ?? [],
    steps: partial.steps ?? [],
    tasks: partial.tasks ?? [],
  };
}

test("buildStudyMap cria tiles ativos, briefing e territorios futuros", () => {
  const fundamentos = [
    fundament({ title: "CLI para ferramentas", slug: "cli-para-ferramentas", order: 1 }),
    fundament({ title: "HTTP e APIs", slug: "http-e-apis", order: 2 }),
  ];

  const map = buildStudyMap(fundamentos);

  assert.equal(map.activeBlock.title, "Bloco 1: Ferramentas para empacotar IA");
  assert.equal(map.stats.fundamentos, 2);
  assert.equal(map.currentTile?.slug, "cli-para-ferramentas");
  assert.equal(map.tiles[0].state, "current");
  assert.equal(map.tiles[1].state, "available");
  assert.deepEqual(
    map.futureRegions.map((region) => region.title),
    ["Dados, busca e memória", "Modelos e IA aplicada", "Infra e portfólio"],
  );
});

test("buildStudyMap separa progresso real do inventario de conteudo", () => {
  const fundamentos = [
    fundament({
      title: "CLI para ferramentas",
      slug: "cli-para-ferramentas",
      order: 1,
      steps: [
        {
          id: "STEP-1",
          title: "Contrato",
          slug: "contrato",
          order: 1,
          expectedEvidence: ["README", "Teste automatizado"],
          tasks: [],
        },
        {
          id: "STEP-2",
          title: "Execucao",
          slug: "execucao",
          order: 2,
          expectedEvidence: ["README"],
          tasks: [],
        },
      ],
    }),
  ];

  const map = buildStudyMap(fundamentos);

  assert.equal(map.realProgress.state, "waiting_for_supabase");
  assert.equal(map.realProgress.label, "Progresso real");
  assert.match(map.realProgress.description, /Supabase/);
  assert.equal(map.realProgress.inventoryLabel, "2 evidências esperadas mapeadas");
  assert.equal("percentage" in map.realProgress, false);
});

test("buildStudyMap cria guia narrativo a servico do estudo", () => {
  const fundamentos = [
    fundament({
      title: "CLI para ferramentas",
      slug: "cli-para-ferramentas",
      order: 1,
      sections: [
        {
          title: "Leitura minima",
          slug: "leitura-minima",
          order: 1,
          markdown: "",
        },
      ],
      steps: [
        {
          id: "STEP-1",
          title: "Contrato de uso",
          slug: "contrato-de-uso",
          order: 1,
          expectedEvidence: ["nota_markdown", "teste_automatizado"],
          tasks: [],
        },
      ],
    }),
  ];

  const map = buildStudyMap(fundamentos);

  assert.equal(map.narrativeGuide.speaker, "Navegadora de campo");
  assert.equal(map.narrativeGuide.callSign, "N-01");
  assert.equal(map.narrativeGuide.title, "Foco narrado: CLI para ferramentas");
  assert.match(map.narrativeGuide.message, /Leitura minima/);
  assert.equal(map.narrativeGuide.focusLabel, "Fundamento em foco");
  assert.equal(map.narrativeGuide.focusValue, "CLI para ferramentas");
  assert.equal(map.narrativeGuide.evidenceLabel, "2 evidências esperadas");
  assert.equal(map.narrativeGuide.nextStepLabel, "Iniciar primeira sessão");
  assert.equal(map.narrativeGuide.href, "/fundamentos/cli-para-ferramentas/sessoes/leitura-minima");
});
