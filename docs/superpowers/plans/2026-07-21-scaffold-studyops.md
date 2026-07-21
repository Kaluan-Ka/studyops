# Scaffold StudyOps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o scaffold Next.js/TypeScript do StudyOps, a base de conteudo versionado e o script minimo de conteudo com `validate` e `create`.

**Architecture:** O app usa Next.js App Router como casca web inicial e mantem conteudo curado em Markdown/frontmatter sob `content/`. O script `scripts/content.ts` roda em Node/TypeScript, controla IDs em `content/.registry/ids.json` e valida os arquivos reais antes do build.

**Tech Stack:** Next.js App Router, React, TypeScript, Node.js, gray-matter, tsx, ESLint.

## Global Constraints

- Responder e documentar o trabalho em portugues.
- Manter o MVP pequeno e centrado em fundamentos.
- Nao commitar `AGENTS.md`, `trilha-engenharia-ia.md`, `projetos-portfolio-ia.md`, `docs/decisoes-mvp-studyops.md` ou `docs/decisions/`.
- Nao implementar Supabase neste incremento.
- Usar IDs opacos e nao hierarquicos: `FUN-000001`, `STEP-000001`, `TASK-000001`, `PROJ-000001`, `EVID-000001`.
- Executar `npm run content:validate`, `npm run lint` e `npm run build` antes de concluir.

---

### Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nenhum codigo anterior.
- Produces: scripts `dev`, `lint`, `build`, `content:validate`, `content:create`.

- [ ] **Step 1: Gerar scaffold**

Run:

```bash
npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected: arquivos de Next.js criados no diretorio atual sem alterar documentos ignorados.

- [ ] **Step 2: Ajustar scripts do package.json**

Ensure:

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "npm run content:validate",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "content:validate": "tsx scripts/content.ts validate",
    "content:create": "tsx scripts/content.ts create"
  }
}
```

- [ ] **Step 3: Commit**

Run:

```bash
git add .gitignore package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs src
git commit -m "feat: scaffold next app"
```

Expected: commit criado sem documentos locais ignorados.

### Task 2: Content Base

**Files:**
- Create: `content/.registry/ids.json`
- Create: `content/fundamentos/hash-table.md`
- Create: `content/tasks/hash-table/implementar-hashmap.md`
- Create: `content/summaries/.gitkeep`

**Interfaces:**
- Consumes: convencao de IDs opacos.
- Produces: conteudo inicial para validacao e futura leitura pela app.

- [ ] **Step 1: Criar registry inicial**

Create `content/.registry/ids.json`:

```json
{
  "version": 1,
  "issued": {
    "fundamentos": ["FUN-000001"],
    "steps": ["STEP-000001", "STEP-000002"],
    "tasks": ["TASK-000001"],
    "projects": [],
    "evidence": []
  },
  "deprecated": {}
}
```

- [ ] **Step 2: Criar fundamento inicial**

Create `content/fundamentos/hash-table.md` with frontmatter containing
`FUN-000001`, `STEP-000001` and `STEP-000002`.

- [ ] **Step 3: Criar tarefa inicial**

Create `content/tasks/hash-table/implementar-hashmap.md` with frontmatter
linking `TASK-000001` to `FUN-000001` and `STEP-000002`.

- [ ] **Step 4: Commit**

Run:

```bash
git add content
git commit -m "feat: add initial content base"
```

Expected: conteudo base versionado.

### Task 3: Content Script

**Files:**
- Create: `scripts/content.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `content/.registry/ids.json`, Markdown frontmatter em `content/fundamentos` e `content/tasks`.
- Produces: comandos `npm run content:validate` e `npm run content:create -- <entity> ...`.

- [ ] **Step 1: Instalar dependencias**

Run:

```bash
npm install gray-matter tsx
```

Expected: `gray-matter` em dependencies e `tsx` em dependencies ou devDependencies.

- [ ] **Step 2: Escrever teste manual vermelho**

Run before creating `scripts/content.ts`:

```bash
npm run content:validate
```

Expected: falha porque `scripts/content.ts` ainda nao existe.

- [ ] **Step 3: Implementar script**

Implement `scripts/content.ts` with:

```ts
type Entity = "fundamento" | "task";

function validateContent(): void;
function createContent(args: string[]): void;
```

Required behavior:

- `validate` exits with code `0` for current content.
- `validate` exits with code `1` and clear messages for malformed registry, duplicate IDs, missing frontmatter fields, orphan tasks or IDs not present in registry.
- `create fundamento "Titulo"` allocates next `FUN-*` and seven `STEP-*` IDs, writes a Markdown file and updates registry.
- `create task FUN-000001 STEP-000001 "Titulo"` allocates next `TASK-*`, writes a Markdown file under the related fundamento slug folder and updates registry.

- [ ] **Step 4: Verificar**

Run:

```bash
npm run content:validate
npm run lint
npm run build
```

Expected: all commands pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json package-lock.json scripts/content.ts
git commit -m "feat: add content tooling"
```

Expected: script versionado e validado.
