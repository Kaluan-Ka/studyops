---
target: src/app/fundamentos
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-07-29T01-56-40Z
slug: src-app-fundamentos
---
⚠️ DEGRADED: single-context (Assessment B sub-agent timed out; Assessment A ran isolated, detector/browser evidence completed in parent fallback)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Logbook reports local save state, but task/fundament status is mostly static inventory. |
| 2 | Match System / Real World | 3 | StudyOps language is distinctive, but raw labels like `nota_markdown` and `a_fazer` leak through. |
| 3 | User Control and Freedom | 3 | Breadcrumbs and back links work; fast movement between next action, mission and index is weak. |
| 4 | Consistency and Standards | 3 | Strong canonical visual DNA; reading pages shift abruptly into generic light documentation. |
| 5 | Error Prevention | 2 | Clear-note confirmation exists; local-only persistence risk is not made explicit before writing. |
| 6 | Recognition Rather Than Recall | 2 | Many sessions/routes/tasks are visible, but the recommended start/continue path is not. |
| 7 | Flexibility and Efficiency | 1 | No search, filters, favorites, resume path, bulk flow or keyboard accelerators for repeat study. |
| 8 | Aesthetic and Minimalist Design | 2 | The UI is handsome, but fundamentals pages expose sources, sessions, routes and missions with similar weight. |
| 9 | Error Recovery | 2 | Note access error exists but gives no recovery action such as copy/export/retry guidance. |
| 10 | Help and Documentation | 2 | Content teaches the domain, but the interface lacks contextual help about the StudyOps method and evidence rules. |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: The internal pages are partially authored for StudyOps, not generic SaaS. The foundation page, route cards, mission cards and logbook use the "Centro de Comando Orbital" world with enough confidence: dark operational surfaces, telemetry labels, mission-card objects, and evidence as a real product primitive. The weaker part is the operating model: several internal pages still behave like content indexes. They show what exists, but they do not command the next study action with the force the home promises.

The main specificity gap is not styling. It is task authorship. The home says StudyOps is a command center; the internals often become an atlas plus article reader. A confident StudyOps internal surface should answer: "what do I do next, what evidence should I produce, and where will this matter in the portfolio?"

**Deterministic scan**: `node /home/kaluankaete/.agents/skills/impeccable/scripts/detect.mjs --json src/app/fundamentos` returned `[]`, so the page source files under the target had zero CLI findings. A broader supporting scan on `src/app` found 92 findings in shared UI files: 86 `design-system-color`, 4 `design-system-radius`, 1 `side-tab` in `src/app/content.module.css:82`, and 1 `codex-grid-background` in `src/app/page.module.css:95`. Most are advisory token drift rather than user-facing blockers. The real design risk is that visual decisions live as many one-off literals instead of a tighter StudyOps surface vocabulary.

**Visual overlays**: Mutation preflight succeeded in Playwright and `detect.js` injection succeeded against `/fundamentos/cli-para-ferramentas`. Console reported `[impeccable] 68 anti-patterns found` in the rendered page. This was a headless browser run, so no reliable user-visible `[Human]` overlay is available. Screenshots were captured in `/tmp/studyops-screens/` for desktop and mobile representative routes.

## Overall Impression

The internals have a real spine. They are visually aligned with the home and already feel more purposeful than a generic study tracker. The single biggest opportunity is to turn every internal route from "inventory of material" into "operational briefing": one recommended action, one evidence expectation, one clear continuation path.

## What's Working

- The mission surfaces are strong. `missionCard` and `StudyNote` make tasks feel like concrete work, not abstract reading.
- The visual language is product-specific: dark command background, cyan/green/gold signals, low-radius panels and parchment mission cards.
- The markup is healthier than average: `main`, `section`, `article`, `dl`, `aria-labelledby`, visible focus states, and `aria-live` for note status are already present.

## Priority Issues

**[P1] No primary command on internal pages**

**Why it matters**: A StudyOps user arrives asking "what should I do now?" The current pages answer with sources, sessions, routes, tasks and metrics, but the highest-priority next action is not dominant.

**Fix**: Add a "Proxima acao" operational panel to foundation, route and task pages. It should expose one primary CTA, one secondary escape, and the expected evidence in human language.

**Suggested command**: `$impeccable clarify src/app/fundamentos`

**[P1] Foundation pages overload the decision space**

**Why it matters**: `/fundamentos/cli-para-ferramentas` shows 4 stats, sources, 11 sessions, 3 routes and 6 missions in one long sequence. On mobile this becomes a tall scroll of equally plausible next clicks.

**Fix**: Reorder around the study method: hero, next action, current route/mission, then the complete inventory. Move sources lower or tuck them into a dock that does not compete with "start here".

**Suggested command**: `$impeccable distill src/app/fundamentos/[slug]`

**[P2] Reading pages are legible but lose operational context**

**Why it matters**: The article shell reads well, but once inside a session the user loses the sense of route, evidence and portfolio application. The final state is a note box plus next link, not a completed learning step.

**Fix**: Add a compact operational rail or sticky header for reading pages: current foundation, session position, evidence prompt, and next application. Keep the article calm, but keep StudyOps present.

**Suggested command**: `$impeccable layout src/app/fundamentos/[slug]/sessoes/[sessao]`

**[P2] Raw domain values reduce clarity**

**Why it matters**: Labels like `nota_markdown`, `teste_automatizado`, `a_fazer` and `TASK-031` are useful data, but first-timers need behavioral language.

**Fix**: Add mapping helpers for status and evidence labels: "Ainda nao iniciada", "Produza uma nota Markdown", "Crie um teste automatizado", etc. Keep IDs as secondary telemetry.

**Suggested command**: `$impeccable clarify src/app/fundamentos`

**[P2] Logbook local needs more trust and recovery**

**Why it matters**: The note component is the first real user-owned data surface. It saves locally, but the interface does not prepare the user for browser-only persistence or offer a safety path.

**Fix**: Explain local persistence before typing, preserve work on error, and add "copiar nota" or export as a low-complexity recovery action.

**Suggested command**: `$impeccable harden src/components/StudyNote.tsx`

## Persona Red Flags

**Alex (Power User)**: Alex has no fast path. There is no search, "continue de onde parei", compact task queue, favorites, or shortcuts. A task with 6 sessions requires opening one page at a time, and the page does not distinguish the highest-yield session.

**Sam (Accessibility-Dependent User)**: Focus states and semantic structure are promising. Risks remain: long breadcrumb strings, visual meaning carried by color/telemetry labels, and the native `window.confirm` for clearing notes. Also, `ContentNavigation` renders empty `<span />` placeholders when previous/next is absent.

**Jordan (First-Timer)**: Jordan sees attractive terms like "Regiao aberta", "Sub-regiao pratica", "Briefing de execucao" and `nota_markdown`, but may not know whether to read, open a route, open a mission, or write evidence first. The first click is not obvious within five seconds on the foundation page.

**Kalu (StudyOps Owner/Learner)**: The product should reduce study friction. Right now it gives a beautiful map of available work, but it does not yet behave like a coach saying "today, do this small thing and leave this evidence."

## Minor Observations

- `Voltar para fundamentos` points to `/`, which is currently true but semantically muddy once `/fundamentos` becomes its own index.
- The Next.js dev indicator appears as an empty button in Playwright output; likely development-only noise, but it can confuse automated accessibility checks.
- The reading page screenshots show good line length and no horizontal overflow at tested desktop/mobile widths.
- Reduced-motion handling exists for several hover transforms; include every interactive card class in the same pattern.
- Token drift is high in `content.module.css` and `page.module.css`; either promote tonal ramps to `DESIGN.md` or consolidate literals into CSS custom properties.

## Questions to Consider

- What if every internal route had exactly one "recommended mission now" above the full inventory?
- Should the foundation page feel more like an atlas, a checklist, or a daily briefing?
- What counts as "done" for a session: reading it, writing a local note, or producing external evidence?
