# Design técnico: arquitetura do frontend

## 1. Decisão estrutural

O repositório terá dois pacotes npm deliberadamente independentes:

```text
cafeina-tracker-api/
├── package.json                 # API + orquestração raiz
├── package-lock.json
├── scripts/
│   └── run-spec-tests.mjs       # agrega relatórios Jest da API e frontend
├── src/                         # backend existente
├── tests-jest/
├── tests-jasmine/
└── frontend/
    ├── package.json             # runtime e ferramentas do navegador
    ├── package-lock.json
    ├── index.html
    ├── vite.config.ts
    ├── jest.config.cjs
    ├── eslint.config.js
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── app/
        │   └── App.tsx
        ├── components/
        │   └── ui/
        │       ├── Button.tsx
        │       ├── FieldMessage.tsx
        │       ├── IconButton.tsx
        │       ├── StatusPill.tsx
        │       └── index.ts
        ├── features/
        │   ├── tracker/
        │   │   ├── api.ts
        │   │   ├── components/
        │   │   │   ├── PerfilForm.tsx
        │   │   │   ├── ResultadoTracker.tsx
        │   │   │   └── XicaraMedidor.tsx
        │   │   ├── useTracker.ts
        │   │   └── index.ts
        │   ├── cafeteria/
        │   │   ├── api.ts
        │   │   ├── CafeteriaStatus.tsx
        │   │   └── index.ts
        │   ├── estatisticas/
        │   │   ├── api.ts
        │   │   ├── MediaCafes.tsx
        │   │   └── index.ts
        │   ├── status/
        │   │   ├── api.ts
        │   │   └── index.ts
        │   └── laboratorio/
        │       ├── LaboratorioTestes.tsx
        │       ├── exemplos.ts
        │       └── index.ts
        ├── lib/
        │   ├── http.ts
        │   ├── formatadores.ts
        │   └── classes.ts
        ├── styles/
        │   ├── tokens.css
        │   ├── reset.css
        │   ├── globals.css
        │   └── motion.css
        ├── test/
        │   ├── setup-jest.ts
        │   ├── styleMock.cjs
        │   └── fileMock.cjs
        ├── types/
        │   └── api.ts
        └── main.tsx
```

## 2. Regras de dependência

```text
app
 ├── components/ui
 └── features/* (somente pelo index.ts público)

features/*
 ├── components/ui
 ├── lib
 └── types/api

lib e types
 └── não importam app, components ou features
```

- Uma feature não importa arquivos internos de outra feature.
- Saúde operacional pertence a `features/status`; cafeteria não expõe `/health`.
- `components/ui` não conhece endpoints nem regras de domínio.
- `lib/http.ts` aceita `unknown`, verifica o status e devolve dados para o
  adaptador da feature; nenhum componente chama `fetch` diretamente.
- `types/api.ts` espelha `PerfilDev`, `ResultadoTracker`, `StatusCafeteria` e
  `ErroValidacao` sem importar arquivos fora de `frontend/`.
- Estado é local e coordenado por hooks. Nenhuma store global é criada.

## 3. Instalação canônica

Pré-condição: `node --version` deve ser `20.19+` ou uma linha superior suportada
pelo Vite. O ambiente atual (`20.20`) atende.

```bash
npm create vite@latest frontend -- --template react-ts --no-interactive
npm --prefix frontend install

npm --prefix frontend install \
  motion \
  lucide-react \
  @fontsource-variable/bricolage-grotesque \
  @fontsource-variable/manrope \
  @fontsource/ibm-plex-mono

npm --prefix frontend install --save-dev \
  jest@29 \
  jest-environment-jsdom@29 \
  @types/jest@29 \
  @swc/core \
  @swc/jest \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/user-event \
  eslint-plugin-jsx-a11y

npm install --save-dev concurrently tsx
```

Política de versões:

- O scaffold oficial resolve versões compatíveis de React, Vite, TypeScript e
  plugin React no momento da execução.
- Pacotes adicionais são instalados sem editar o `package.json` manualmente.
- Os dois `package-lock.json` são obrigatórios e entram no controle de versão.
- Não usar `--force`, `--legacy-peer-deps` ou `npm audit fix --force` para
  mascarar incompatibilidades.

## 4. Scripts obrigatórios

### frontend/package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b --pretty false",
    "test": "jest --config jest.config.cjs --runInBand --passWithNoTests",
    "test:watch": "jest --config jest.config.cjs --watch",
    "verify": "npm run lint && npm run typecheck && npm test && npm run build"
  }
}
```

### package.json da raiz

Adicionar sem remover os scripts atuais:

```json
{
  "scripts": {
    "dev:api": "tsx watch src/index.ts",
    "dev:web": "npm --prefix frontend run dev",
    "dev:all": "concurrently --kill-others-on-fail --names API,WEB --prefix-colors blue,magenta \"npm run dev:api\" \"npm run dev:web\"",
    "build:frontend": "npm --prefix frontend run build",
    "build:all": "npm run build && npm run build:frontend",
    "test:frontend": "npm --prefix frontend test",
    "test:all": "npm test && npm run test:frontend",
    "test:spec:all": "node scripts/run-spec-tests.mjs",
    "verify:all": "npm run build:all && npm run test:all && npm --prefix frontend run lint"
  }
}
```

`start` permanece `node build/src/index.js`: produção continua sem executor de
TypeScript. `tsx` é ferramenta exclusiva de desenvolvimento.

## 5. Integração HTTP

O navegador chama os caminhos reais da API (`/tracker`, `/cafeteria/:id`,
`/estatisticas`, `/health`). Em desenvolvimento, `vite.config.ts` contém:

```ts
server: {
  port: 5173,
  strictPort: true,
  proxy: {
    '/tracker': 'http://127.0.0.1:3000',
    '/cafeteria': 'http://127.0.0.1:3000',
    '/estatisticas': 'http://127.0.0.1:3000',
    '/health': 'http://127.0.0.1:3000'
  }
}
```

Não habilitar CORS: no desenvolvimento o proxy mantém mesma origem e, na
produção, o Express serve a interface e a API pela mesma porta.

Após as rotas da API, `src/servidor.ts` deve servir
`path.resolve(process.cwd(), 'frontend/dist')` com `express.static`. Rotas da
API sempre têm precedência sobre arquivos estáticos.

## 6. Estado de tela

`useTracker` usa uma união discriminada, não combinações soltas de booleanos:

```ts
type TrackerState =
  | { status: 'idle' }
  | { status: 'loading'; perfil: PerfilDev }
  | { status: 'success'; resultado: ResultadoTracker }
  | { status: 'validation-error'; erros: ErroValidacao[] }
  | { status: 'network-error'; mensagem: string };
```

Isso impede estados impossíveis como resultado e erro ativos ao mesmo tempo.

## 7. Testes e gate

- Jest usa `environment: 'jsdom'`, transformação SWC e `src/test/setup-jest.ts`.
- O setup importa `@testing-library/jest-dom`; mocks de CSS e assets evitam
  que detalhes do bundler quebrem futuros testes de componente.
- Nenhum caso de teste frontend é gerado nesta fase. `--passWithNoTests`
  mantém o gate operacional até o usuário adicionar sua própria suíte.
- Jasmine permanece na raiz e executa JavaScript compilado de
  `build/tests-jasmine/`, adequado à comparação didática da lógica da API.
- `scripts/run-spec-tests.mjs` executa o Jest da API e o Jest do frontend com
  reporters JSON, combina os arrays de resultados em
  `.spec/verification/all-results.json` e preserva código de saída diferente de
  zero se qualquer runner falhar.
- `onpspec.config.json` passa a usar `npm run test:spec:all`, reporter
  `jest-json`, o relatório combinado e inclui `frontend/src/**/*.test.*` em
  `testGlobs`. Assim os 50 critérios continuam com prova por teste, sem cair em
  verificação fraca apenas por exit code.
- Gates finais: `npm --prefix frontend run verify`, `npm run build:all`,
  `npm run test:all`, `npm audit` e `npm --prefix frontend audit`.

## 8. Fontes técnicas usadas na decisão

- [Vite — Getting Started](https://vite.dev/guide/): template `react-ts`, requisitos de Node e scripts de build.
- [Vite — server.proxy](https://vite.dev/config/server-options.html#server-proxy): encaminhamento local sem CORS.
- [Motion para React — instalação](https://motion.dev/docs/react-installation): pacote `motion`, importado de `motion/react`.
- [Jest](https://jestjs.io/docs/getting-started): runner, assertions, mocks e ambiente jsdom.
- [Jasmine](https://jasmine.github.io/): especificações, spies e execução da suíte compilada.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/): consultas orientadas ao usuário para testes futuros.
