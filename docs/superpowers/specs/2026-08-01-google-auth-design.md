# Autenticação Google e regras de uso do StudyOps

## Contexto

O StudyOps já possui conteúdo editorial público e um schema Supabase para dados de usuário:

- `public.profiles` identifica o usuário autenticado;
- `public.mission_progress` registra o estado de uma missão;
- `public.mission_evidence` registra evidências ligadas ao progresso;
- as três tabelas usam RLS com ownership baseado em `(select auth.uid())`.

O app atualmente consegue consultar `auth.getUser()` no painel de progresso, mas não oferece login, não cria `profiles` automaticamente e ainda permite que o componente de notas use `localStorage` sem verificar sessão.

## Objetivo

Permitir que qualquer pessoa leia o conteúdo do StudyOps sem login, mas exigir login com Google para qualquer ação que registre ou altere dados do usuário.

O primeiro incremento deve comprovar o fluxo completo:

```txt
visitante -> lê conteúdo -> escolhe usar -> login Google -> sessão autenticada
  -> profile criado/reparado -> auth.uid() reconhecido pelo RLS
  -> gravações de progresso e evidência liberadas
```

## Regras de acesso

### Público

- home;
- fundamentos;
- etapas;
- missões;
- sessões;
- leitura de conteúdo editorial e evidências esperadas.

Links como “Iniciar sessão” continuam sendo navegação pública. Eles não devem gravar progresso automaticamente.

### Exige autenticação

- iniciar uma missão no sentido persistido (`in_progress`);
- alterar status de missão;
- inserir evidência;
- criar, editar ou limpar notas;
- qualquer nova ação de usuário adicionada depois desta fatia.

A interface deve bloquear essas ações para usuários desconectados, mas a segurança real continua sendo responsabilidade das policies RLS do Supabase.

## Abordagem técnica

### Sessão global

Adicionar um `AuthProvider` client-side no `layout.tsx`. Ele deve:

1. criar o browser client usando somente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
2. carregar o usuário atual com `supabase.auth.getUser()`;
3. ouvir `supabase.auth.onAuthStateChange()`;
4. expor estado de carregamento, usuário, erro, login Google e logout;
5. executar a sincronização idempotente do profile depois que houver usuário autenticado.

O `AuthControl` exibirá “Entrar com Google” quando não houver usuário e o identificador do usuário com “Sair” quando houver sessão. O conteúdo continuará renderizado nos dois estados.

O login usará redirecionamento:

```ts
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: window.location.origin },
});
```

O componente deve tratar ambiente sem variáveis Supabase como estado de configuração ausente, sem quebrar a leitura pública do app.

### Criação de `profiles`

Adicionar uma migration imperativa com uma função de trigger no schema privado:

- a função será `SECURITY DEFINER` somente porque o trigger precisa inserir em `public.profiles` durante a criação de `auth.users`;
- o `search_path` será fixado;
- a função usará `new.id` como identidade, nunca metadata editável para autorização;
- o acesso de `public`, `anon` e `authenticated` à função será revogado;
- o trigger usará `ON CONFLICT (id) DO NOTHING`.

O cliente também terá um reparo idempotente para usuários criados antes da migration ou em caso de falha parcial. Esse reparo fará `upsert` apenas do próprio `user.id`, usando a policy existente de `profiles`.

O `display_name` poderá ser preenchido com um nome fornecido pelo provedor para apresentação. Esse valor não será usado em decisões de autorização.

### Gates de ação

`MissionProgressPanel` deve:

- mostrar uma chamada para login quando estiver desconectado;
- esconder ou desabilitar formulários de escrita nesse estado;
- continuar carregando progresso e evidências somente após uma sessão válida;
- enviar o `user.id` da sessão apenas como dado de operação, nunca como fronteira de segurança;
- refletir erros de RLS como erro operacional sem relaxar policies.

`StudyNote` deve:

- não ler nem alterar a anotação enquanto a sessão estiver carregando;
- mostrar um estado bloqueado com chamada para login quando o usuário estiver desconectado;
- manter o armazenamento local existente para usuários autenticados nesta etapa;
- permitir salvar e limpar somente quando houver usuário autenticado.

Não haverá migração das notas para Supabase nesta fatia.

## Segurança e limites

- Nunca expor `service_role` ou secret key no navegador.
- Não usar `user_metadata` ou `display_name` para autorização.
- Não relaxar grants ou policies existentes.
- Manter a FK composta de `mission_evidence` para impedir associação cruzada entre usuários.
- Usuários anônimos não devem conseguir ler ou gravar as tabelas de dados pessoais.
- O logout deve limpar o estado de sessão e bloquear novamente as ações de escrita.
- Google OAuth precisa estar configurado no provedor Supabase e no Google Cloud; essa configuração externa não será simulada no código.

## Verificação

### Testes automatizados

- construir o projeto e validar TypeScript;
- executar testes existentes;
- executar lint;
- testar estados sem configuração, desconectado, carregando e autenticado nos componentes onde houver helpers puros;
- validar que uma nota não chama `localStorage.setItem` sem usuário autenticado.

### Verificação Supabase

Com o banco local aplicado, verificar:

1. usuário autenticado A resolve para `auth.uid() = A`;
2. usuário anônimo não lê nem grava `profiles`, `mission_progress` ou `mission_evidence`;
3. o cadastro de A cria exatamente um `profiles.id = A`;
4. repetir o reparo do profile não cria duplicata;
5. A consegue inserir e atualizar seu progresso;
6. A não consegue atribuir progresso ou evidência a B;
7. B não consegue ler ou atualizar dados de A;
8. a FK composta rejeita evidência de A ligada ao progresso de B.

### Aceite manual

Com o Google OAuth configurado:

1. abrir a home sem login e navegar por fundamentos, missões e sessões;
2. confirmar que ações de uso exibem o bloqueio de autenticação;
3. entrar com Google;
4. confirmar que o controle global mostra a sessão;
5. confirmar que `profiles` contém uma linha para o usuário;
6. salvar status e evidência em uma missão;
7. recarregar a página e confirmar que os dados persistem;
8. sair e confirmar que as ações voltam a ficar bloqueadas.

## Fora de escopo

- login por email e senha;
- magic link;
- multiusuário administrativo;
- notas persistidas em tabela;
- dashboard real;
- ciclos semanais;
- projetos de portfólio e arquivos;
- importação de dados externos;
- alterar a estrutura de `mission_progress` ou `mission_evidence`.
