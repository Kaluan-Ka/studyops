---
id: TASK-000056
fundamento_id: FUN-000010
etapa_id: STEP-000028
title: Definir matriz de evidencias
slug: definir-matriz-de-evidencias
status: a_fazer
order: 56
expected_evidence:
  - nota_markdown
---

# Definir matriz de evidencias

Converta cada objetivo de estudo em uma prova observavel. A matriz impede que
o ciclo termine com apenas a frase "estudei o assunto".

## Fontes usadas

- `trilha-engenharia-ia.md`, `Metodo semanal` e `Criterio de sucesso`.
- `AGENTS.md`, `Regras para registrar progresso`.
- `projetos-portfolio-ia.md`, ciclo semanal e criterios de qualidade.

## Exemplo preenchido

| Objetivo | Pergunta | Evidencia |
| --- | --- | --- |
| entender CLI | entrada e saida estao claras? | nota + contrato |
| expor API | cliente sabe sucesso e falha? | chamada + teste |
| executar processo | erro chega separado? | stdout/stderr + code |
| ingerir nota | fonte sobrevive ao chunk? | JSON + teste |

Uma evidencia boa possui entrada, resultado e interpretacao. O link da fonte
mostra de onde veio o estudo; o teste ou experimento mostra o que foi feito.

## Roteiro de estudo

1. Liste quatro objetivos do Bloco 1.
2. Escreva uma pergunta para cada um.
3. Escolha o menor artefato que responde a pergunta.
4. Execute ou produza o artefato.
5. Registre limitacao e proximo passo.

## Perguntas de revisao

1. Qual diferenca existe entre fonte e evidencia?
2. O resultado pode ser revisado por outra pessoa?
3. Que atividade nao prova entendimento sozinha?
4. Como a matriz ajuda a escolher a proxima tarefa?

## Resultado esperado

- Uma linha por objetivo do ciclo.
- Evidencia escolhida antes da implementacao.
- Regra explicita contra progresso baseado somente em leitura.
