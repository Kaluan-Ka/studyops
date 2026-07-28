# Redesenho Paginas Internas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar as paginas internas do StudyOps para que fundamento, etapa, tarefa, sessao e notas parecam extensoes coerentes do Centro de Comando Orbital.

**Architecture:** O incremento preserva o modelo atual de Next.js App Router, dados Markdown/frontmatter e CSS Modules. A maior parte do trabalho acontece em markup sem estado novo e em `page.module.css` / `content.module.css`; componentes novos so entram se a duplicacao ficar maior que a clareza.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `react-markdown`, `remark-gfm`, Node test runner via `tsx --test`.

## Global Constraints

- O escopo preserva o conteudo Markdown/frontmatter atual.
- Nao adiciona progresso persistido, autenticacao, Supabase, IA, importacao externa ou novas entidades.
- Cartas claras so devem representar missao, tarefa, sessao acionavel ou evidencia esperada.
- Paineis escuros devem carregar contexto, orientacao e telemetria derivada do conteudo existente.
- Brilho e cor indicam foco, estado vivo ou evidencia, nunca pontuacao inventada.
- Nenhum percentual, progresso concluido ou status persistido deve ser fabricado.
- Preservar semantica de `main`, `section`, `article`, listas e headings.
- Garantir foco visivel em links, textarea e botoes.
- Reescrita de `DESIGN.md` fica fora de escopo.

---

## File Structure

- Modify `src/app/fundamentos/[slug]/page.tsx`: transformar a pagina de fundamento em regiao aberta com resumo operacional, trilha de sessoes, rotas/etapas e missoes.
- Modify `src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx`: transformar etapa em rota/sub-regiao com deck de tarefas.
- Modify `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`: transformar tarefa em carta/briefing de missao com evidencias e sessoes.
- Modify `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`: aplicar shell de briefing de leitura para sessoes de fundamento.
- Modify `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`: aplicar o mesmo shell de briefing de leitura para sessoes de tarefa.
- Modify `src/components/StudyNote.tsx`: adicionar pequenos elementos semanticos para estado/logbook, mantendo localStorage.
- Modify `src/app/page.module.css`: adicionar a gramatica visual das paginas internas e adaptar responsividade.
- Modify `src/app/content.module.css`: redesenhar Markdown, navegacao de conteudo e `StudyNote` como logbook tecnico.

No new data helper is required. If duplicated reading-shell markup becomes hard to maintain during implementation, create `src/components/ReadingShell.tsx` only after Task 3, with props:

```ts
type ReadingShellProps = {
  eyebrow: string;
  title: string;
  markdown: string;
  note: React.ReactNode;
  navigation: React.ReactNode;
};
```

---

### Task 1: Fundamento Como Regiao Aberta

**Files:**
- Modify: `src/app/fundamentos/[slug]/page.tsx`
- Modify: `src/app/page.module.css`

**Interfaces:**
- Consumes: `Fundament` from `getFundamentBySlug(slug)`, `getExternalSources(fundament.sections)`.
- Produces: CSS classes used by this task: `regionMain`, `regionHero`, `regionSignal`, `regionBrief`, `regionStats`, `routeDeck`, `routeCard`, `routeLine`, `missionLinks`, `readingRoute`, `readingNode`, `sourceDock`.

- [ ] **Step 1: Inspect the current foundation route**

Run:

```bash
sed -n '1,240p' src/app/fundamentos/[slug]/page.tsx
```

Expected: The file renders `detailMain`, `detailHero`, `sourcesSection`, `sessionGrid`, `stepList`, and `stepCard`.

- [ ] **Step 2: Replace the foundation page markup**

In `src/app/fundamentos/[slug]/page.tsx`, keep imports and data loading, then replace the JSX returned inside `<div className={styles.page}>` with this structure:

```tsx
<header className={styles.header}>
  <Link href="/" className={styles.brand}>StudyOps</Link>
  <Link href="/" className={styles.backLink}>Voltar para fundamentos</Link>
</header>
<main className={styles.regionMain}>
  <p className={styles.breadcrumb}><Link href="/">Fundamentos</Link> / {fundament.title}</p>
  <section className={styles.regionHero} aria-labelledby="fundamento-titulo">
    <div className={styles.regionSignal} aria-hidden="true">
      <span>{fundament.order.toString().padStart(2, "0")}</span>
    </div>
    <div className={styles.regionBrief}>
      <p className={styles.eyebrow}>Regiao aberta · Fundamento {fundament.order}</p>
      <h1 id="fundamento-titulo">{fundament.title}</h1>
      <p className={styles.detailLead}>{fundament.summary}</p>
      {fundament.intro ? <p className={styles.intro}>{fundament.intro}</p> : null}
    </div>
    <dl className={styles.regionStats} aria-label="Telemetria do fundamento">
      <div>
        <dt>Sessoes</dt>
        <dd>{fundament.sections.length}</dd>
      </div>
      <div>
        <dt>Rotas</dt>
        <dd>{fundament.steps.length}</dd>
      </div>
      <div>
        <dt>Missoes</dt>
        <dd>{fundament.tasks.length}</dd>
      </div>
      <div>
        <dt>Fontes</dt>
        <dd>{sources.length}</dd>
      </div>
    </dl>
  </section>

  {sources.length ? (
    <section className={styles.sourceDock} aria-labelledby="fontes-titulo">
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionKicker}>Referencias usadas</p>
          <h2 id="fontes-titulo">Fontes do fundamento</h2>
        </div>
        <span>{sources.length} links</span>
      </div>
      <ul className={styles.sourcesList}>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
          </li>
        ))}
      </ul>
    </section>
  ) : null}

  <section className={styles.readingRoute} aria-labelledby="sessoes-titulo">
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionKicker}>Trilha de leitura</p>
        <h2 id="sessoes-titulo">Sessoes da regiao</h2>
      </div>
      <span>{fundament.sections.length} blocos</span>
    </div>
    <div className={styles.sessionGrid}>
      {fundament.sections.map((section) => (
        <Link key={section.slug} href={`/fundamentos/${fundament.slug}/sessoes/${section.slug}`} className={styles.readingNode}>
          <span>Sessao {section.order.toString().padStart(2, "0")}</span>
          <strong>{section.title}</strong>
          <small>Briefing de leitura</small>
        </Link>
      ))}
    </div>
  </section>

  <section className={styles.routeDeck} aria-labelledby="rotas-titulo">
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionKicker}>Rotas praticas</p>
        <h2 id="rotas-titulo">Etapas e missoes</h2>
      </div>
      <span>{fundament.tasks.length} missoes</span>
    </div>
    <div className={styles.stepList}>
      {fundament.steps.map((step) => (
        <article key={step.id} className={styles.routeCard}>
          <div className={styles.routeLine} aria-hidden="true">{step.order.toString().padStart(2, "0")}</div>
          <div className={styles.stepHeading}>
            <div>
              <span>Rota {step.order}</span>
              <h3>{step.title}</h3>
            </div>
            <Link href={`/fundamentos/${fundament.slug}/etapas/${step.slug}`} className={styles.textLink}>Abrir rota</Link>
          </div>
          <p className={styles.evidenceHint}>Evidencias: {step.expectedEvidence.length ? step.expectedEvidence.join(", ") : "a definir"}</p>
          <div className={styles.missionLinks}>
            {step.tasks.map((task) => (
              <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskLink}>
                <span>{task.order.toString().padStart(2, "0")}</span>
                {task.title}
              </Link>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
</main>
```

- [ ] **Step 3: Add foundation-region CSS**

In `src/app/page.module.css`, keep existing home classes and append these classes before the first `@media` block:

```css
.regionMain {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 36px 0 82px;
}

.regionHero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.42fr);
  gap: 24px;
  margin-top: 22px;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgba(183, 201, 199, 0.2);
  border-radius: 14px;
  background:
    linear-gradient(rgba(105, 216, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(105, 216, 255, 0.06) 1px, transparent 1px),
    rgba(7, 16, 22, 0.76);
  background-size: 34px 34px;
  overflow: hidden;
}

.regionSignal {
  position: absolute;
  right: clamp(22px, 5vw, 72px);
  bottom: -26px;
  display: grid;
  width: 180px;
  height: 158px;
  place-items: center;
  background: linear-gradient(145deg, rgba(105, 216, 255, 0.9), rgba(139, 242, 142, 0.92));
  color: #071016;
  clip-path: polygon(24% 4%, 76% 4%, 100% 50%, 76% 96%, 24% 96%, 0 50%);
  box-shadow: 0 0 44px rgba(105, 216, 255, 0.34);
  opacity: 0.32;
}

.regionSignal span {
  font-size: 54px;
  font-weight: 950;
  font-variant-numeric: tabular-nums;
}

.regionBrief,
.regionStats {
  position: relative;
  z-index: 1;
}

.regionBrief h1 {
  max-width: 780px;
  margin-top: 10px;
  color: #f8f1d0;
  font-size: clamp(38px, 6vw, 66px);
  line-height: 1.04;
  letter-spacing: 0;
}

.regionStats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-content: end;
  margin: 0;
}

.regionStats div {
  padding: 14px;
  border: 1px solid rgba(183, 201, 199, 0.2);
  background: rgba(16, 23, 37, 0.82);
}

.regionStats dt {
  color: #69d8ff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.regionStats dd {
  margin: 7px 0 0;
  color: #ffd45d;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}

.sourceDock,
.readingRoute,
.routeDeck {
  margin-top: 28px;
}

.sourceDock {
  padding: 20px;
  border: 1px solid rgba(105, 216, 255, 0.22);
  border-radius: 8px;
  background: rgba(7, 16, 22, 0.64);
}

.readingNode {
  display: flex;
  min-height: 132px;
  flex-direction: column;
  gap: 9px;
  padding: 18px;
  border: 1px solid rgba(105, 216, 255, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(105, 216, 255, 0.12), transparent 46%),
    rgba(16, 23, 37, 0.8);
  transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
}

.readingNode:hover {
  border-color: rgba(139, 242, 142, 0.66);
  background:
    linear-gradient(135deg, rgba(139, 242, 142, 0.12), transparent 46%),
    rgba(16, 23, 37, 0.92);
  transform: translateY(-2px);
}

.readingNode span {
  color: #69d8ff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.readingNode strong {
  color: #edf6f1;
  font-size: 18px;
  line-height: 1.25;
}

.readingNode small {
  margin-top: auto;
  color: #b7c9c7;
}

.routeCard {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 22px 22px 22px 78px;
  border: 1px solid rgba(183, 201, 199, 0.2);
  border-radius: 8px;
  background: rgba(7, 16, 22, 0.7);
  overflow: hidden;
}

.routeLine {
  position: absolute;
  left: 18px;
  top: 22px;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(139, 242, 142, 0.5);
  background: rgba(139, 242, 142, 0.12);
  color: #8bf28e;
  font-size: 13px;
  font-weight: 950;
  font-variant-numeric: tabular-nums;
}

.missionLinks {
  display: grid;
  gap: 8px;
  margin-top: 4px;
}
```

- [ ] **Step 4: Verify foundation route compiles**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/fundamentos/[slug]/page.tsx src/app/page.module.css
git commit -m "feat: redesenha fundamento como regiao"
```

---

### Task 2: Etapa Como Rota E Tarefa Como Missao

**Files:**
- Modify: `src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx`
- Modify: `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`
- Modify: `src/app/page.module.css`

**Interfaces:**
- Consumes: `getStepBySlug(slug, etapa)`, `getTaskBySlug(tarefa, slug)`, `StudyNote`.
- Produces: CSS classes `routeMain`, `routeHero`, `missionMain`, `missionCard`, `missionMeta`, `missionEvidence`, `missionSectionDeck`, `missionSessionCard`.

- [ ] **Step 1: Update the step page markup**

In `src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx`, keep imports and data loading, then replace the current `<main className={styles.detailMain}>...</main>` with:

```tsx
<main className={styles.routeMain}>
  <p className={styles.breadcrumb}>
    <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / {step.title}
  </p>
  <section className={styles.routeHero} aria-labelledby="etapa-titulo">
    <p className={styles.eyebrow}>Rota {step.order} · Sub-regiao pratica</p>
    <h1 id="etapa-titulo">{step.title}</h1>
    <p className={styles.detailLead}>
      Escolha uma tarefa pequena, produza a evidencia esperada e avance sem perder a relacao com o fundamento.
    </p>
    <p className={styles.evidenceHint}>
      Evidencias esperadas: {step.expectedEvidence.join(", ") || "a definir"}
    </p>
  </section>

  <section className={styles.missionSectionDeck} aria-labelledby="tarefas-titulo">
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionKicker}>Deck da rota</p>
        <h2 id="tarefas-titulo">Missoes desta etapa</h2>
      </div>
      <span>{step.tasks.length} missoes</span>
    </div>
    <div className={styles.taskListLarge}>
      {step.tasks.map((task) => (
        <Link key={task.id} href={`/fundamentos/${fundament.slug}/tarefas/${task.slug}`} className={styles.taskCard}>
          <span>Missao {task.order.toString().padStart(2, "0")}</span>
          <strong>{task.title}</strong>
          <p>{task.intro}</p>
          <small>Esperado: {task.expectedEvidence.join(", ") || "evidencia registrada"}</small>
        </Link>
      ))}
    </div>
  </section>
</main>
```

- [ ] **Step 2: Update the task page markup**

In `src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx`, keep imports and data loading, then replace the current `<main className={styles.detailMain}>...</main>` with:

```tsx
<main className={styles.missionMain}>
  <p className={styles.breadcrumb}>
    <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link>
    {step ? <> / <Link href={`/fundamentos/${task.fundament.slug}/etapas/${step.slug}`}>{step.title}</Link></> : null}
    <> / {task.title}</>
  </p>
  <section className={styles.missionCard} aria-labelledby="tarefa-titulo">
    <div className={styles.cardHeader}>
      <span className={styles.cardId}>TASK-{task.order.toString().padStart(3, "0")}</span>
      <strong>{task.status.replaceAll("_", " ")}</strong>
    </div>
    <p className={styles.eyebrow}>Carta de missao pratica</p>
    <h1 id="tarefa-titulo">{task.title}</h1>
    <p className={styles.detailLead}>{task.intro}</p>
    <dl className={styles.missionMeta}>
      <div>
        <dt>Fundamento</dt>
        <dd>{task.fundament.title}</dd>
      </div>
      {step ? (
        <div>
          <dt>Rota</dt>
          <dd>{step.title}</dd>
        </div>
      ) : null}
      <div>
        <dt>Sessoes</dt>
        <dd>{task.sections.length}</dd>
      </div>
    </dl>
    <p className={styles.missionEvidence}>Evidencias esperadas: {task.expectedEvidence.join(", ") || "a definir"}</p>
  </section>

  <section className={styles.missionSectionDeck} aria-labelledby="sessoes-titulo">
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionKicker}>Briefing de execucao</p>
        <h2 id="sessoes-titulo">Sessoes da missao</h2>
      </div>
      <span>{task.sections.length} blocos</span>
    </div>
    <div className={styles.sessionGrid}>
      {task.sections.map((section) => (
        <Link key={section.slug} href={`/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${section.slug}`} className={styles.missionSessionCard}>
          <span>Sessao {section.order.toString().padStart(2, "0")}</span>
          <strong>{section.title}</strong>
          <small>Executar briefing</small>
        </Link>
      ))}
    </div>
  </section>
  <StudyNote
    noteKey={makeNoteKey({
      scope: "task",
      fundamentSlug: task.fundament.slug,
      taskSlug: task.slug,
    })}
    label="Registro de campo da missao"
  />
</main>
```

- [ ] **Step 3: Add route and mission CSS**

Append these classes near the Task 1 internal CSS block in `src/app/page.module.css`:

```css
.routeMain,
.missionMain {
  width: min(980px, calc(100% - 40px));
  margin: 0 auto;
  padding: 36px 0 82px;
}

.routeHero {
  margin-top: 22px;
  padding: clamp(24px, 4vw, 38px);
  border: 1px solid rgba(105, 216, 255, 0.24);
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(105, 216, 255, 0.14), transparent 40%),
    rgba(7, 16, 22, 0.72);
}

.routeHero h1 {
  max-width: 780px;
  margin-top: 10px;
  color: #f8f1d0;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1.06;
}

.missionCard {
  display: grid;
  gap: 18px;
  margin-top: 22px;
  padding: clamp(22px, 4vw, 36px);
  border: 2px solid #28313e;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 212, 93, 0.22), transparent 42%),
    #eef2e6;
  color: #071016;
  box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.28);
}

.missionCard .eyebrow {
  color: #274237;
}

.missionCard h1 {
  max-width: 820px;
  color: #071016;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.04;
}

.missionMeta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.missionMeta div,
.missionEvidence {
  padding: 13px;
  border: 1px solid rgba(7, 16, 22, 0.18);
  background: rgba(255, 255, 255, 0.42);
}

.missionMeta dt {
  color: #51606a;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.missionMeta dd {
  margin: 6px 0 0;
  color: #071016;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}

.missionEvidence {
  margin: 0;
  color: #344650;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.45;
}

.missionSectionDeck {
  margin-top: 34px;
}

.missionSessionCard {
  display: flex;
  min-height: 132px;
  flex-direction: column;
  gap: 9px;
  padding: 18px;
  border: 1px solid rgba(183, 201, 199, 0.22);
  border-radius: 8px;
  background: rgba(7, 16, 22, 0.7);
  transition: border-color 160ms ease, transform 160ms ease;
}

.missionSessionCard:hover {
  border-color: rgba(255, 212, 93, 0.72);
  transform: translateY(-2px);
}

.missionSessionCard span {
  color: #ffd45d;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.missionSessionCard strong {
  color: #edf6f1;
  font-size: 18px;
  line-height: 1.25;
}

.missionSessionCard small {
  margin-top: auto;
  color: #b7c9c7;
}
```

- [ ] **Step 4: Verify route and mission pages compile**

Run:

```bash
npm run lint
npm test
```

Expected: Both commands PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/fundamentos/[slug]/etapas/[etapa]/page.tsx src/app/fundamentos/[slug]/tarefas/[tarefa]/page.tsx src/app/page.module.css
git commit -m "feat: redesenha rotas e missoes internas"
```

---

### Task 3: Sessoes Como Briefing De Leitura

**Files:**
- Modify: `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`
- Modify: `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`
- Modify: `src/app/page.module.css`
- Modify: `src/app/content.module.css`

**Interfaces:**
- Consumes: `ContentNavigation`, `MarkdownContent`, `StudyNote`, current `previous`/`next` objects.
- Produces: CSS classes `readingShell`, `readingHeaderPanel`, `readingMeta`, `readingArticle`.

- [ ] **Step 1: Update foundation-session markup**

In `src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx`, replace the current `<main className={styles.readingMain}>...</main>` with:

```tsx
<main className={styles.readingMain}>
  <p className={styles.breadcrumb}>
    <Link href={`/fundamentos/${fundament.slug}`}>{fundament.title}</Link> / Sessao {section.order}
  </p>
  <section className={styles.readingShell} aria-labelledby="sessao-titulo">
    <header className={styles.readingHeaderPanel}>
      <p className={styles.eyebrow}>Briefing de leitura · Sessao {section.order} de {fundament.sections.length}</p>
      <h1 id="sessao-titulo">{section.title}</h1>
      <dl className={styles.readingMeta}>
        <div>
          <dt>Fundamento</dt>
          <dd>{fundament.title}</dd>
        </div>
        <div>
          <dt>Registro</dt>
          <dd>Logbook local</dd>
        </div>
      </dl>
    </header>
    <article className={styles.readingArticle}>
      <MarkdownContent markdown={section.markdown} />
      <StudyNote
        noteKey={makeNoteKey({
          scope: "fundament-session",
          fundamentSlug: fundament.slug,
          sessionSlug: section.slug,
        })}
        label="Registro de campo desta sessao"
      />
      <ContentNavigation
        previous={previous ? { href: `/fundamentos/${fundament.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
        next={next ? { href: `/fundamentos/${fundament.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
      />
    </article>
  </section>
</main>
```

- [ ] **Step 2: Update task-session markup**

In `src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx`, replace the current `<main className={styles.readingMain}>...</main>` with:

```tsx
<main className={styles.readingMain}>
  <p className={styles.breadcrumb}>
    <Link href={`/fundamentos/${task.fundament.slug}`}>{task.fundament.title}</Link> / {task.title} / Sessao {section.order}
  </p>
  <section className={styles.readingShell} aria-labelledby="sessao-titulo">
    <header className={styles.readingHeaderPanel}>
      <p className={styles.eyebrow}>Briefing de missao · Sessao {section.order} de {task.sections.length}</p>
      <h1 id="sessao-titulo">{section.title}</h1>
      <dl className={styles.readingMeta}>
        <div>
          <dt>Missao</dt>
          <dd>{task.title}</dd>
        </div>
        <div>
          <dt>Registro</dt>
          <dd>Logbook local</dd>
        </div>
      </dl>
    </header>
    <article className={styles.readingArticle}>
      <MarkdownContent markdown={section.markdown} />
      <StudyNote
        noteKey={makeNoteKey({
          scope: "task-session",
          fundamentSlug: task.fundament.slug,
          taskSlug: task.slug,
          sessionSlug: section.slug,
        })}
        label="Registro de campo desta sessao"
      />
      <ContentNavigation
        previous={previous ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${previous.slug}`, title: previous.title } : undefined}
        next={next ? { href: `/fundamentos/${task.fundament.slug}/tarefas/${task.slug}/sessoes/${next.slug}`, title: next.title } : undefined}
      />
    </article>
  </section>
</main>
```

- [ ] **Step 3: Add reading shell CSS**

In `src/app/page.module.css`, keep the existing `.readingMain` width and add:

```css
.readingShell {
  margin-top: 22px;
}

.readingHeaderPanel {
  padding: clamp(22px, 4vw, 34px);
  border: 1px solid rgba(105, 216, 255, 0.22);
  border-radius: 10px 10px 0 0;
  background:
    linear-gradient(135deg, rgba(105, 216, 255, 0.12), transparent 42%),
    rgba(7, 16, 22, 0.78);
}

.readingHeaderPanel h1 {
  max-width: 780px;
  margin-top: 10px;
  color: #f8f1d0;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.07;
}

.readingMeta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 22px 0 0;
}

.readingMeta div {
  padding: 12px;
  border: 1px solid rgba(183, 201, 199, 0.18);
  background: rgba(16, 23, 37, 0.68);
}

.readingMeta dt {
  color: #69d8ff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.readingMeta dd {
  margin: 6px 0 0;
  color: #edf6f1;
  font-size: 14px;
  font-weight: 750;
}
```

- [ ] **Step 4: Replace reading article and Markdown CSS**

In `src/app/page.module.css`, replace the existing `.readingArticle` block with:

```css
.readingArticle {
  padding: clamp(22px, 5vw, 52px);
  border: 1px solid #dbe4dc;
  border-top: 0;
  border-radius: 0 0 10px 10px;
  background: rgba(238, 242, 230, 0.96);
  box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.24);
}
```

In `src/app/content.module.css`, keep existing selectors but update the reading palette:

```css
.markdown {
  color: #2c3b34;
  font-size: 17px;
  line-height: 1.76;
}

.markdown h3,
.markdown h4 {
  margin: 30px 0 10px;
  color: #071016;
  line-height: 1.25;
}

.markdown h3 {
  font-size: 24px;
}

.markdown h4 {
  font-size: 20px;
}

.markdown a {
  color: #115d45;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.markdown pre {
  overflow-x: auto;
  padding: 18px;
  border: 1px solid #2c463d;
  border-radius: 8px;
  background: #071016;
  color: #edf6f1;
}
```

- [ ] **Step 5: Verify reading pages compile**

Run:

```bash
npm run lint
npm test
```

Expected: Both commands PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/fundamentos/[slug]/sessoes/[sessao]/page.tsx src/app/fundamentos/[slug]/tarefas/[tarefa]/sessoes/[sessao]/page.tsx src/app/page.module.css src/app/content.module.css
git commit -m "feat: redesenha sessoes como briefing de leitura"
```

---

### Task 4: StudyNote Como Logbook Tecnico

**Files:**
- Modify: `src/components/StudyNote.tsx`
- Modify: `src/app/content.module.css`
- Test: `tests/notes.test.ts`

**Interfaces:**
- Consumes: existing note functions from `src/lib/notes.ts`.
- Produces: same public component signature `StudyNote({ noteKey, label }: StudyNoteProps)`.

- [ ] **Step 1: Confirm note persistence tests still cover storage behavior**

Run:

```bash
npm test -- tests/notes.test.ts
```

Expected: PASS. These tests cover key generation, serialization, parsing and isolated reads.

- [ ] **Step 2: Update StudyNote markup without changing behavior**

In `src/components/StudyNote.tsx`, replace only the returned JSX with:

```tsx
return (
  <section className={styles.studyNote} aria-labelledby={`${noteKey}-label`}>
    <div className={styles.studyNoteRail} aria-hidden="true" />
    <div className={styles.studyNoteBody}>
      <div className={styles.studyNoteHeader}>
        <div>
          <p className={styles.studyNoteKicker}>Logbook tecnico</p>
          <h2 id={`${noteKey}-label`}>{label}</h2>
        </div>
        <span className={styles.studyNoteStatus} aria-live="polite">{statusMessage}</span>
      </div>
      <label className={styles.studyNoteLabel} htmlFor={`${noteKey}-input`}>
        Evidencia, duvida, resultado ou proximo passo
      </label>
      <textarea
        id={`${noteKey}-input`}
        className={styles.studyNoteTextarea}
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Registre uma observacao tecnica, decisao, teste, falha ou proxima aplicacao..."
        rows={7}
        disabled={state === "loading"}
      />
      <div className={styles.studyNoteActions}>
        <button type="button" className={styles.studyNoteSave} onClick={handleSave} disabled={state === "loading" || state === "error"}>
          Salvar registro
        </button>
        <button type="button" className={styles.studyNoteClear} onClick={handleClear} disabled={state === "loading" || (!text && !savedText)}>
          Limpar
        </button>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Replace StudyNote CSS**

In `src/app/content.module.css`, replace the `.studyNote*` blocks with:

```css
.studyNote {
  position: relative;
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 0;
  margin-top: 44px;
  border: 1px solid #c7d4cc;
  border-radius: 8px;
  background: #f3f6ee;
  color: #071016;
  box-shadow: 8px 8px 0 rgba(7, 16, 22, 0.12);
  overflow: hidden;
}

.studyNoteRail {
  background:
    repeating-linear-gradient(
      180deg,
      #ffd45d 0 16px,
      #8bf28e 16px 28px,
      #69d8ff 28px 40px
    );
}

.studyNoteBody {
  padding: 24px;
}

.studyNoteHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.studyNoteKicker {
  color: #1d6a51;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.studyNote h2 {
  margin-top: 6px;
  color: #071016;
  font-size: 24px;
  line-height: 1.18;
}

.studyNoteStatus {
  max-width: 220px;
  color: #4b5c54;
  font-size: 13px;
  line-height: 1.4;
  text-align: right;
}

.studyNoteLabel {
  display: block;
  margin-top: 22px;
  color: #2c3b34;
  font-size: 14px;
  font-weight: 800;
}

.studyNoteTextarea {
  display: block;
  width: 100%;
  min-height: 150px;
  margin-top: 8px;
  padding: 12px 14px;
  border: 1px solid #b6c6bb;
  border-radius: 6px;
  background: #fffef8;
  color: #071016;
  font: inherit;
  line-height: 1.55;
  resize: vertical;
}

.studyNoteTextarea:focus {
  outline: 3px solid rgba(105, 216, 255, 0.32);
  outline-offset: 1px;
  border-color: #1d6a51;
}

.studyNoteActions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.studyNoteSave,
.studyNoteClear {
  min-height: 40px;
  padding: 8px 13px;
  border-radius: 4px;
  font: inherit;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
}

.studyNoteSave {
  border: 1px solid #071016;
  background: #8bf28e;
  color: #071016;
}

.studyNoteClear {
  border: 1px solid #8fa096;
  background: transparent;
  color: #263a31;
}

.studyNoteSave:disabled,
.studyNoteClear:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

- [ ] **Step 4: Verify note behavior**

Run:

```bash
npm test -- tests/notes.test.ts
npm run lint
```

Expected: Both commands PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StudyNote.tsx src/app/content.module.css
git commit -m "feat: redesenha anotacoes como logbook"
```

---

### Task 5: Responsividade, Verificacao Visual E Ajustes Finais

**Files:**
- Modify: `src/app/page.module.css`
- Modify: `src/app/content.module.css`

**Interfaces:**
- Consumes: all CSS classes introduced in Tasks 1-4.
- Produces: stable desktop/mobile behavior for internal surfaces.

- [ ] **Step 1: Add responsive CSS for internal pages**

In `src/app/page.module.css`, inside the existing `@media (max-width: 800px)` block, add:

```css
.regionHero,
.missionMeta,
.readingMeta {
  grid-template-columns: 1fr;
}

.regionStats {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.routeCard {
  padding: 76px 18px 18px;
}

.routeLine {
  left: 18px;
  top: 18px;
}
```

Inside the existing `@media (max-width: 370px)` block, add:

```css
.regionMain,
.routeMain,
.missionMain,
.readingMain {
  width: min(980px, calc(100% - 28px));
}

.regionStats {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 2: Add responsive CSS for logbook**

In `src/app/content.module.css`, inside the existing `@media (max-width: 640px)` block, add:

```css
.studyNote {
  grid-template-columns: 8px minmax(0, 1fr);
}

.studyNoteBody {
  padding: 20px 16px;
}
```

- [ ] **Step 3: Run full automated verification**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected:

- `npm run lint`: PASS with no ESLint errors.
- `npm test`: PASS for all tests in `tests/*.test.ts`.
- `npm run build`: PASS after `content:validate`, generating a production build.

- [ ] **Step 4: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Next.js dev server starts and prints a local URL, usually `http://localhost:3000`.

- [ ] **Step 5: Manual browser verification**

Open these representative pages:

```txt
/
/fundamentos/http-e-apis
/fundamentos/http-e-apis/etapas/entender-request-response-e-metodos
/fundamentos/http-e-apis/tarefas/desenhar-contrato-request-response
/fundamentos/http-e-apis/sessoes/modelo-mental-de-uma-requisicao
/fundamentos/http-e-apis/tarefas/desenhar-contrato-request-response/sessoes/conceito-explicado
```

Expected:

- Home still matches the existing orbital command deck.
- Foundation page reads as an opened region, with real counters only.
- Step page reads as a route/sub-region.
- Task page reads as a mission card/briefing.
- Session pages are calmer and readable.
- StudyNote saves, clears and restores a local note.
- At desktop and mobile widths, text does not overlap or overflow cards/buttons.

- [ ] **Step 6: Stop local dev server**

Press `Ctrl-C` in the terminal running `npm run dev`.

Expected: Server exits cleanly.

- [ ] **Step 7: Commit final responsive pass**

```bash
git add src/app/page.module.css src/app/content.module.css
git commit -m "fix: ajusta responsividade das paginas internas"
```

---

## Self-Review Notes

- Spec coverage: Task 1 covers fundamento como regiao aberta. Task 2 covers etapa como rota and tarefa como missao. Task 3 covers sessao como briefing de leitura. Task 4 covers notas/evidencias como logbook. Task 5 covers responsividade and final verification.
- Placeholder scan: The plan intentionally uses `a definir` only where the current app already uses it as fallback copy for missing expected evidence. No `TBD`, `TODO`, or deferred implementation step is present.
- Type consistency: No new public data type is required. Optional `ReadingShellProps` is defined only as a contingency and is not referenced by later mandatory tasks.
