---
id: FUN-000008
title: Shell e processos
slug: shell-e-processos
status: a_estudar
order: 3
summary: Base para iniciar comandos, observar saida e falhas e separar trabalho local de processamento posterior.
steps:
  - id: STEP-000022
    title: Entender comando, processo e status
    order: 1
    expected_evidence:
      - nota_markdown
  - id: STEP-000023
    title: Implementar uma execucao minima
    order: 2
    expected_evidence:
      - teste_automatizado
      - exemplo_reproduzivel
  - id: STEP-000024
    title: Aplicar processos no portfolio
    order: 3
    expected_evidence:
      - exemplo_reproduzivel
      - nota_markdown
---

# Shell e processos

## O que voce vai aprender

O shell e uma interface para iniciar programas e combinar seus fluxos de
entrada e saida. Um processo e uma execucao concreta de um programa, com seus
recursos e estado. Estudar essa fronteira ajuda a entender por que uma CLI
falha, como um script chama outra ferramenta e quando um trabalho deve ser
separado do processo que recebeu a requisicao.

O escopo deste fundamento e pratico: comando, processo, stdout, stderr, codigo
de retorno e a diferenca entre fazer trabalho agora e entregar trabalho a um
worker. Nao e um curso completo de sistemas operacionais.

## Modelo mental

```txt
shell
  |
  | inicia
  v
processo filho
  |---- stdout: resultado
  |---- stderr: diagnostico
  |---- exit code: estado final
  v
shell decide: continuar, falhar ou tentar outra acao
```

Quando um comando e composto com outro, stdout pode virar stdin do proximo:

```bash
studyops-ingest notas/ --format json | jq '.lineCount'
```

Isso so funciona bem se a ferramenta mantiver resultado e diagnostico
separados.

## Processo, thread e worker

O [`coding-interview-university`](https://github.com/jwasham/coding-interview-university#processes-and-threads) separa processos e threads e chama atencao para
recursos, concorrencia, locks e mudanca de contexto. Para o StudyOps, a
pergunta inicial e mais simples:

- **Processo principal:** recebeu a chamada e controla o resultado imediato.
- **Processo filho ou worker:** executa trabalho separado, podendo ter outro
  tempo de vida ou outra politica de falha.
- **Thread:** unidade de execucao dentro de um processo, compartilhando parte
  dos recursos daquele processo.

Nao escolha worker apenas porque o fluxo parece moderno. Se o trabalho e curto,
separar pode adicionar mensagens, estados e falhas. Se o trabalho demora ou
precisa ser repetido sem bloquear a entrada, a separacao pode ser justificada.

## Exemplo guiado em TypeScript

O modulo `node:child_process` permite iniciar um processo local. O exemplo usa
`spawn` para observar stdout, stderr e encerramento:

```ts
import { spawn } from "node:child_process";

export function runCommand(command: string, args: string[]) {
  return new Promise<{ code: number | null; stdout: string; stderr: string }>(
    (resolve, reject) => {
      const child = spawn(command, args);
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.on("error", reject);
      child.on("close", (code) => resolve({ code, stdout, stderr }));
    },
  );
}
```

O resultado so e resolvido quando o processo fecha. Um consumidor pode aceitar
`code === 0` como sucesso e registrar `stderr` quando o codigo for diferente.
O exemplo tambem mostra uma fronteira: o processo filho tem seu proprio fluxo
de saida, mas o programa principal decide como interpretar o resultado.

## Exemplo de diagnostico

```bash
node scripts/run-command.mjs printf 'ok'
echo $?
```

O primeiro comando produz resultado; `echo $?` exibe o codigo do ultimo processo
no shell. Se o processo escrever erro em stderr ou terminar com codigo nao zero,
um pipeline pode interromper a proxima etapa em vez de salvar um resultado
parcial como se fosse valido.

## O que foi extraido das fontes

- A secao [`Build your own Shell`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-shell) do
  `codecrafters-io/build-your-own-x/README.md` foi usada para escolher o shell
  minimo como exercicio de fronteira entre comando e execucao.
- A secao [`Processes and Threads`](https://github.com/jwasham/coding-interview-university#processes-and-threads) do
  `jwasham/coding-interview-university/README.md` foi convertida em perguntas
  praticas sobre recursos, concorrencia e separacao de execucao; nao se afirma
  dominio de sistemas operacionais a partir de um unico exercicio.
- A secao [`Asynchronism`](https://github.com/donnemartin/system-design-primer#asynchronism) do
  `donnemartin/system-design-primer/README.md` fornece o criterio para
  comparar processamento inline com worker e reconhecer custo de filas.
- O projeto de ingestao em `projetos-portfolio-ia.md` define o caso de uso para
  o entrypoint local.

## Erros comuns

- Ignorar stderr e tentar interpretar toda saida como resultado.
- Resolver a Promise no primeiro evento de dados em vez de esperar o processo
  encerrar.
- Misturar comando do shell diretamente com texto nao validado.
- Criar worker antes de medir se o processamento realmente bloqueia o fluxo.
- Tratar qualquer codigo diferente de zero como detalhe irrelevante.

## Perguntas de revisao

1. Qual e a diferenca entre shell e processo?
2. Quando stdout pode ser conectado a stdin de outro comando?
3. O que o codigo de retorno informa?
4. Por que o worker pode aumentar a complexidade?
5. Qual parte do exemplo deve ser testada sem iniciar um processo real?

## Onde aparece no portfolio

Nos comandos que executam ingestao e indexacao local. A separacao entre
receber um documento e processa-lo prepara a evolucao para fila e worker, mas o
MVP permanece sincrono e reproduzivel.

## Metodo de estudo

1. Execute um comando de sucesso e um de falha.
2. Capture stdout, stderr e codigo de retorno.
3. Escreva uma funcao que represente a fronteira de execucao.
4. Compare trabalho inline com trabalho em processo separado.
5. Registre o que justificaria um worker futuro.

O experimento deve separar duas decisões que costumam ser confundidas: como
iniciar um comando e como organizar trabalho demorado. Capturar stdout,
stderr e status ensina a primeira; comparar execução inline com uma mensagem
pendente ensina a segunda. Só a segunda pode justificar uma evolução para
worker, e mesmo assim precisa registrar o novo estado de falha e conclusão.

## Proxima aplicacao

Criar um entrypoint de ingestao que devolva falha explicita para arquivo
ausente, preserve o diagnostico e deixe a etapa de processamento isolada para
uma futura fila.
