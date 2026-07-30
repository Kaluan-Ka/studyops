import assert from "node:assert/strict";
import test from "node:test";

import type { ContentSection, Fundament, Step, Task } from "../src/lib/content";
import {
  buildFundamentBriefing,
  buildReadingBriefing,
  buildStepBriefing,
  buildTaskBriefing,
  formatEvidenceLabel,
  formatStatusLabel,
} from "../src/lib/missionBriefing";

const sections: ContentSection[] = [
  {
    title: "Primeira leitura",
    slug: "primeira-leitura",
    order: 1,
    markdown: "Texto.",
  },
  {
    title: "Aplicação",
    slug: "aplicacao",
    order: 2,
    markdown: "Texto.",
  },
];

const task: Task = {
  id: "TASK-1",
  fundamentId: "FUN-1",
  stepId: "STEP-1",
  title: "Definir contrato da CLI",
  slug: "definir-contrato-da-cli",
  status: "a_fazer",
  order: 1,
  goal: "Entender que uma CLI confiavel comeca por um contrato observavel antes da implementacao.",
  expectedEvidence: ["nota_markdown", "teste_automatizado"],
  intro: "Transforme a ideia em contrato verificavel.",
  sections,
};

const step: Step = {
  id: "STEP-1",
  title: "Entender o contrato",
  slug: "entender-o-contrato",
  order: 1,
  expectedEvidence: ["nota_markdown"],
  tasks: [task],
};

const fundament: Fundament = {
  id: "FUN-1",
  title: "CLI para ferramentas",
  slug: "cli-para-ferramentas",
  status: "a_estudar",
  order: 1,
  summary: "Interface local observavel.",
  intro: "Intro.",
  sections,
  steps: [step],
  tasks: [task],
};

test("formatEvidenceLabel traduz evidências técnicas para ação humana", () => {
  assert.equal(formatEvidenceLabel("nota_markdown"), "Produzir nota Markdown");
  assert.equal(formatEvidenceLabel("teste_automatizado"), "Criar teste automatizado");
  assert.equal(formatEvidenceLabel("link_analisado"), "Registrar link analisado");
  assert.equal(formatEvidenceLabel("fixture_json"), "Produzir fixture JSON");
});

test("formatStatusLabel traduz status de frontmatter sem alterar a origem", () => {
  assert.equal(formatStatusLabel("a_fazer"), "Ainda não iniciada");
  assert.equal(formatStatusLabel("a_estudar"), "A estudar");
  assert.equal(formatStatusLabel("em_andamento"), "Em andamento");
});

test("buildFundamentBriefing prioriza a primeira missão da primeira rota", () => {
  const briefing = buildFundamentBriefing(fundament);

  assert.equal(briefing.kicker, "Próxima ação da região");
  assert.equal(briefing.title, "Definir contrato da CLI");
  assert.equal(briefing.context, "Rota 1: Entender o contrato");
  assert.equal(
    briefing.description,
    "Entender que uma CLI confiavel comeca por um contrato observavel antes da implementacao.",
  );
  assert.equal(briefing.primary.href, "/fundamentos/cli-para-ferramentas/tarefas/definir-contrato-da-cli");
  assert.equal(briefing.primary.label, "Abrir missão");
  assert.deepEqual(briefing.evidence, [
    "Produzir nota Markdown",
    "Criar teste automatizado",
  ]);
});

test("buildStepBriefing aponta para a primeira tarefa da etapa", () => {
  const briefing = buildStepBriefing(fundament, step);

  assert.equal(briefing.title, "Definir contrato da CLI");
  assert.equal(briefing.context, "Missão 01 da rota");
  assert.equal(
    briefing.description,
    "Entender que uma CLI confiavel comeca por um contrato observavel antes da implementacao.",
  );
  assert.equal(briefing.primary.href, "/fundamentos/cli-para-ferramentas/tarefas/definir-contrato-da-cli");
});

test("buildTaskBriefing aponta para a primeira sessão da tarefa", () => {
  const briefing = buildTaskBriefing(fundament, task, step);

  assert.equal(briefing.title, "Primeira leitura");
  assert.equal(briefing.context, "Rota: Entender o contrato");
  assert.equal(
    briefing.description,
    "Entender que uma CLI confiavel comeca por um contrato observavel antes da implementacao.",
  );
  assert.equal(briefing.primary.href, "/fundamentos/cli-para-ferramentas/tarefas/definir-contrato-da-cli/sessoes/primeira-leitura");
  assert.equal(briefing.secondary?.href, "/fundamentos/cli-para-ferramentas/etapas/entender-o-contrato");
});

test("buildReadingBriefing preserva o texto didático e só adiciona contexto", () => {
  const briefing = buildReadingBriefing({
    fundament,
    currentTitle: "Primeira leitura",
    currentOrder: 1,
    total: 2,
    expectedEvidence: ["nota_markdown"],
    nextHref: "/fundamentos/cli-para-ferramentas/sessoes/aplicacao",
    nextLabel: "Aplicação",
  });

  assert.equal(briefing.title, "Primeira leitura");
  assert.equal(briefing.context, "Sessão 1 de 2");
  assert.deepEqual(briefing.evidence, ["Produzir nota Markdown"]);
  assert.equal(briefing.primary.href, "/fundamentos/cli-para-ferramentas/sessoes/aplicacao");
});
