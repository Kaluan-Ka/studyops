---
id: TASK-000055
fundamento_id: FUN-000010
etapa_id: STEP-000028
title: Mapear niveis de teste
slug: mapear-niveis-de-teste
status: a_fazer
order: 55
expected_evidence:
  - nota_markdown
---

# Mapear niveis de teste

Escolha o nivel de verificacao pela fronteira que precisa ser provada, nao pelo
nome mais sofisticado.

## Fontes usadas

- [`Testing`](https://github.com/jwasham/coding-interview-university#testing), em `jwasham/coding-interview-university/README.md`.
- `projetos-portfolio-ia.md`, `Criterios de qualidade para todos os projetos`.
- `content/fundamentos/testes-e-evidencias.md`, unidade, integracao e fake.

## Mapa guiado

| Componente | Pergunta | Nivel inicial |
| --- | --- | --- |
| parser da CLI | argumentos viram opcoes validas? | unitario |
| endpoint | status e body respeitam contrato? | unitario + integracao |
| processo | stdout, stderr e code chegam completos? | processo |
| pipeline | source e ordem sao preservados? | unitario + aceite |

Mock ou fake entra quando uma dependencia externa impede testar a regra local.
Nao use mock para fingir que uma integracao real ja foi verificada.

## Roteiro de estudo

1. Escolha um componente.
2. Escreva a pergunta de verificacao.
3. Escolha entrada, resultado e nivel.
4. Liste a dependencia que pode ser substituida.
5. Registre o que ainda exige um teste de integracao.

## Perguntas de revisao

1. Qual comportamento o teste prova?
2. O teste precisa de disco, rede ou processo?
3. O que um fake esconderia?
4. Que teste ainda falta para o sistema completo?

## Resultado esperado

- Matriz com componente, comportamento e nivel de verificacao.
- Um caso em que mock ajudaria e um em que nao ajudaria.
- Nota sem exigir dependencia externa.
