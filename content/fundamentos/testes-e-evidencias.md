---
id: FUN-000010
title: Testes e evidencias
slug: testes-e-evidencias
status: a_estudar
order: 5
summary: Forma de verificar comportamentos, registrar resultados e transformar cada ciclo de estudo em evidencia revisavel.
steps:
  - id: STEP-000028
    title: Entender niveis de verificacao
    order: 1
    expected_evidence:
      - nota_markdown
  - id: STEP-000029
    title: Implementar testes de fronteira
    order: 2
    expected_evidence:
      - teste_automatizado
  - id: STEP-000030
    title: Aplicar evidencia no portfolio
    order: 3
    expected_evidence:
      - teste_automatizado
      - nota_markdown
---

# Testes e evidencias

## O que voce vai aprender

Um teste verifica um comportamento que foi definido antes. Uma evidencia e o
artefato que permite outra pessoa revisar o que foi feito: teste, saida,
benchmark, nota, README ou comparacao.

No StudyOps, testar e documentar nao sao uma etapa burocratica depois do
aprendizado. Eles fazem parte do proprio ambiente de estudo: obrigam a dizer o
que era esperado, o que aconteceu e qual proximo passo faz sentido.

## Unidade, integracao e fronteira

O [`coding-interview-university`](https://github.com/jwasham/coding-interview-university#testing) lista quatro pontos para estudar: testes
unitarios, mocks, testes de integracao e injecao de dependencia. Use-os assim:

- **Unitario:** verifica uma funcao ou regra sem iniciar recursos externos.
- **Integracao:** verifica se duas partes reais conversam, como endpoint e
  adaptador local.
- **Mock ou fake:** substitui uma dependencia quando o objetivo e testar outra
  parte, como API externa ou banco.
- **Injecao de dependencia:** passa a colaboracao para o codigo em vez de
  esconde-la dentro da funcao, tornando a substituicao possivel.

O nivel nao e uma medalha. A pergunta e: qual fronteira precisa ser provada?

## Exemplo guiado

Considere uma funcao que transforma um texto em chunks:

```ts
function chunkText(text: string, maxChars: number): string[] {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => paragraph.slice(0, maxChars));
}
```

Um teste unitario pode verificar:

```ts
it("preserva a ordem dos paragrafos", () => {
  const result = chunkText("primeiro\n\nsegundo", 50);

  expect(result).toEqual(["primeiro", "segundo"]);
});
```

Esse teste nao prova que um arquivo foi aberto. Para isso, outro teste precisa
conectar a leitura e a transformacao. Sao perguntas diferentes e devem gerar
evidencias diferentes.

## Matriz de evidencia

Use uma matriz curta para nao confundir atividade com prova:

| O que quero aprender | Comportamento observavel | Evidencia |
| --- | --- | --- |
| CLI separa entrada e saida | fixture produz a mesma saida | exemplo + teste |
| API comunica ausencia | recurso inexistente retorna erro definido | teste de contrato |
| processo propaga falha | codigo nao zero e stderr preservado | teste de processo |
| pipeline preserva fonte | cada chunk aponta para o arquivo | teste + JSON |

Uma frase como "li o artigo" pode ser parte do estudo, mas sozinha nao prova
que o mecanismo foi entendido ou aplicado.

## Exemplo de evidencia bem formada

```md
Fundamento: Pipeline de ingestao
Pergunta: a fonte se perde quando o texto vira chunk?
Entrada: notas/cli.md, 3 paragrafos
Resultado: 3 chunks, todos com source=notas/cli.md e ordem 0..2
Evidencia: teste `preserva_source_e_ordem` + saida JSON
Limitacao: chunks longos ainda sao cortados por slice
Proximo passo: comparar uma regra que nao corte paragrafos
```

Esse formato permite revisar o raciocinio sem abrir todos os repositorios ou
repetir o experimento imediatamente.

## O que foi extraido das fontes

- A secao [`Testing`](https://github.com/jwasham/coding-interview-university#testing) do
  `jwasham/coding-interview-university/README.md` fornece as categorias
  unitario, mock, integracao e injecao de dependencia; o StudyOps as reduz a
  fronteiras praticas do bloco.
- A entrada `Go: Code a database in 45 steps: a series of test-driven small
  coding puzzles` em [`Build your own Database`](https://github.com/codecrafters-io/build-your-own-x#build-your-own-database) de `codecrafters-io/build-your-own-x/README.md` sustenta a
  decomposicao em exercicios pequenos orientados por teste.
- O `Metodo semanal` e o `Criterio de sucesso` de
  `trilha-engenharia-ia.md` definem que cada ciclo deve implementar, testar,
  documentar e gerar artefato.
- Os criterios de qualidade e o metodo de execucao de
  `projetos-portfolio-ia.md` conectam teste, README, limitacao e proxima
  evolucao ao portfolio.

## Erros comuns

- Testar detalhes internos em vez de comportamento observavel.
- Usar mock para esconder uma integracao que deveria ser testada.
- Escrever evidencia sem entrada e resultado.
- Declarar sucesso sem registrar a limitacao.
- Criar um teste que passa, mas nao responde a nenhuma pergunta de estudo.

## Perguntas de revisao

1. Qual comportamento esta sendo provado?
2. O teste precisa de uma dependencia real?
3. O que um mock esconderia neste caso?
4. Qual diferenca existe entre evidencia e atividade?
5. Que limitacao deve acompanhar o resultado?

## Onde aparece no portfolio

Em cada ferramenta do Bloco 1: CLI, endpoint, processo e pipeline. As
evidencias formam a narrativa tecnica do portfolio e tambem alimentam a
revisao do proprio StudyOps.

## Metodo de estudo

1. Escreva a pergunta de estudo.
2. Defina o comportamento observavel.
3. Escolha o menor teste ou experimento.
4. Rode com entrada conhecida e uma falha.
5. Registre resultado, limitacao e proximo passo.

Uma matriz de evidência funciona como uma ponte entre conteúdo e portfólio:
para cada claim, escreva qual observação poderia falsificá-lo. Por exemplo,
“a fonte foi preservada” pede uma entrada com caminho conhecido e uma saída
que mantenha esse caminho; “a API comunica falha” pede um caso inexistente e
um status não ambíguo. Assim, a nota explica o resultado em vez de apenas
listar ferramentas usadas.

## Proxima aplicacao

Completar a matriz de evidencias do Bloco 1 e usa-la para revisar CLI, API,
processos e pipeline sem transformar o ambiente em uma lista de tarefas
desconectadas.
