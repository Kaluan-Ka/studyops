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
