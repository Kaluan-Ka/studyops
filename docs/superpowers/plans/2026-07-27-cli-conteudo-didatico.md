# CLI para ferramentas — Conteudo Didatico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o fundamento CLI e suas seis tarefas em um modulo de estudo autocontido, com explicacao, exemplos e pratica guiada baseada no source map do Bloco 1.

**Architecture:** Manter o contrato atual de Markdown/frontmatter e os IDs existentes. O arquivo do fundamento vira a visao geral didatica; cada tarefa vira uma aula pratica curta com conceitos, exemplo, roteiro, revisao e evidencia. Nenhuma mudanca de schema ou UI entra neste piloto.

**Tech Stack:** Markdown, YAML frontmatter, exemplos TypeScript, `gray-matter` e `npm run content:validate`.

## Global Constraints

- Usar somente o fundamento `FUN-000006` e as tarefas `TASK-000031` a `TASK-000036` neste piloto.
- Preservar IDs, slugs, etapas e `expected_evidence` existentes.
- Incorporar explicacoes e exemplos no Markdown; nao exigir que o estudante abra o repositorio para entender o ciclo.
- Parafrasear as fontes; nao copiar trechos longos dos repositorios.
- Citar a secao precisa e explicar o que foi extraido de cada fonte.
- Manter o escopo em CLI, arquivos locais, entrada/saida, erros e evidencias; nao incluir APIs, banco, cache ou Docker.

---

### Task 1: Reescrever o fundamento como capitulo de estudo

**Files:**
- Modify: `content/fundamentos/cli-para-ferramentas.md`
- Reference: `docs/curadoria/2026-07-27-bloco-1-source-map.md`

**Interfaces:**
- Consumes: `FUN-000006`, steps `STEP-000016` a `STEP-000018` e claims aprovados do source map.
- Produces: explicacao autocontida, exemplo TypeScript, perguntas de revisao e mapa explicito de fontes.

- [ ] **Step 1: Escrever o modelo mental**
  - Explicar CLI como contrato entre argumentos, leitura, processamento, stdout, stderr e codigo de retorno.
  - Diferenciar argumento posicional, opcao e erro de entrada.
- [ ] **Step 2: Adicionar exemplo guiado**
  - Mostrar um comando de leitura de arquivo com entrada, transformacao e saida deterministica.
  - Incluir um trecho curto de TypeScript e explicar cada parte.
- [ ] **Step 3: Adicionar aplicacao e revisao**
  - Conectar o exemplo ao pipeline de notas do `Local Research Searcher`.
  - Incluir erros comuns, perguntas de revisao e proxima aplicacao.
- [ ] **Step 4: Explicitar as fontes**
  - Para cada fonte, registrar a ideia extraida, a adaptacao feita e o limite da evidencia.

### Task 2: Transformar as tarefas de entendimento em aulas

**Files:**
- Modify: `content/tasks/cli-para-ferramentas/definir-contrato-de-entrada-e-saida.md`
- Modify: `content/tasks/cli-para-ferramentas/selecionar-guia-build-your-own-cli.md`

**Interfaces:**
- Consumes: `STEP-000016` e os links/anchors do source map.
- Produces: duas aulas com conceitos, exemplos de contrato, leitura guiada e perguntas.

- [ ] **Step 1: Ensinar o contrato de entrada/saida**
  - Fornecer uma tabela preenchida para `studyops-ingest notes/ --format json`.
  - Explicar o caso feliz e dois casos invalidos.
- [ ] **Step 2: Ensinar como ler uma referencia build-your-own**
  - Explicar que `build-your-own-x` e um mapa de guias, nao uma API para copiar.
  - Fornecer um roteiro de extracao: objetivo, menor mecanismo, evidencia e limitacao.
- [ ] **Step 3: Adicionar revisao e evidencia**
  - Incluir perguntas com respostas esperadas e o formato da nota final.

### Task 3: Transformar implementacao e teste em pratica guiada

**Files:**
- Modify: `content/tasks/cli-para-ferramentas/implementar-cli-de-leitura-local.md`
- Modify: `content/tasks/cli-para-ferramentas/testar-argumento-invalido.md`

**Interfaces:**
- Consumes: `STEP-000017`, contrato definido na Task 2 e exemplos do fundamento.
- Produces: roteiro de implementacao, casos de teste e criterios de diagnostico.

- [ ] **Step 1: Fornecer o menor fluxo implementavel**
  - Definir `parseArgs`, `readInput` e `run` como separacoes conceituais.
  - Mostrar uma implementacao curta ou pseudocodigo TypeScript.
- [ ] **Step 2: Ensinar falhas de entrada**
  - Explicar caminho ausente, formato nao suportado e argumento incompleto.
  - Mostrar entradas e saidas esperadas para cada falha.
- [ ] **Step 3: Conectar ao teste**
  - Propor testes unitarios da logica e um teste de processo somente para o contrato externo.
  - Incluir perguntas sobre stdout, stderr e codigo de retorno.

### Task 4: Transformar aplicacao e documentacao em laboratorio

**Files:**
- Modify: `content/tasks/cli-para-ferramentas/executar-cli-em-fixtures-do-portfolio.md`
- Modify: `content/tasks/cli-para-ferramentas/documentar-limitacoes-da-cli.md`

**Interfaces:**
- Consumes: `STEP-000018`, CLI implementada e fixtures do portfolio.
- Produces: experimento reproduzivel, nota de resultado e proximo passo.

- [ ] **Step 1: Fornecer fixtures de estudo**
  - Incluir tres arquivos pequenos de exemplo e o resultado esperado do comando.
  - Explicar por que fixtures tornam o estudo reproduzivel.
- [ ] **Step 2: Ensinar a leitura do resultado**
  - Pedir comparacao entre entrada, saida e erro.
  - Incluir perguntas para identificar comportamento ainda nao coberto.
- [ ] **Step 3: Fornecer template de limitacoes**
  - Separar o que foi implementado, o que nao foi testado e qual proxima aplicacao faz sentido.

### Task 5: Validar o piloto

**Files:**
- Inspect: `content/fundamentos/cli-para-ferramentas.md`
- Inspect: `content/tasks/cli-para-ferramentas/*.md`
- Test: `npm run content:validate`

**Interfaces:**
- Consumes: todos os arquivos reescritos do piloto.
- Produces: lote valido sem perder IDs, fontes, evidencias ou estrutura 3 etapas/2 tarefas.

- [ ] **Step 1: Verificar secoes didaticas**
  - Confirmar que o fundamento contem explicacao, exemplo, perguntas e proxima aplicacao.
  - Confirmar que cada tarefa contem conceitos, roteiro, revisao e resultado esperado.
- [ ] **Step 2: Rodar validacao**
  - Executar `npm run content:validate` fora do sandbox se o IPC do `tsx` voltar a falhar.
- [ ] **Step 3: Conferir escopo**
  - Confirmar que o piloto nao introduziu API, banco, cache, Docker ou servico externo.
