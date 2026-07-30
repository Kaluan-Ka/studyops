---
id: TASK-000053
fundamento_id: FUN-000009
etapa_id: STEP-000027
title: Ingerir notas do Local Research Searcher
slug: ingerir-notas-do-local-research-searcher
status: a_fazer
order: 53
goal: Aplicar a ingestao em notas reais do projeto central para gerar evidencia de portfolio.
expected_evidence:
  - exemplo_reproduzivel
---

# Ingerir notas do Local Research Searcher

Use notas reais de estudo como entrada. A aplicacao torna o fundamento
relevante: o pipeline precisa preservar contexto suficiente para uma busca
futura, sem ainda implementar a busca.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto central: Local Research Searcher`, MVP.
- `trilha-engenharia-ia.md`, projeto central e fluxo de estudo.
- `content/fundamentos/pipeline-de-ingestao.md`, registro e chunking.

## Conjunto de estudo

Escolha tres notas curtas com assuntos diferentes. Para cada uma, registre:

```txt
source: caminho original
format: txt ou markdown
title: titulo extraido ou informado
chunks: quantidade gerada
```

Depois abra dois chunks e responda: ainda e possivel saber de qual nota vieram
e em que ordem estavam?

## Roteiro de aplicacao

1. Selecione tres notas versionadas.
2. Rode a CLI ou funcao de ingestao.
3. Salve a saida JSON.
4. Revise manualmente dois registros por nota.
5. Anote uma melhoria de qualidade antes de adicionar busca.

## Perguntas de revisao

1. O chunk continua compreensivel fora da nota inteira?
2. Qual metadado faltou?
3. A regra de divisao tratou os tres formatos da mesma maneira?
4. Que caso deveria virar fixture permanente?

## Resultado esperado

- Conjunto pequeno de notas versionadas.
- Registros de saida reproduziveis.
- Nota sobre uma melhoria necessaria antes da busca.
