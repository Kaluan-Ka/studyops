---
id: TASK-000033
fundamento_id: FUN-000006
etapa_id: STEP-000017
title: Implementar CLI de leitura local
slug: implementar-cli-de-leitura-local
status: a_fazer
order: 33
goal: Construir o menor comando que le um arquivo local e transforma entrada real em saida verificavel.
expected_evidence:
  - teste_automatizado
  - exemplo_reproduzivel
---

# Implementar CLI de leitura local

Agora transforme o contrato em um programa pequeno. O foco nao e criar uma
ferramenta pronta para distribuicao; e separar entrada externa, logica de
processamento e saida para que cada parte possa ser entendida e testada.

## Fontes usadas

- `trilha-engenharia-ia.md`, projeto de CLI para processar arquivos locais.
- `projetos-portfolio-ia.md`, `Projeto 3: Sistema de ingestao de documentos`,
  MVP de receber TXT e Markdown.
- [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan), em `jwasham/coding-interview-university/README.md`, usado
  para implementar antes de ampliar o escopo.

## Conceito explicado

O caminho minimo pode ser dividido em tres funcoes conceituais:

```txt
argv -> parseArgs -> opcoes validas
arquivo -> readInput -> texto
texto + opcoes -> run -> saida
```

Se `run` depende diretamente de `process.argv` e do disco, o teste precisa
iniciar o processo inteiro para verificar uma regra simples. Separar as
fronteiras permite testar primeiro a transformacao e depois apenas um caso de
integracao da CLI.

## Implementacao minima

```ts
type Options = { inputPath: string; format: "text" | "json" };

export function parseArgs(argv: string[]): Options {
  const [inputPath, flag, value] = argv;

  if (!inputPath) throw new Error("arquivo obrigatorio");
  if (flag && flag !== "--format") throw new Error(`opcao invalida: ${flag}`);

  const format = value ?? "text";
  if (format !== "text" && format !== "json") {
    throw new Error(`formato invalido: ${format}`);
  }

  return { inputPath, format };
}

export function run(input: string, options: Options): string {
  const lineCount = input.split(/\r?\n/).filter(Boolean).length;
  return options.format === "json"
    ? JSON.stringify({ source: options.inputPath, lineCount })
    : `${options.inputPath}: ${lineCount} linhas`;
}
```

O adaptador de terminal fica responsavel por ler o arquivo e chamar essas
funcoes. A regra importante e que `run` nao precisa saber de `process.argv`.

## Roteiro de implementacao

1. Crie uma fixture TXT com tres linhas.
2. Implemente `parseArgs` e teste o contrato.
3. Implemente `run` para os formatos `text` e `json`.
4. Adicione a leitura do arquivo no entrypoint.
5. Execute duas vezes e compare as saidas.
6. Registre o que ainda nao entra: diretorios, PDF, encoding alternativo ou
   indexacao.

## Perguntas de revisao

1. Por que `run` recebe `input` em vez de abrir o arquivo diretamente?
2. O que muda entre uma falha de parsing e uma falha de leitura?
3. Qual teste prova a saida JSON sem iniciar o terminal?
4. O que torna o resultado deterministico neste exemplo?

## Resultado esperado

- Comando executavel com fixture local.
- Teste da logica para os dois formatos.
- Exemplo reproduzivel no README ou nota de estudo.
