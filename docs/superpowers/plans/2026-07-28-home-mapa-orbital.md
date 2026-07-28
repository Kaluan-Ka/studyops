# Home Mapa Orbital Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a home do StudyOps como Centro de Comando Orbital, com mapa de fundamentos, briefing operacional e cartas de missão.

**Architecture:** A home continua em `src/app/page.tsx`, consumindo `getFundamentos()`. A lógica derivada do mapa fica em `src/lib/studyMap.ts` para ser testável sem renderizar Next. O visual vive em `src/app/page.module.css`, reaproveitando classes internas existentes quando não conflitarem.

**Tech Stack:** Next.js App Router, TypeScript, CSS Modules, Node test runner via `tsx --test`, conteúdo Markdown/frontmatter em `content/`.

## Global Constraints

- Preservar conteúdo real vindo de `content/`.
- Não inventar progresso de usuário, métricas reais, usuários, conquistas ou dados persistidos.
- Não alterar o modelo de dados neste incremento.
- Não implementar Supabase, progresso persistido, IA ou importação externa.
- A home deve mostrar Bloco 1 como região ativa e blocos futuros como extensão apagada.
- Mapa, cartas e brilho devem corresponder a fundamento, status, tarefa, sessão, evidência ou próximo passo.
- Interface deve funcionar em desktop e mobile sem sobreposição incoerente.
- Estados visuais não podem depender somente de cor.

---

### Task 1: Map View Model

**Files:**
- Create: `src/lib/studyMap.ts`
- Create: `tests/studyMap.test.ts`

**Interfaces:**
- Consumes: `Fundament` from `src/lib/content.ts`.
- Produces: `buildStudyMap(fundamentos: Fundament[]): StudyMapViewModel`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import type { Fundament } from "../src/lib/content";
import { buildStudyMap } from "../src/lib/studyMap";

function fundament(partial: Partial<Fundament> & Pick<Fundament, "title" | "slug" | "order">): Fundament {
  return {
    id: `FUN-${partial.order}`,
    status: partial.status ?? "a_estudar",
    summary: partial.summary ?? `${partial.title} summary`,
    intro: "",
    sections: partial.sections ?? [],
    steps: partial.steps ?? [],
    tasks: partial.tasks ?? [],
    ...partial,
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
    ["Dados, busca e memoria", "Modelos e IA aplicada", "Infra e portfolio"],
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/studyMap.test.ts`

Expected: FAIL because `../src/lib/studyMap` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/studyMap.ts` with:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/studyMap.test.ts`

Expected: PASS.

### Task 2: Home Markup

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `buildStudyMap(fundamentos)`.
- Produces: semantic home sections with classes consumed by `page.module.css`.

- [ ] **Step 1: Update `page.tsx`**

Replace the home layout with:

```tsx
const studyMap = buildStudyMap(fundamentos);
const currentTile = studyMap.currentTile;
```

Render:

- header with anchors `#mapa`, `#missoes`, `#evidencias`;
- `section#mapa` containing the title, map tiles, future regions and legend;
- aside briefing using `currentTile`;
- `section#missoes` listing fundamentos as mission cards;
- `section#evidencias` with honest aggregate counts from `studyMap.stats`.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: PASS or only errors unrelated to this edit.

### Task 3: Orbital Visual System CSS

**Files:**
- Modify: `src/app/page.module.css`

**Interfaces:**
- Consumes: class names introduced in Task 2.
- Produces: responsive Centro de Comando Orbital visual world.

- [ ] **Step 1: Replace home-specific CSS**

Update `.page`, `.header`, `.brand`, `.main`, `.hero`, `.track`, `.fundamento`, `.summaryGrid`, link classes and new map classes so the home follows `DESIGN.md`:

- dark command background;
- two-column orbital viewport on desktop;
- semantic hex map with stable tile dimensions;
- briefing panel at right;
- mission cards as tactical/cardgame surfaces;
- mobile layout without overlap.

- [ ] **Step 2: Preserve detail page classes**

Keep `.detailMain`, `.readingMain`, `.breadcrumb`, `.detailHero`, `.sourcesSection`, `.sessionGrid`, `.stepCard`, `.taskCard`, `.readingArticle` and related detail-page classes usable by internal routes.

- [ ] **Step 3: Run lint and content validation**

Run: `npm run lint`

Expected: PASS.

Run: `npm run content:validate`

Expected: PASS.

### Task 4: Build and Browser Verification

**Files:**
- No source files expected unless verification reveals a bug.

**Interfaces:**
- Consumes: built Next app.
- Produces: verified local implementation.

- [ ] **Step 1: Run full build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 2: Start dev server**

Run: `npm run dev`

Expected: local Next server URL, usually `http://localhost:3000`.

- [ ] **Step 3: Inspect desktop and mobile**

Use browser inspection or Playwright if available:

- desktop viewport around 1440x900;
- mobile viewport around 390x844;
- map visible and nonblank;
- no overlapping header/nav/title/tile text;
- first session and fundamento links remain reachable;
- future regions are visibly non-clickable.

- [ ] **Step 4: Final status**

Report changed files, verification commands, local URL and any residual risks.

## Self-Review

- Spec coverage: the tasks cover map, briefing, future regions, cards, responsiveness, accessibility and verification.
- Placeholder scan: no `TBD`, `TODO` or open implementation slots remain.
- Type consistency: `buildStudyMap`, `StudyMapTile`, `FutureRegion` and `StudyMapViewModel` are defined before use.
