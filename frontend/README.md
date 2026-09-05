# Frontend do Cafeína Tracker

SPA React + TypeScript criada com o template oficial `react-ts` do Vite. Este
pacote mantém dependências, compilação e testes separados da API.

## Preparação

Na raiz do repositório:

```bash
npm ci
npm --prefix frontend ci
```

Use Node.js 20.19+ e npm 10+. Não use `--force` nem
`--legacy-peer-deps`: conflitos devem ser resolvidos por versões compatíveis.

## Comandos

Dentro de `frontend/`:

```bash
npm run dev        # Vite em http://127.0.0.1:5173
npm run lint       # ESLint, hooks React e acessibilidade
npm run typecheck  # TypeScript sem emitir arquivos
npm test           # Jest + jsdom; aceita zero testes nesta fase
npm run build      # bundle em dist/
npm run verify     # lint + tipos + testes + build
npm run audit      # vulnerabilidades altas ou críticas
```

O fluxo integrado recomendado roda na raiz com `npm run dev:all`,
`npm run build:all`, `npm run verify:all` e `npm run audit:all`.

## Fronteiras

- `app/` compõe a página e importa features somente por seus `index.ts`.
- `components/ui/` contém UI reutilizável sem endpoints ou regra de domínio.
- `features/` organiza tracker, cafeteria, estatísticas e laboratório.
- `lib/http.ts` é o único arquivo que chama `fetch`; adaptadores de endpoint
  ficam em `features/*/api.ts`.
- `types/api.ts` espelha o contrato HTTP sem importar o backend.
- `test/` contém somente setup e mocks técnicos do Jest; não há casos gerados.
- `styles/` mantém tokens, reset, estilos globais e preferências de movimento.

O proxy do Vite mantém frontend e API na mesma origem aparente durante o
desenvolvimento. No build, o Express entrega `frontend/dist` depois das rotas da
API, preservando a precedência dos endpoints.

Consulte [`../docs/testes/`](../docs/testes/estrutura.md) para entender Jest,
Jasmine e onde criar seus próprios testes.
