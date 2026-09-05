# Spec: Arquitetura e dependências do frontend

> feature: frontend-arquitetura
> status: pronta

## Contexto

O Cafeína Tracker já possui uma API Node.js/TypeScript executável na raiz. O
frontend deve ser acrescentado no mesmo repositório, mas com compilação,
dependências e testes isolados em `frontend/`. A estrutura precisa permitir
desenvolvimento com dois processos e entrega local com um único processo Node.

## Histórias

### US-008 — Inicializar o frontend sem desorganizar a API

Como pessoa desenvolvedora, quero criar o frontend com uma ferramenta oficial
e dependências separadas, para evoluir a interface sem misturar runtimes.

#### AC-022 — O scaffold usa React e TypeScript suportados pelo Vite

- **Dado** Node.js 20.19 ou superior e npm disponíveis
- **Quando** executo o comando documentado de scaffold
- **Então** a pasta frontend é criada pelo template oficial react-ts e compila sem erros

#### AC-023 — Dependências de runtime e desenvolvimento ficam separadas

- **Dado** o package.json do frontend
- **Quando** inspeciono as dependências instaladas
- **Então** React, Motion, ícones e fontes ficam em dependencies, enquanto Vite, TypeScript, lint e testes ficam em devDependencies

#### AC-024 — A instalação é reproduzível pelo lockfile

- **Dado** uma máquina limpa com versão de Node compatível
- **Quando** executo npm ci na raiz e no frontend
- **Então** recebo a mesma árvore de dependências registrada nos dois package-lock.json

### US-009 — Navegar por uma arquitetura de módulos previsível

Como pessoa desenvolvedora, quero localizar UI, regras de tela e acesso HTTP
por responsabilidade, para alterar uma feature sem percorrer o projeto inteiro.

#### AC-025 — A árvore de pastas segue o blueprint definido

- **Dado** a implementação inicial do frontend
- **Quando** comparo seus arquivos com design.md desta feature
- **Então** app, components, features, lib, styles, test e types existem com as responsabilidades descritas

#### AC-026 — Cada domínio expõe uma interface pequena

- **Dado** os módulos tracker, cafeteria, estatísticas, status e laboratório
- **Quando** outro módulo precisa utilizá-los
- **Então** ele importa somente APIs, hooks, tipos ou componentes públicos, sem acessar detalhes internos por caminhos profundos

#### AC-027 — O cliente HTTP preserva o contrato atual da API

- **Dado** respostas de tracker, cafeteria, estatísticas e health
- **Quando** o frontend faz uma requisição
- **Então** usa fetch tipado, valida status e traduz erros sem importar Express nem código compilado do backend

### US-010 — Executar API e frontend no mesmo repositório

Como apresentador do seminário, quero iniciar tudo com um comando, para não
gerenciar terminais manualmente durante a demonstração.

#### AC-028 — Um comando inicia os dois servidores de desenvolvimento

- **Dado** dependências instaladas na raiz e em frontend
- **Quando** executo npm run dev:all na raiz
- **Então** a API inicia em localhost:3000 e o Vite em localhost:5173, encerrando ambos se um falhar

#### AC-029 — O frontend acessa a API sem CORS no desenvolvimento

- **Dado** o Vite executando em localhost:5173
- **Quando** a interface chama tracker, cafeteria, estatísticas ou health
- **Então** o proxy encaminha esses caminhos para localhost:3000 sem alterar os endpoints existentes

#### AC-030 — O build de produção roda em um único processo

- **Dado** os builds da API e do frontend concluídos
- **Quando** executo npm start na raiz
- **Então** o Express serve a API e os arquivos estáticos de frontend/dist pela porta configurada

### US-011 — Manter qualidade verificável no frontend

Como pessoa desenvolvedora, quero um gate automático de tipos, lint, testes e
build, para impedir que a interface seja entregue quebrada.

#### AC-031 — O gate do frontend usa Jest como único runner do navegador

- **Dado** a implementação do frontend
- **Quando** executo npm run verify dentro de frontend
- **Então** lint, typecheck, Jest e build terminam com código zero, aceitando temporariamente uma suíte vazia

#### AC-032 — A estrutura de testes fica pronta sem gerar casos

- **Dado** que a pessoa responsável quer escrever os próprios testes
- **Quando** inspeciono o frontend
- **Então** Jest, jsdom e Testing Library estão configurados, mas não existe nenhum caso de teste frontend gerado

#### AC-033 — A instalação não entrega vulnerabilidades altas conhecidas

- **Dado** os dois lockfiles atualizados
- **Quando** executo npm audit na raiz e no frontend
- **Então** nenhum alerta de severidade alta ou crítica permanece sem decisão registrada

## Fora de escopo

- Reescrever ou versionar os endpoints existentes da API.
- Adicionar autenticação, banco de dados ou estado persistente.
- Introduzir Redux, Axios, Tailwind, biblioteca de componentes ou roteador sem necessidade demonstrada.
- Instalar Playwright nesta fase; testes de navegador podem ser uma evolução isolada, com requisitos de runtime revistos no momento da adoção.
- Adicionar Vitest, Mocha ou outro runner além de Jest e Jasmine.
- Gerar casos de teste frontend; a autoria desses testes fica com o usuário.
- Implementar os detalhes visuais e animações, cobertos pela feature frontend-design.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-007 | O frontend ficará em frontend/ no mesmo repositório. | confirmada | O usuário pediu para executar tudo no projeto atual e aceitou a proposta de pasta frontend. |
| ASM-008 | npm continuará sendo o único gerenciador de pacotes. | confirmada | A API já usa package-lock.json e os comandos existentes são npm. |
| ASM-009 | A primeira versão é um dashboard de página única, sem roteador. | confirmada | Todo o fluxo cabe na experiência proposta; roteamento seria complexidade sem valor atual. |
| ASM-010 | Fetch nativo é suficiente e substitui a necessidade de Axios. | confirmada | A API possui quatro recursos simples e não exige interceptadores complexos. |
| ASM-011 | Node 20.20 do ambiente atende o requisito mínimo atual do Vite. | confirmada | O ambiente foi verificado e supera Node 20.19. |
| ASM-017 | Os testes existentes da API devem ser preservados. | confirmada | A solicitação atual restringe os frameworks e impede novos testes; não pede para apagar a suíte Jest/Jasmine já existente. |

## Perguntas em aberto

Nenhuma.
