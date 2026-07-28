---
id: TASK-000042
fundamento_id: FUN-000007
etapa_id: STEP-000021
title: Registrar decisao de escopo da API
slug: registrar-decisao-de-escopo-da-api
status: a_fazer
order: 42
expected_evidence:
  - nota_markdown
---

# Registrar decisao de escopo da API

Uma nota de arquitetura deve explicar por que a API e pequena agora e como ela
poderia evoluir. Use o formato abaixo em vez de escrever apenas "API pronta".

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto central: Local Research Searcher`, MVP e
  evolucoes.
- [`How to approach a system design interview question`](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question), em `donnemartin/system-design-primer/README.md`, especialmente escopo, restricoes e gargalos.

## Template preenchido

```md
## Componentes
- cliente curl ou CLI
- servidor HTTP local
- adaptador de notas em memoria

## Fluxo
GET /notes/:id -> validacao -> adaptador -> resposta JSON

## Decisao
Manter o endpoint local e sincrono para provar o contrato.

## Fora do escopo
Autenticacao, banco, busca semantica e processamento assincrono.

## Proxima evolucao
Trocar o adaptador por uma camada de armazenamento sem alterar o contrato.
```

## Perguntas de revisao

1. Qual componente e substituivel?
2. Que restricao justifica nao usar banco ainda?
3. Qual gargalo apareceria se as notas crescessem?
4. Que evidencia seria necessaria antes de mudar a arquitetura?

## Resultado esperado

- Decisao com escopo atual e duas evolucoes futuras.
- Componentes e fluxo documentados.
- Nenhuma dependencia de autenticacao, Supabase ou modelo externo.
