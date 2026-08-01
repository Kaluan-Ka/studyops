# StudyOps

StudyOps e uma webapp pessoal para acompanhar a trilha de Engenharia de IA e
transformar estudo em evidencias de portfolio.

O MVP comeca pelos fundamentos: cada fundamento possui etapas, tarefas praticas
e evidencias esperadas. O conteudo curado fica versionado no repositorio em
Markdown/frontmatter; progresso, resolucoes e evidencias de usuario entram no
Supabase em uma etapa posterior.

## Stack

- Next.js App Router
- TypeScript
- Conteudo Markdown/frontmatter em `content/`
- Script Node/TypeScript para validacao e criacao de conteudo
- Supabase e Vercel planejados para os proximos incrementos

## Supabase local

A primeira fatia de progresso persistido usa o schema versionado em
`supabase/migrations/` e depende de variaveis publicas no ambiente local:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use apenas a publishable key no cliente. Nunca coloque service role ou secrets
em variaveis `NEXT_PUBLIC_`.

## Design

A home atual e a referencia canonica da identidade visual do StudyOps. Ela define
o produto como um Centro de Comando Orbital: mapa de fundamentos, briefing
operacional, territorios futuros apagados e cartas de missao.

Antes de criar ou redesenhar telas, use:

- `DESIGN.md`
- `docs/design/home-canonica.md`
- `src/app/page.tsx`
- `src/app/page.module.css`

## Scripts

```bash
npm run content:validate
npm run content:create -- fundamento "Hash Table"
npm run content:create -- task FUN-000001 STEP-000001 "Implementar hashmap"
npm run lint
npm run build
```

`npm run build` executa a validacao de conteudo antes do build.

## Conteudo

```txt
content/
  .registry/
    ids.json
  fundamentos/
  tasks/
  summaries/
```

IDs canonicos seguem o formato opaco definido para o MVP:

- `FUN-000001`
- `STEP-000001`
- `TASK-000001`
- `PROJ-000001`
- `EVID-000001`
