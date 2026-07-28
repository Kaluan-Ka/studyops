---
id: FUN-000006
title: CLI para ferramentas
slug: cli-para-ferramentas
status: a_estudar
order: 1
summary: Interface local para transformar argumentos e arquivos em processamento reproduzivel, saida observavel e evidencia de portfolio.
steps:
  - id: STEP-000016
    title: Entender o contrato de uma CLI
    order: 1
    expected_evidence:
      - nota_markdown
  - id: STEP-000017
    title: Implementar um comando minimo
    order: 2
    expected_evidence:
      - teste_automatizado
      - exemplo_reproduzivel
  - id: STEP-000018
    title: Aplicar a CLI no portfolio
    order: 3
    expected_evidence:
      - exemplo_reproduzivel
      - nota_markdown
---

# CLI para ferramentas

## O que voce vai aprender

Uma CLI (command-line interface) e um contrato simples entre uma pessoa ou
outro programa e uma ferramenta. Ela recebe argumentos, le entradas, executa
um processamento e devolve uma saida que pode ser observada, testada e usada
por outro comando.

No StudyOps, CLI nao significa decorar uma biblioteca de parsing. Significa
aprender a transformar uma tarefa real — por exemplo, ler notas locais — em um
comando pequeno que outra pessoa consegue executar sem conhecer os detalhes
internos.

## Modelo mental

Pense em uma CLI como uma funcao que atravessa o limite do processo:

```txt
argumentos do terminal
        |
        v
validacao do contrato
        |
        v
leitura da entrada -> processamento -> saida
        |                    |
        +--> erro             +--> stdout
                              +--> stderr
                              +--> codigo de retorno
```

O contrato precisa responder cinco perguntas:

1. Qual entrada o comando recebe?
2. Quais opcoes alteram o comportamento?
3. O que aparece quando a entrada e valida?
4. Como o comando comunica uma falha?
5. Como outra ferramenta sabe se a operacao terminou bem?

Se essas respostas nao estao claras, a CLI ainda nao e uma interface confiavel,
mesmo que o codigo interno funcione.

## Vocabulário essencial

### Argumento posicional

Valor identificado pela posicao. Em `studyops-ingest notas/`, `notas/` e o
argumento que informa a entrada principal.

### Opcao ou flag

Valor nomeado que altera o comportamento. Em
`studyops-ingest notas/ --format json`, `--format json` pede uma representacao
especifica para a saida.

### stdin, stdout e stderr

- `stdin`: entrada que pode vir do terminal ou de outro processo.
- `stdout`: saida normal, destinada ao resultado do comando.
- `stderr`: diagnostico e erro, separado do resultado normal.

Separar resultado de diagnostico permite encadear a saida em outro comando sem
misturar mensagens para a pessoa que esta executando o processo.

### Codigo de retorno

Um valor curto que informa se o processo terminou como esperado. O texto do
erro ajuda a diagnosticar; o codigo permite que um script tome uma decisao sem
interpretar uma frase.

### Fixture

Entrada pequena e versionada usada para repetir um experimento. Uma fixture de
CLI deve ser curta o bastante para ser lida, mas real o bastante para revelar
um comportamento do programa.

## Exemplo guiado em TypeScript

O exemplo abaixo e uma adaptacao didatica para o StudyOps. Ele nao copia uma
implementacao de uma fonte externa; usa o principio de construir uma ferramenta
pequena e exercitavel.

```ts
type CliOptions = {
  inputPath: string;
  format: "text" | "json";
};

function parseArgs(argv: string[]): CliOptions {
  const [inputPath, formatFlag, formatValue] = argv;

  if (!inputPath) {
    throw new Error("uso: studyops-ingest <arquivo> [--format text|json]");
  }

  if (formatFlag && formatFlag !== "--format") {
    throw new Error(`opcao desconhecida: ${formatFlag}`);
  }

  const format = formatValue ?? "text";

  if (format !== "text" && format !== "json") {
    throw new Error(`formato invalido: ${format}`);
  }

  return { inputPath, format };
}

function run(input: string, options: CliOptions): string {
  const lines = input.split(/\r?\n/).filter(Boolean);
  const result = { source: options.inputPath, lineCount: lines.length };

  return options.format === "json"
    ? JSON.stringify(result)
    : `${result.source}: ${result.lineCount} linhas`;
}
```

O fluxo fica separado em duas responsabilidades:

- `parseArgs` transforma texto externo em opcoes validas ou falha cedo.
- `run` recebe dados ja validados e produz uma saida deterministica.

Essa separacao facilita testar a logica sem iniciar um processo de terminal.
Depois, um pequeno entrypoint pode capturar a excecao, escrever a mensagem em
`stderr` e encerrar com codigo diferente de zero.

## Exemplo de uso

Com uma fixture `notas/cli.md`:

```md
# CLI

Uma ferramenta local deve ter entrada e saida observaveis.
```

O comando:

```bash
studyops-ingest notas/cli.md --format json
```

pode produzir:

```json
{"source":"notas/cli.md","lineCount":3}
```

O valor desse exemplo nao esta em contar linhas como produto final. Ele esta
em tornar visivel o contrato: qual arquivo entrou, qual transformacao ocorreu
e em que formato a proxima etapa pode consumir a saida.

## O que foi extraido das fontes

- A secao [`Build your own Command-Line Tool`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-command-line-tool) do
  `codecrafters-io/build-your-own-x/README.md` foi usada para selecionar o
  formato de aprendizagem: escolher uma ferramenta pequena e reconstruir seu
  mecanismo minimo. Ela nao e tratada como documentacao de uma biblioteca.
- As secoes [`How to use it`](https://github.com/jwasham/coding-interview-university#how-to-use-it) e [`The Daily Plan`](https://github.com/jwasham/coding-interview-university#the-daily-plan) do
  `jwasham/coding-interview-university/README.md` foram convertidas em metodo:
  estudar uma parte em ordem, escrever uma implementacao propria e testar com
  entradas conhecidas.
- O item `CLI tools` de `trilha-engenharia-ia.md` define a aplicacao local:
  processar arquivos, rodar pipelines e automatizar tarefas.
- O `Projeto 3: Sistema de ingestao de documentos` de
  `projetos-portfolio-ia.md` fornece o contexto do arquivo TXT/Markdown que
  alimenta a proxima etapa.

## Erros comuns

- Colocar toda a logica dentro do parser de argumentos.
- Imprimir diagnostico em `stdout` e quebrar o resultado que outro comando
  espera consumir.
- Aceitar opcoes desconhecidas silenciosamente.
- Testar somente a funcao interna e nunca verificar o contrato do processo.
- Usar uma entrada enorme antes de conseguir explicar o caso minimo.

## Perguntas de revisao

1. Qual e a diferenca entre argumento posicional e opcao nomeada?
2. Por que `stdout` e `stderr` devem ser separados?
3. O que um codigo de retorno comunica que uma mensagem de erro nao comunica?
4. Qual parte do exemplo pode ser testada sem iniciar um processo?
5. Que mudanca faria a saida deixar de ser deterministica?

## Onde aparece no portfolio

O primeiro uso e uma CLI para ler notas TXT/Markdown e produzir registros que o
pipeline de ingestao possa consumir. Mais tarde, o mesmo contrato pode servir
para indexacao local, verificacao de fixtures e comandos de manutencao do
`Local Research Searcher`.

## Metodo de estudo

1. Leia o modelo mental e reescreva o fluxo com suas palavras.
2. Execute o exemplo com uma fixture de tres linhas.
3. Altere uma entrada de cada vez e observe stdout, stderr e codigo de retorno.
4. Implemente a menor versao do comando.
5. Registre o que o teste cobriu e o que ainda ficou fora.

Uma boa sessão não termina quando o comando imprime algo. Termine perguntando
se outra ferramenta conseguiria distinguir sucesso de falha sem ler uma frase
humana. Essa pergunta leva a uma evidência pequena: uma fixture, a saída
capturada e o código de retorno. Se a CLI for usada dentro de um pipeline, a
saída normal precisa permanecer estável; mensagens de contexto e diagnósticos
devem continuar em stderr.

## Proxima aplicacao

Implementar `studyops-ingest` para receber um arquivo local, validar a
extensao, contar ou extrair seu conteudo e produzir uma saida que preserve a
origem. O proximo fundamento usara a mesma operacao por HTTP, mas somente
depois que o contrato local estiver claro.
