---
id: FUN-000009
title: Pipeline de ingestao
slug: pipeline-de-ingestao
status: a_estudar
order: 4
summary: Fluxo explicito para receber documentos, extrair texto, criar chunks e preservar fonte e metadados.
steps:
  - id: STEP-000025
    title: Mapear as etapas da ingestao
    order: 1
    expected_evidence:
      - nota_markdown
  - id: STEP-000026
    title: Implementar ingestao local minima
    order: 2
    expected_evidence:
      - teste_automatizado
      - exemplo_reproduzivel
  - id: STEP-000027
    title: Aplicar a ingestao no portfolio
    order: 3
    expected_evidence:
      - exemplo_reproduzivel
      - nota_markdown
---

# Pipeline de ingestao

## O que voce vai aprender

Ingestao e o processo de transformar uma fonte bruta em registros que outro
componente consegue usar. Para o StudyOps, isso significa pegar TXT ou
Markdown, extrair seu texto, dividir em trechos e preservar a origem para que
uma busca futura possa explicar de onde veio cada resultado.

O pipeline e mais do que uma funcao que "le arquivo": ele define etapas,
contratos intermediarios, falhas e rastreabilidade.

## Modelo mental

```txt
arquivo recebido
      |
      v
validar formato e origem
      |
      v
extrair texto
      |
      v
normalizar e dividir em chunks
      |
      v
anexar fonte e metadados
      |
      v
salvar ou entregar registros
```

Cada etapa deve ter uma entrada e uma saida que possam ser observadas. Se a
saida final estiver errada, o estudo deve conseguir descobrir se o problema
foi leitura, transformacao, chunking ou persistencia.

## Registro minimo

Um chunk nao deve ser apenas uma string solta. Um formato minimo pode ser:

```json
{
  "source": "notas/cli.md",
  "chunk_index": 0,
  "content": "Uma CLI e um contrato entre entrada e saida.",
  "metadata": {
    "format": "markdown",
    "title": "CLI"
  }
}
```

`source` permite voltar a origem; `chunk_index` preserva a ordem; `content` e o
texto usado pela proxima etapa; `metadata` guarda contexto que nao deveria ser
perdido durante a transformacao.

## Chunking didatico

O chunking divide o texto em unidades menores. No primeiro ciclo, use uma regra
simples e explique-a: por exemplo, agrupar linhas ate um limite de caracteres
ou separar por secoes Markdown. Uma regra simples e melhor que uma regra
sofisticada que nao pode ser testada.

Exemplo:

```txt
entrada: 3 paragrafos
regra: no maximo 80 caracteres por chunk
saida: chunk 0, chunk 1, chunk 2, cada um com source e indice
```

O limite nao e uma verdade universal. Ele e uma decisao experimental que deve
ser comparada com as necessidades do projeto.

## Exemplo guiado em TypeScript

```ts
type Chunk = {
  source: string;
  chunkIndex: number;
  content: string;
  metadata: { format: "txt" | "markdown" };
};

export function chunkText(
  source: string,
  content: string,
  maxChars: number,
  format: "txt" | "markdown",
): Chunk[] {
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);

  return paragraphs.map((paragraph, chunkIndex) => ({
    source,
    chunkIndex,
    content: paragraph.slice(0, maxChars),
    metadata: { format },
  }));
}
```

Este exemplo e deliberadamente incompleto: cortar um paragrafo no meio pode
perder informacao. A tarefa e perceber a limitacao, criar um teste para ela e
escolher a proxima melhoria com evidencia, em vez de esconder a decisao.

## Sincrono ou assincrono

O [`system-design-primer`](https://github.com/donnemartin/system-design-primer#asynchronism) descreve filas e [`task queues`](https://github.com/donnemartin/system-design-primer#task-queues) como formas de tirar
trabalho demorado do caminho da requisicao. No StudyOps, a ordem didatica e:

1. implementar e medir o fluxo sincrono local;
2. identificar onde o tempo ou volume bloqueia;
3. desenhar a mensagem e o estado do trabalho;
4. somente entao comparar um worker.

Adicionar uma fila antes de conhecer o trabalho que ela desacopla cria estados
e falhas que o MVP ainda nao consegue observar.

## O que foi extraido das fontes

- O `Projeto 3: Sistema de ingestao de documentos` em
  `projetos-portfolio-ia.md` fornece o fluxo concreto: receber TXT/Markdown,
  extrair texto, quebrar em chunks e salvar fonte/metadados.
- O projeto central `Local Research Searcher` no mesmo arquivo fornece o uso
  posterior: notas e links precisam virar registros pesquisaveis.
- As secoes [`Asynchronism > Message queues`](https://github.com/donnemartin/system-design-primer#message-queues) e [`Task queues`](https://github.com/donnemartin/system-design-primer#task-queues) do
  `donnemartin/system-design-primer/README.md` foram usadas para explicar
  quando worker e fila aparecem, inclusive o custo de desacoplar trabalho.
- As secoes [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads), [`Testing`](https://github.com/jwasham/coding-interview-university#testing) e [`String searching & manipulations`](https://github.com/jwasham/coding-interview-university#string-searching--manipulations) do `jwasham/coding-interview-university/README.md` foram
  conectadas a execucao, texto e verificacao, sem transformar o bloco em uma
  trilha completa de sistemas operacionais ou algoritmos.

## Erros comuns

- Perder a fonte ao salvar somente o texto do chunk.
- Criar chunks sem preservar a ordem.
- Misturar leitura, parsing, chunking e persistencia numa funcao impossivel de
  testar por partes.
- Aceitar arquivo invalido como se fosse vazio.
- Adicionar fila antes de ter uma versao sincrona observavel.

## Perguntas de revisao

1. Quais sao as entradas e saidas de cada etapa?
2. Por que `source` e `chunk_index` precisam acompanhar o conteudo?
3. Qual limitacao existe no exemplo de `slice`?
4. Que evidencia justificaria trocar fluxo sincrono por worker?
5. O que pode ser testado antes de salvar em um banco?

## Onde aparece no portfolio

O pipeline e o nucleo do sistema de ingestao e a ponte entre notas/links e o
`Local Research Searcher`. Ele prepara o terreno para busca textual, embeddings
e citacao de fontes, mas nenhum desses itens e requisito deste primeiro ciclo.

## Metodo de estudo

1. Desenhe o fluxo com uma entrada pequena.
2. Defina o registro intermediario.
3. Implemente leitura e transformacao de forma sincrona.
4. Teste arquivo vazio, invalido e preservacao da fonte.
5. Compare o fluxo com a alternativa de fila e worker.

Faça a comparação com um arquivo pequeno e repita o mesmo caso. A pergunta
não é qual desenho parece mais moderno; é onde a execução observada fica
difícil de manter, repetir ou recuperar. Se o fluxo síncrono ainda cabe em um
comando local e preserva a fonte, a decisão correta para o MVP pode ser não
adicionar uma fila.

## Proxima aplicacao

Ingerir tres notas de estudo e produzir registros com conteudo, fonte, ordem e
metadados. A evidencia sera uma saida versionada e uma nota sobre a qualidade
dos chunks.
