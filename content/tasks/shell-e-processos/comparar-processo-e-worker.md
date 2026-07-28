---
id: TASK-000044
fundamento_id: FUN-000008
etapa_id: STEP-000022
title: Comparar processo principal e worker
slug: comparar-processo-principal-e-worker
status: a_fazer
order: 44
expected_evidence:
  - nota_markdown
---

# Comparar processo principal e worker

Compare dois desenhos para processar um documento: fazer tudo durante a
requisicao ou entregar o trabalho a outro processo.

## Fontes usadas

- [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads), em `jwasham/coding-interview-university/README.md`.
- [`Asynchronism`](https://github.com/donnemartin/system-design-primer#asynchronism), em `donnemartin/system-design-primer/README.md`.
- `projetos-portfolio-ia.md`, evolucao do sistema de ingestao com fila e worker.

## Comparacao guiada

| Criterio | Inline | Worker |
| --- | --- | --- |
| Resposta inicial | espera o processamento | pode responder que foi aceito |
| Estado necessario | pequeno | pendente/concluido/falhou |
| Falha | visivel na chamada | precisa ser registrada |
| Complexidade | menor | maior |
| Quando considerar | fixture pequena | trabalho demorado ou volumoso |

O [`system-design-primer`](https://github.com/donnemartin/system-design-primer#message-queues) explica que uma fila pode evitar bloquear a pessoa em
trabalho demorado, mas tambem adiciona atraso e complexidade. A decisao deve
ser baseada no comportamento observado.

## Perguntas de revisao

1. Qual estado novo aparece quando existe worker?
2. Como o cliente saberia que o trabalho terminou?
3. Que medida justificaria o desenho assincrono?
4. Por que o primeiro ciclo deve continuar local?

## Resultado esperado

- Comparacao entre fluxo sincrono e worker.
- Um custo ou risco registrado.
- Decisao de manter o exercicio local e sincrono.
