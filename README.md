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
