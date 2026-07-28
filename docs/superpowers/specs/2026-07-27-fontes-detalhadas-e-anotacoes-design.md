# Fontes detalhadas e anotações de estudo

Data: 2026-07-27

## Objetivo

Aprofundar o conteúdo didático do Bloco 1 com base nas fontes externas já
curadas e permitir que o estudante registre uma anotação diretamente ligada à
sessão lida ou à tarefa em execução.

## Escopo aprovado até aqui

- Citações externas dos repositórios devem virar links clicáveis para a seção
  correspondente no GitHub.
- As sessões existentes podem ficar mais longas quando isso melhorar a
  explicação; não é necessário fragmentar artificialmente o conteúdo.
- O aprofundamento deve ser uma paráfrase didática baseada nas fontes, sem
  copiar trechos extensos.
- O escopo permanece nos cinco fundamentos do Bloco 1: CLI, HTTP e APIs, shell
  e processos, pipeline de ingestão e testes/evidências.
- Documentos locais do projeto continuam identificados como referências
  internas, mas não precisam virar links externos.

## Anotações

Cada página de sessão exibirá um bloco de anotação associado àquela sessão. A
página de tarefa também exibirá uma anotação própria, distinta das anotações de
suas sessões.

As chaves lógicas serão estáveis:

```txt
session:fundamento/<fundamento-slug>/<sessao-slug>
session:tarefa/<fundamento-slug>/<tarefa-slug>/<sessao-slug>
task:<fundamento-slug>/<tarefa-slug>
```

No primeiro MVP, as anotações serão persistidas em `localStorage` no navegador.
Isso permite escrever, sair da sessão e retornar sem introduzir Supabase antes
da hora. O formato deve ser versionado e isolado atrás de um componente cliente
para permitir uma migração futura para persistência remota.

Cada anotação terá:

- texto livre em textarea;
- ação explícita de salvar;
- indicador de salvo/alterado;
- ação para limpar a anotação, com confirmação simples;
- restauração automática da anotação ao abrir a mesma sessão ou tarefa.

O MVP não terá colaboração, sincronização entre dispositivos, histórico de
versões ou formatação Markdown na anotação.

## Arquitetura proposta

- `src/components/StudyNote.tsx`: componente client-side responsável por
  carregar, editar, salvar e limpar uma anotação.
- `src/lib/notes.ts`: funções puras para montar chaves, validar o payload e
  serializar/deserializar o formato local versionado.
- As páginas server-side passam apenas `noteKey` e `label` para o componente.
- A camada de conteúdo continua independente das anotações.

## Curadoria das fontes

Antes de editar `content/`, criar um mapa detalhado e uma revisão CTO com os
claims que serão adicionados. As fontes externas prioritárias são:

- `codecrafters-io/build-your-own-x/README.md`: método de reconstruir
  tecnologias pequenas e seções de CLI, shell, web server e database.
- `jwasham/coding-interview-university/README.md`: `How to use it`, `The Daily
  Plan`, `Processes and Threads` e `Testing`.
- `donnemartin/system-design-primer/README.md`: HTTP, `Asynchronism`, `Message
  queues`, `Task queues` e `Back pressure`.

Cada citação externa adicionada ao Markdown deve apontar para uma URL GitHub
com o anchor da seção usada.

## Verificação

- Testar parsing/serialização e isolamento das chaves das anotações.
- Testar que uma anotação de sessão não aparece em outra sessão ou tarefa.
- Validar links externos e renderização no Markdown.
- Rodar `npm test`, `npm run content:validate`, `npm run lint` e `npm run build`.
- Verificar manualmente no navegador a restauração, o salvamento e a limpeza.

## Fora de escopo

- Supabase e autenticação.
- Status de progresso, evidências ou notas compartilhadas.
- Links para documentos locais como se fossem fontes públicas.
- Conteúdo de Docker, cache, RAG, embeddings ou chamadas de modelo.
