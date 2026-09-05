# Estrutura recomendada para testes

## Estado atual

```text
cafeina-tracker-api/
├── jest.config.js                    # Jest da API
├── tsconfig.jest.json                # tipos/compilação do Jest da API
├── tests-jest/                       # suíte Jest existente da API
│   └── tsconfig.json                 # associa os testes ao projeto Jest no editor
├── tests-jasmine/                    # suíte Jasmine existente da API
│   └── support/jasmine.json
└── frontend/
    ├── jest.config.cjs               # Jest React configurado
    └── src/
        └── test/
            ├── setup-jest.ts         # matchers de DOM
            ├── styleMock.cjs         # substitui CSS no Node
            └── fileMock.cjs          # substitui assets no Node
```

Não há arquivos `*.test.*` no frontend. Quando você começar a escrevê-los, a
configuração já os encontrará automaticamente.

O `tests-jest/tsconfig.json` estende a configuração Jest da raiz. Ele existe
para que editores baseados no servidor TypeScript não coloquem esses arquivos
em um projeto inferido nem carreguem os globais de Jest e Jasmine ao mesmo
tempo.

## Convenção de nomes

| Contexto | Pasta | Sufixo |
|---|---|---|
| API com Jest | `tests-jest/` | `.test.ts` |
| API com Jasmine | `tests-jasmine/` | `.spec.ts` |
| React com Jest | ao lado do componente em `frontend/src/` | `.test.tsx` |
| Função frontend com Jest | ao lado do módulo em `frontend/src/` | `.test.ts` |

Não use `.spec.tsx` no frontend: esse sufixo fica reservado ao Jasmine da API e
evita dúvidas sobre qual runner executa cada arquivo.

## Estratégia sugerida

1. Comece pelas funções puras em `src/logica/`.
2. Repita a mesma matriz essencial em Jest e Jasmine quando o objetivo for
   comparar os frameworks.
3. Cubra adaptadores e endpoints com Jest/Supertest.
4. No frontend, teste comportamento visível com Jest/Testing Library.
5. Adicione casos de erro e assincronismo depois do caminho principal.
6. Só então use cobertura para encontrar lacunas; não trate porcentagem como
   substituto de bons cenários.

## Pirâmide prática para este projeto

- Muitos testes de funções puras: rápidos e determinísticos.
- Alguns testes de integração HTTP: provam rotas, status e payloads.
- Alguns testes de componentes React: provam interação e acessibilidade.
- Nenhum teste de navegador completo está configurado neste escopo.

## Comandos consolidados

```bash
npm run test:jest       # API com Jest
npm run typecheck:jest  # tipos dos testes Jest e associação do editor
npm run test:jasmine    # API compilada com Jasmine
npm test                # ambos na API
npm run test:frontend   # Jest/jsdom do frontend
npm run test:all        # API e frontend
npm run verify:all      # build, tipos Jest, testes, lint e tipos frontend
```

Enquanto o frontend não tiver testes, seu comando Jest encerra com sucesso por
usar `--passWithNoTests`. Remova essa flag somente quando quiser tornar a
ausência total de testes uma falha obrigatória do CI.
