---
id: TASK-000036
fundamento_id: FUN-000006
etapa_id: STEP-000018
title: Documentar limitacoes da CLI
slug: documentar-limitacoes-da-cli
status: a_fazer
order: 36
expected_evidence:
  - nota_markdown
  - readme_atualizado
---

# Documentar limitacoes da CLI

Uma implementacao pequena fica mais util quando suas fronteiras sao explicitas.
Documentar limitacoes nao e diminuir o projeto; e dizer exatamente o que a
evidencia atual prova e o que ainda nao prova.

## Fontes usadas

- [`How to use it`](https://github.com/jwasham/coding-interview-university#how-to-use-it) e [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan), em `jwasham/coding-interview-university/README.md`, usados para registrar progresso praticado em vez de consumo de links.
- `projetos-portfolio-ia.md`, `Criterios de qualidade para todos os projetos`,
  usados para exigir limitacoes e proximas evolucoes.
- `trilha-engenharia-ia.md`, `Criterio de sucesso`, usado para conectar estudo
  a artefato concreto.

## Como escrever a nota

Use quatro blocos:

```md
## Implementado
- Le um arquivo local TXT ou Markdown.
- Aceita o formato text ou json.
- Testa pelo menos um caso de erro.

## Ainda nao implementado
- Diretorios e processamento em lote.
- Arquivos PDF ou formatos nao previstos.
- Persistencia e indexacao.

## O que a evidencia prova
- O contrato local e executavel com tres fixtures.
- A saida e reproduzivel para as entradas conhecidas.

## Proxima aplicacao
- Conectar a saida ao pipeline de ingestao.
```

A frase "ainda nao implementado" e diferente de "nao funciona". A primeira e
uma decisao de escopo; a segunda exige uma investigacao ou teste para ser
afirmada.

## Roteiro de revisao

1. Compare a nota com o contrato da primeira tarefa.
2. Liste somente comportamentos exercitados pelas fixtures.
3. Separe evolucao desejada de requisito atual.
4. Escolha uma proxima aplicacao que reutilize a saida existente.
5. Atualize o README ou a nota de estudo com o comando reproduzivel.

## Perguntas de revisao

1. Qual afirmacao da nota tem teste associado?
2. Qual limitacao impede usar a CLI no pipeline seguinte?
3. Que novo requisito justificaria adicionar processamento de diretorio?
4. O que deve permanecer fora para evitar transformar o primeiro comando em
   uma ferramenta grande demais?

## Resultado esperado

- Nota com implementado, nao implementado, evidencia e proxima aplicacao.
- Pelo menos duas limitacoes reais, sem inventar problemas nao observados.
- README ou registro de estudo atualizado com o comando reproduzivel.
