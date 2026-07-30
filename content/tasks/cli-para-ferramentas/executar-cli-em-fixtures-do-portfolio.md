---
id: TASK-000035
fundamento_id: FUN-000006
etapa_id: STEP-000018
title: Executar CLI em fixtures do portfolio
slug: executar-cli-em-fixtures-do-portfolio
status: a_fazer
order: 35
goal: Validar a CLI contra exemplos do portfolio para aproximar o exercicio de um fluxo real de estudo.
expected_evidence:
  - exemplo_reproduzivel
---

# Executar CLI em fixtures do portfolio

Uma fixture torna o estudo repetivel. Em vez de testar com arquivos que mudam
sem registro, crie entradas pequenas que qualquer pessoa consiga baixar, ler e
executar novamente.

## Fontes usadas

- `projetos-portfolio-ia.md`, `Projeto central: Local Research Searcher`, MVP
  de notas e links.
- `trilha-engenharia-ia.md`, `Bloco 1`, projeto de CLI para indexar documentos
  locais.
- [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan), em `jwasham/coding-interview-university/README.md`, usado
  para praticar com entradas conhecidas e revisar o resultado.

## Fixtures sugeridas

`fixtures/nota-01.md`:

```md
# Hash table

Uma estrutura pode organizar acesso por chave.
```

`fixtures/nota-02.md`:

```md
# CLI

Entrada, processamento e saida formam um contrato.
```

`fixtures/nota-03.txt`:

```txt
Uma nota TXT tambem pode entrar no pipeline.
```

Ao executar as tres entradas, registre o caminho, formato, quantidade de linhas
e qualquer diferenca de comportamento entre Markdown e TXT.

## Experimento guiado

```bash
studyops-ingest fixtures/nota-01.md --format json
studyops-ingest fixtures/nota-02.md --format json
studyops-ingest fixtures/nota-03.txt --format text
```

Repita os comandos sem alterar as fixtures. Se a saida mudar, investigue se a
causa foi ordem, timestamp, caminho absoluto ou outra informacao que nao
deveria estar no resultado minimo.

## Perguntas de revisao

1. Qual parte da saida prova que a fonte foi preservada?
2. O que aconteceria se uma fixture tivesse uma linha vazia?
3. O resultado pode ser comparado por texto exato? Se nao, por que?
4. Qual fixture deveria virar caso de teste permanente?

## Resultado esperado

- Tres fixtures versionadas.
- Comandos documentados e repetidos com a mesma entrada.
- Saidas registradas e uma observacao sobre o comportamento de cada formato.
