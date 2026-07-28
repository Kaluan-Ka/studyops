# Índice de fontes por fundamento

Data: 2026-07-28

## Objetivo

Melhorar a descoberta das referências GitHub do Bloco 1 sem remover ou
duplicar os links que já aparecem nas sessões de leitura e nas tarefas.

## Escopo aprovado

- Adicionar um índice compacto de fontes externas na página de cada fundamento.
- Usar os links GitHub já presentes no Markdown das sessões do fundamento como
  fonte de verdade.
- Deduplicar links pelo URL e preservar o primeiro texto de link encontrado
  como rótulo exibido.
- Abrir os links externos em nova aba, com `rel="noreferrer"`.
- Manter intactos os links existentes no conteúdo das sessões e tarefas.
- Não adicionar fontes aos cartões da página inicial.
- Omitir o bloco quando o fundamento não tiver links externos.

## Arquitetura

O loader de conteúdo fornecerá uma função pequena para extrair fontes externas
das sessões de um fundamento. A função trabalhará sobre o Markdown já
carregado, reconhecerá links HTTP(S), filtrará URLs do GitHub e retornará uma
lista ordenada e deduplicada com rótulo e URL.

A página server-side do fundamento chamará essa função e renderizará uma seção
"Fontes do fundamento" antes da lista de sessões. Cada item será um link
externo comum, sem componente client-side, estado ou armazenamento adicional.

## Fluxo

1. O loader lê as sessões do fundamento como já faz hoje.
2. O helper encontra links Markdown no conteúdo das sessões.
3. URLs repetidas são removidas mantendo a primeira ocorrência.
4. A página do fundamento apresenta os links em uma lista compacta.
5. A pessoa continua podendo abrir a sessão e encontrar a citação no contexto
   didático original.

## Tratamento de links

- Apenas URLs `https://github.com/` serão indexadas nesta etapa.
- O URL completo, incluindo anchor, será usado para deduplicação; assim,
  referências a seções diferentes do mesmo repositório continuam visíveis.
- O texto Markdown do link será usado como rótulo. Se não for recuperável, o
  URL será usado como fallback.
- Links externos continuarão sob responsabilidade do componente Markdown nas
  sessões; o índice terá seus próprios atributos de segurança e abertura.

## Verificação

- Testar extração, filtro, ordem e deduplicação das fontes.
- Confirmar que o conteúdo original ainda contém todos os links existentes.
- Rodar `npm test`, `npm run content:validate`, `npm run lint` e `npm run build`.
- Executar smoke test da página de fundamento e verificar que cada fonte abre
  em nova aba.

## Fora de escopo

- Alterar o texto editorial ou as citações existentes.
- Criar cadastro manual de fontes no frontmatter.
- Criar uma página global de referências.
- Adicionar fontes à página inicial.
- Supabase, autenticação, sincronização ou qualquer estado client-side.
