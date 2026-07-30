import assert from "node:assert/strict";
import test from "node:test";

import {
  getExternalSources,
  getFundamentos,
  getTaskBySlug,
  splitIntoSections,
} from "../src/lib/content";

test("divide Markdown em introducao e sessoes de primeiro nivel", () => {
  const parsed = splitIntoSections(
    [
      "# Titulo",
      "",
      "Introducao.",
      "",
      "## Conceito explicado",
      "",
      "Texto.",
      "",
      "## Exemplo",
      "",
      "```ts",
      "const ok = true;",
      "```",
    ].join("\n"),
  );

  assert.equal(parsed.intro, "Introducao.");
  assert.deepEqual(parsed.sections.map((section) => section.slug), [
    "conceito-explicado",
    "exemplo",
  ]);
  assert.match(parsed.sections[1].markdown, /const ok = true/);
  assert.doesNotMatch(parsed.sections[1].markdown, /^## /m);
});

test("mantem slugs unicos para titulos repetidos", () => {
  const parsed = splitIntoSections("## Revisao\n\nUm.\n\n## Revisao\n\nDois.");

  assert.deepEqual(parsed.sections.map((section) => section.slug), [
    "revisao",
    "revisao-2",
  ]);
});

test("carrega os cinco fundamentos reais em ordem", () => {
  const fundamentos = getFundamentos();

  assert.equal(fundamentos.length, 5);
  assert.deepEqual(
    fundamentos.map((fundamento) => fundamento.slug),
    [
      "cli-para-ferramentas",
      "http-e-apis",
      "shell-e-processos",
      "pipeline-de-ingestao",
      "testes-e-evidencias",
    ],
  );
});

test("associa tarefa a fundamento e etapa pelo frontmatter", () => {
  const task = getTaskBySlug("definir-contrato-de-entrada-e-saida");

  assert.equal(task.fundamentId, "FUN-000006");
  assert.equal(task.stepId, "STEP-000016");
  assert.match(task.goal, /contrato observavel/i);
  assert.ok(task.sections.length > 0);
});

test("extrai fontes GitHub em ordem e deduplica URLs", () => {
  const sources = getExternalSources([
    {
      title: "Primeira",
      slug: "primeira",
      order: 1,
      markdown: [
        "Veja o [guia de CLI](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool).",
        "Consulte também [HTTP](https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http).",
      ].join(" "),
    },
    {
      title: "Segunda",
      slug: "segunda",
      order: 2,
      markdown: "A mesma [CLI](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool) aparece novamente.",
    },
  ]);

  assert.deepEqual(sources, [
    {
      label: "guia de CLI",
      url: "https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool",
    },
    {
      label: "HTTP",
      url: "https://github.com/donnemartin/system-design-primer#hypertext-transfer-protocol-http",
    },
  ]);
});

test("encontra fontes GitHub nos cinco fundamentos reais", () => {
  for (const fundament of getFundamentos()) {
    assert.ok(getExternalSources(fundament.sections).length > 0, fundament.slug);
  }
});
