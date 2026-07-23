# Lote de Fundamentos MVP Design

Data: 2026-07-23

## Objetivo

Preparar um lote pequeno e curado de conteudo versionado antes de ligar a UI ao
conteudo real em `content/`.

O lote deve conter 5 fundamentos centrais, cada um com 3 etapas e cada etapa
com 2 tarefas praticas. O resultado esperado e uma base suficiente para testar
a futura leitura real pela app sem ampliar o MVP para projetos, progresso ou
Supabase.

## Escopo

Entram neste incremento:

- enriquecer `Hash Table`, preservando os IDs ja emitidos;
- criar `Cache`, `Queue`, `Busca textual` e `Docker Compose`;
- manter cada fundamento com 3 etapas;
- criar 2 tarefas por etapa, totalizando 30 tarefas;
- atualizar `content/.registry/ids.json`;
- validar tudo com `npm run content:validate`.

Nao entram neste incremento:

- leitura real de `content/` pela UI;
- Supabase, autenticacao, progresso de usuario ou evidencias enviadas;
- alteracao em documentos locais de planejamento ignorados pelo Git;
- reescrita de documentos de referencia.

## Modelo Editorial

Cada fundamento segue tres etapas padronizadas:

1. Entender o conceito.
2. Implementar o mecanismo minimo.
3. Aplicar em contexto de IA.

Cada etapa possui duas tarefas pequenas, com resultado esperado verificavel. As
evidencias devem usar termos simples ja aceitos pelo conteudo atual, como
`nota_markdown`, `teste_automatizado`, `benchmark_simples`,
`exemplo_reproduzivel` e `docker_compose`.

## Fundamentos

`Hash Table` cobre chaves, colisoes, complexidade esperada, implementacao
minima e uso como indice para dados de estudo ou busca.

`Cache` cobre hit/miss, TTL, invalidacao, memoizacao e cache simples para
respostas ou resultados de chamadas caras.

`Queue` cobre produtor/consumidor, processamento assincrono, retry, controle de
falha e worker local para tarefas demoradas.

`Busca textual` cobre tokenizacao, normalizacao, indice invertido, ranking
simples e avaliacao manual de resultados.

`Docker Compose` cobre servicos locais, variaveis, volumes, healthchecks e uma
stack minima reproduzivel para experimentos.

## IDs

IDs devem continuar opacos e sequenciais:

- fundamentos: `FUN-000001` a `FUN-000005`;
- etapas: `STEP-000001` a `STEP-000015`;
- tarefas: `TASK-000001` a `TASK-000030`.

`Hash Table` preserva `FUN-000001`, `STEP-000001`, `STEP-000002` e
`TASK-000001`. Os novos IDs completam a grade sem reaproveitar ou renomear IDs
ja emitidos.

## Verificacao

A validacao minima do incremento e:

```bash
npm run content:validate
```

Se o ambiente bloquear o `tsx` por IPC em `/tmp`, o mesmo comando deve ser
rodado fora do sandbox com aprovacao explicita.
