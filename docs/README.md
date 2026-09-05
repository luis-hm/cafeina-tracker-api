# Central de documentação do Cafeína Tracker

Este diretório reúne a documentação técnica, didática e visual do Cafeína
Tracker. O sistema é composto por uma API Node.js/TypeScript/Express, uma SPA
React/Vite, serviços simulados em memória e uma estrutura de testes criada para
comparar Jest e Jasmine sobre o mesmo domínio.

O [`README.md` da raiz](../README.md) é o guia de instalação e uso rápido. Este
índice responde onde cada assunto está documentado; a
[arquitetura](./arquitetura.md) explica como o repositório inteiro funciona e
como suas partes se relacionam.

## Retrato atual do projeto

| Área | Implementação atual |
|---|---|
| Backend | Node.js, TypeScript estrito e Express |
| Frontend | React, Vite, CSS Modules, Motion e Lucide |
| Persistência | Memória do processo; não há banco de dados |
| Integrações | Cafeteria aleatória simulada; não há serviço externo real |
| Testes da API | Jest + Supertest e Jasmine sobre JavaScript compilado |
| Testes do frontend | Jest/jsdom configurado, ainda sem casos `*.test.*` |
| Entrega local | Vite separado no desenvolvimento e Express único após o build |
| Especificação | Specs, designs, tarefas e evidências em `.spec/` |

## Por onde começar

| Objetivo | Leitura recomendada |
|---|---|
| Instalar e executar | [`README.md` da raiz](../README.md) |
| Entender o sistema completo | [Arquitetura](./arquitetura.md) |
| Conhecer decisões e débitos encontrados | [Auditoria de arquitetura](./auditoria-arquitetura.md) |
| Preparar a apresentação do seminário | [Interface do seminário](./frontend-design.md) |
| Entender Jest | [Guia de Jest](./testes/jest.md) |
| Entender Jasmine | [Guia de Jasmine](./testes/jasmine.md) |
| Saber onde criar testes | [Estrutura de testes](./testes/estrutura.md) |
| Conferir a interface em diferentes telas | [QA visual](./qa/frontend-design/README.md) |
| Rastrear requisitos e critérios de aceite | [Especificações](../.spec/features/) |
| Planejar o laboratório executável | [Spec do laboratório](../.spec/features/laboratorio-executavel/spec.md) |

## Catálogo da documentação

### Sistema e arquitetura

- [Arquitetura](./arquitetura.md): contexto, módulos, interfaces, dependências,
  contratos HTTP, estados, execução, testes, configurações, limitações e guia
  de evolução.
- [Auditoria de arquitetura](./auditoria-arquitetura.md): achados da revisão que
  originou parte da organização atual, correções aplicadas e riscos aceitos.
- [`spec.md` da raiz](../spec.md): especificação técnica inicial da API e das
  regras de negócio. É um registro importante, mas não descreve sozinho o
  frontend que foi adicionado depois.

### Frontend e experiência

- [Interface do seminário](./frontend-design.md): roteiro da demonstração,
  responsabilidades visuais, laboratório didático e acessibilidade.
- [QA visual](./qa/frontend-design/README.md): viewports, fluxos verificados,
  observações e links para as capturas.
- [`frontend/README.md`](../frontend/README.md): comandos e fronteiras do pacote
  React/Vite.
- [`docs/qa/frontend-design/screenshots/`](./qa/frontend-design/screenshots/):
  evidências PNG de desktop, laptop, tablet, mobile e laboratório.

### Testes automatizados

- [Jest](./testes/jest.md): modelo mental, configuração da API, Supertest,
  snapshots e preparação do Jest/jsdom no frontend.
- [Jasmine](./testes/jasmine.md): compilação por `tsc`, descoberta dos specs,
  spies e assincronismo.
- [Estrutura de testes](./testes/estrutura.md): convenções de nomes, localização
  dos casos e comandos consolidados.

### Especificação e rastreabilidade

O diretório [`.spec/`](../.spec/) guarda o processo Spec-Driven do projeto:

| Caminho | Conteúdo |
|---|---|
| [`.spec/constituicao.md`](../.spec/constituicao.md) | Regras permanentes de engenharia e verificação |
| [`.spec/features/cafeina-tracker-api/`](../.spec/features/cafeina-tracker-api/) | Spec, design, tarefas e plano da API original |
| [`.spec/features/frontend-arquitetura/`](../.spec/features/frontend-arquitetura/) | Estrutura e contratos arquiteturais do frontend |
| [`.spec/features/frontend-design/`](../.spec/features/frontend-design/) | Direção visual, implementação e QA da interface |
| [`.spec/features/laboratorio-executavel/`](../.spec/features/laboratorio-executavel/) | Proposta ainda não implementada para editar e executar testes com isolamento |
| [`.spec/verification/`](../.spec/verification/) | Relatórios JSON e sinais usados pela auditoria mecânica |

Cada feature pode conter `spec.md`, `design.md`, `tasks.md`, plano em Markdown,
plano em JSON, visualização HTML e script de execução. Esses arquivos registram
planejamento e evidência; a presença de uma tarefa no plano não significa que a
funcionalidade já exista no código.

## Mapa de todas as pastas

Pastas de dependências e saídas geradas aparecem separadas para não serem
confundidas com código-fonte.

| Pasta | Papel no repositório | Manutenção |
|---|---|---|
| `.agents/` | Metadados locais de agentes; atualmente sem código da aplicação | Ferramentas locais |
| `.codex/` | Metadados locais do ambiente Codex; atualmente sem código da aplicação | Ferramentas locais |
| `.git/` | Metadados locais de versionamento | Git |
| `.spec/` | Requisitos, designs, tarefas, planos e verificações | Engenharia/especificação |
| `build/` | JavaScript da API e dos specs Jasmine compilado por `tsc` | Gerada; não editar |
| `coverage/` | Relatório de cobertura Jest da API | Gerada; não editar |
| `docs/` | Documentação técnica, testes e evidências de QA | Documentação |
| `frontend/` | Pacote npm da SPA React/Vite | Frontend |
| `frontend/dist/` | Bundle estático entregue pelo Express | Gerada; não editar |
| `frontend/node_modules/` | Dependências instaladas do frontend | Gerada por npm |
| `frontend/public/` | Assets copiados sem transformação pelo Vite | Frontend |
| `frontend/src/app/` | Composição da tela e estado compartilhado | Frontend |
| `frontend/src/assets/` | Espaço para assets importados pelo código; vazio atualmente | Frontend |
| `frontend/src/components/` | Cabeçalho, status da API e UI reutilizável | Frontend |
| `frontend/src/features/` | Tracker, cafeteria, estatísticas, status e laboratório | Frontend |
| `frontend/src/lib/` | Cliente HTTP, formatadores e utilitários | Frontend |
| `frontend/src/styles/` | Tokens, reset, estilos globais e movimento | Frontend/design |
| `frontend/src/test/` | Setup e mocks do Jest; ainda sem casos | Testes frontend |
| `frontend/src/types/` | Contratos HTTP consumidos pelo navegador | Frontend/backend |
| `node_modules/` | Dependências instaladas da raiz | Gerada por npm |
| `scripts/` | Orquestração dos testes ligados às specs | Engenharia |
| `src/` | Código-fonte da API e ponto de entrada do processo | Backend |
| `src/logica/` | Tipos e regras puras do domínio | Backend/domínio |
| `src/servico/` | Assincronismo simulado e estado em memória | Backend |
| `tests-jasmine/` | Matriz Jasmine das regras e serviços | Testes backend |
| `tests-jasmine/support/` | Configuração de descoberta do Jasmine compilado | Testes backend |
| `tests-jest/` | Domínio, serviços, HTTP, snapshot e paridade | Testes backend |
| `tests-jest/__snapshots__/` | Snapshot versionado do resultado do tracker | Testes backend |

Consulte a [árvore comentada da arquitetura](./arquitetura.md#4-inventário-do-repositório)
para ver os arquivos importantes dentro de cada pasta.

## Fontes de verdade

Quando dois textos divergirem, use esta ordem para investigar:

1. comportamento verificável no código e nos testes;
2. spec da feature em `.spec/features/<feature>/spec.md`;
3. design da feature e decisões registradas;
4. documentação de arquitetura e guias;
5. planos e tarefas históricas.

Uma spec em rascunho descreve intenção futura, não comportamento disponível.
Contratos HTTP devem permanecer coerentes entre `src/logica/tipos.ts` e
`frontend/src/types/api.ts`, pois os dois pacotes não compartilham código no
bundle.

## Comandos essenciais

Execute-os a partir da raiz:

| Comando | Resultado |
|---|---|
| `npm ci` | Instala exatamente as dependências da API |
| `npm --prefix frontend ci` | Instala exatamente as dependências da SPA |
| `npm run dev:all` | Inicia API em `3000` e Vite em `5173` |
| `npm run build:all` | Compila API/Jasmine e gera `frontend/dist/` |
| `npm test` | Executa Jest e Jasmine da API |
| `npm run typecheck:jest` | Valida os testes com os tipos Jest usados pelo editor |
| `npm run test:frontend` | Executa Jest/jsdom do frontend; aceita zero casos |
| `npm run test:all` | Executa as suítes da API e do frontend |
| `npm run test:spec:all` | Gera o relatório agregado em `.spec/verification/` |
| `npm run verify:all` | Build, tipos do Jest, testes, lint e tipos do frontend |
| `npm run audit:all` | Audita os dois conjuntos de dependências |

## Estado implementado versus planejado

- O cálculo, a validação, a classificação de risco, a cafeteria simulada, as
  estatísticas em memória, a interface responsiva e o laboratório explicativo
  somente leitura estão implementados.
- O laboratório executável descrito em
  [`.spec/features/laboratorio-executavel/`](../.spec/features/laboratorio-executavel/)
  é uma proposta em rascunho. Não existem hoje editor, fila, executor isolado
  ou endpoints `/laboratorio/execucoes`.
- Autenticação, banco de dados, integração externa real, rate limiting,
  observabilidade de produção, CI/CD e deploy em nuvem permanecem fora da
  implementação atual.

## Como manter esta documentação

Ao alterar o projeto:

1. atualize primeiro a spec da feature quando o contrato ou o escopo mudar;
2. mantenha exemplos de requisição e resposta iguais ao código;
3. atualize a árvore e a tabela de pastas ao criar um novo diretório;
4. registre novas variáveis de ambiente e scripts npm;
5. atualize os guias de teste ao adicionar outro runner ou tipo de teste;
6. não descreva uma feature planejada como implementada;
7. rode `npm run verify:all` e valide os links Markdown antes de concluir.
