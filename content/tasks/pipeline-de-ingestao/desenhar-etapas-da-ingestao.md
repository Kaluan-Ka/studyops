---
id: TASK-000049
fundamento_id: FUN-000009
etapa_id: STEP-000025
title: Desenhar etapas da ingestao
slug: desenhar-etapas-da-ingestao
status: a_fazer
order: 49
goal: Visualizar a ingestao como etapas explicitas antes de implementar processamento de documentos.
expected_evidence:
  - nota_markdown
---

# Desenhar etapas da ingestao

Desenhe o caminho de uma nota desde o arquivo ate o registro que outro
componente consumira.

## Fontes usadas

- `trilha-engenharia-ia.md`, projeto de ingestao que le arquivos, quebra em
  trechos e salva no banco.
- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  fluxo de exemplo.
- `content/fundamentos/pipeline-de-ingestao.md`, modelo mental do pipeline.

## Fluxo guiado

```txt
receber -> validar -> extrair -> dividir -> enriquecer -> persistir/entregar
```

Para uma entrada `notas/cli.md`, preencha:

| Etapa | Entrada | Saida |
| --- | --- | --- |
| validar | caminho | formato aceito + origem |
| extrair | arquivo | texto |
| dividir | texto | lista de trechos |
| enriquecer | trecho | chunk com source e indice |
| entregar | chunks | JSON ou registros |

## Roteiro de estudo

1. Desenhe as etapas em papel.
2. Preencha entradas e saidas.
3. Marque onde uma falha deve parar o fluxo.
4. Marque onde a fonte original e preservada.
5. Compare o desenho com o exemplo do portfolio.

## Perguntas de revisao

1. Por que validar antes de extrair?
2. Qual etapa pode ser testada isoladamente?
3. O que se perde se o indice do chunk nao for salvo?
4. Onde a persistencia entra e por que nao deve esconder as etapas anteriores?

## Resultado esperado

- Diagrama ou lista ordenada.
- Entrada e saida de cada etapa.
- Ponto em que a fonte original e preservada.
