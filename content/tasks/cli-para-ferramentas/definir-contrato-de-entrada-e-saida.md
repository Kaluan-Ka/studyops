---
id: TASK-000031
fundamento_id: FUN-000006
etapa_id: STEP-000016
title: Definir contrato de entrada e saida
slug: definir-contrato-de-entrada-e-saida
status: a_fazer
order: 31
goal: Entender que uma CLI confiavel comeca por um contrato observavel antes da implementacao.
expected_evidence:
  - nota_markdown
---

# Definir contrato de entrada e saida

Antes de implementar uma CLI, descreva a interface como se outra pessoa fosse
chama-la por script. O objetivo desta aula e transformar uma ideia vaga —
"processar notas" — em uma operacao observavel.

## Fontes usadas

- `trilha-engenharia-ia.md`, `Bloco 1: Ferramentas para empacotar IA`, item
  `CLI tools`.
- [`Build your own Command-Line Tool`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool), em `codecrafters-io/build-your-own-x/README.md`, usada como metodo de construir o menor mecanismo.
- [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan), em `jwasham/coding-interview-university/README.md`, usado
  para transformar o conceito em implementacao e teste.

## Conceito explicado

Uma interface boa define o que entra e o que sai sem expor como o programa foi
implementado. Para o primeiro exercicio, use este contrato:

```txt
comando: studyops-ingest <arquivo> [--format text|json]
entrada principal: caminho de um arquivo TXT ou Markdown
saida text: caminho + quantidade de linhas
saida json: objeto com source e lineCount
falha: mensagem em stderr e codigo de retorno diferente de zero
```

O contrato separa tres tipos de informacao:

- dado do trabalho: o caminho do arquivo;
- configuracao: o formato pedido;
- diagnostico: argumento ausente, formato invalido ou arquivo inacessivel.

## Exemplo guiado

Para a fixture:

```md
# Minha nota

Uma ideia sobre processamento local.
```

o caso feliz pode ser:

```bash
studyops-ingest notas/minha-nota.md --format json
```

```json
{"source":"notas/minha-nota.md","lineCount":3}
```

Um caso de erro e:

```bash
studyops-ingest --format json
```

Esse comando nao recebeu o argumento posicional `arquivo`. A falha deve ser
explicita; nao deve ser interpretada como uma pasta padrao.

## Roteiro de estudo

1. Escolha uma unica operacao: ler um arquivo.
2. Escreva o comando completo em uma linha.
3. Liste o caso feliz e dois erros.
4. Defina a saida antes de escolher a biblioteca de CLI.
5. Explique como um script saberia que a operacao falhou.

## Perguntas de revisao

1. Qual parte do comando e argumento e qual parte e opcao?
2. O que deve ir para `stderr` em vez de `stdout`?
3. Por que uma saida JSON pode ser melhor que uma frase para a proxima etapa?
4. O que o contrato ainda nao diz sobre o conteudo do arquivo?

## Resultado esperado

- Uma nota com a tabela de entrada, opcao, saida e falha.
- Um exemplo valido e dois exemplos invalidos.
- Uma decisao sobre o formato de saida e o codigo de retorno.
