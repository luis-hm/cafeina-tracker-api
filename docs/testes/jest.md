# Jest: teoria e uso no projeto

## O que é

Jest é um test runner com biblioteca de asserções, mocks, spies, snapshots,
temporizadores falsos e relatório de cobertura no mesmo ecossistema. Ele:

1. descobre arquivos pelo padrão configurado;
2. prepara um ambiente isolado para cada suíte;
3. transforma TypeScript/TSX em JavaScript;
4. executa os casos e compara valores com `expect`;
5. encerra com código diferente de zero quando um caso falha.

Na API o ambiente é Node.js. No frontend o ambiente é `jsdom`, uma simulação do
DOM que permite renderizar componentes React sem abrir um navegador real.

## Modelo mental

- `describe` agrupa um comportamento.
- `test` ou `it` descreve um exemplo observável.
- `expect` expressa o resultado esperado.
- `beforeEach` prepara um estado limpo.
- `afterEach` desfaz mocks e recursos.
- `jest.fn()` cria uma função observável.
- `jest.spyOn()` acompanha ou substitui temporariamente uma função existente.

Uma forma simples de organizar cada caso é AAA:

1. **Arrange**: preparar entradas, dependências e estado.
2. **Act**: executar exatamente o comportamento que está sendo testado.
3. **Assert**: verificar a saída ou efeito observável.

Evite testar funções privadas, nomes de variáveis ou detalhes de implementação.
Prefira retorno, mensagem, status HTTP e comportamento percebido pelo usuário.

## Configuração existente

### API

- Configuração: `jest.config.js`
- TypeScript: `tsconfig.jest.json`
- Associação do editor: `tests-jest/tsconfig.json`
- Pasta: `tests-jest/`
- Ambiente: `node`
- Transformação: `ts-jest`

O arquivo dentro de `tests-jest/` estende a configuração da raiz e permite que
o editor descubra automaticamente os tipos Jest. A opção `isolatedModules` fica
restrita a esse projeto para suportar a transformação `ts-jest` com módulos
Node16 sem alterar a compilação Jasmine.

### Frontend

- Configuração: `frontend/jest.config.cjs`
- Setup: `frontend/src/test/setup-jest.ts`
- Mocks técnicos: `frontend/src/test/styleMock.cjs` e `fileMock.cjs`
- Ambiente: `jsdom`
- Transformação: SWC para TypeScript, TSX e JSX automático do React
- Descoberta futura: `frontend/src/**/*.test.ts` e `*.test.tsx`

`@testing-library/jest-dom` já está carregado no setup. Testing Library também
está instalada para que os futuros testes interajam por papel, rótulo e texto.

## Onde criar seus testes

Para uma unidade da API:

```text
src/logica/tracker.ts
tests-jest/tracker.test.ts
```

Para um componente React, mantenha o teste próximo ao componente:

```text
frontend/src/features/tracker/components/PerfilForm.tsx
frontend/src/features/tracker/components/PerfilForm.test.tsx
```

Exemplo apenas didático, não criado no projeto:

```tsx
describe('PerfilForm', () => {
  test('envia os valores preenchidos', async () => {
    // Arrange: renderizar e preparar o usuário.
    // Act: preencher pelos rótulos e acionar o botão.
    // Assert: verificar a chamada ou resultado visível.
  })
})
```

## Comandos

```bash
# Jest da API
npm run test:jest

# Cobertura da API
npm run test:jest:coverage

# Tipagem dos testes com o projeto detectado pelo editor
npm run typecheck:jest

# Jest do frontend; aceita zero testes enquanto a suíte está vazia
npm run test:frontend

# Modo watch do frontend
npm --prefix frontend run test:watch

# Cobertura futura do frontend
npm --prefix frontend run test:coverage
```

## Quando usar mocks

Use mocks em fronteiras lentas ou não determinísticas: rede, relógio, sorteio e
sistema de arquivos. Não faça mock da própria unidade testada. Um teste com
mocks demais costuma provar o roteiro do mock, não o comportamento real.

Snapshots são úteis para estruturas estáveis e pequenas. Sempre leia a mudança
do snapshot antes de aceitá-la; atualizar automaticamente pode esconder uma
regressão.

Os reporters usam `html` e `lcovonly`: o primeiro gera a navegação em
`coverage/` e o segundo gera somente `coverage/lcov.info`, evitando uma segunda
árvore HTML em `coverage/lcov-report/`.
