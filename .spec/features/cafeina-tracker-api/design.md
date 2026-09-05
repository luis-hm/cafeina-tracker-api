# Design: Cafeína Tracker API

## Visão arquitetural

```text
cliente HTTP
    ↓
app Express (src/servidor.ts)
    ├── lógica pura (src/logica/tracker.ts)
    ├── cafeteria assíncrona (src/servico/cafeteria.ts)
    └── estatísticas em memória (src/servico/estatisticas.ts)

src/index.ts → inicia a porta somente em execução de produção
```

## Limites dos módulos

- `src/logica/tipos.ts`: contratos de domínio compartilhados, sem runtime.
- `src/logica/tracker.ts`: cálculo, risco, validação, sorteio e composição;
  funções síncronas e puras, exceto pelo ponto aleatório exportado.
- `src/servico/cafeteria.ts`: única simulação assíncrona; valida o ID antes de
  agendar o temporizador e usa dois sorteios independentes.
- `src/servico/estatisticas.ts`: encapsula a lista mutável e expõe somente
  registrar, calcular média e reiniciar.
- `src/servidor.ts`: casca HTTP; valida `unknown`, traduz erros e não chama
  `listen`, permitindo testes Supertest sem ocupar porta.
- `src/index.ts`: composição de processo e porta configurável.

## Compilação e testes

- CommonJS mantém Express, Jest e Jasmine simples no Node.js LTS.
- `tsconfig.json` compila `src/` e `tests-jasmine/` para `build/`, com globais
  Jasmine isoladas.
- `tsconfig.jest.json` troca apenas os tipos globais e inclui `tests-jest/`;
  `ts-jest` transpila essa suíte sem gerar artefatos.
- Jasmine aponta para `build/tests-jasmine/**/*.spec.js`, nunca para TypeScript.
- O gate remove o relatório Jest anterior, compila, executa Jasmine e então
  executa Jest com JSON. Assim uma falha anterior ao Jest não pode reutilizar
  prova obsoleta.

## Estratégia de teste

- Casos da lógica recebem marcadores `@paridade:<id>` idênticos nas duas
  suítes; um teste Jest compara os conjuntos.
- Cada critério observável possui `@spec:AC-xxx` no título de pelo menos um
  teste Jest; a lógica repete essas tags no Jasmine para facilitar a leitura.
- `Math.random` é restaurado após cada teste; temporizadores falsos eliminam
  a espera real dos testes da cafeteria.
- Estatísticas são reiniciadas em todo `beforeEach` que toca estado global.
- O snapshot captura um `ResultadoTracker` determinístico, não respostas com
  valores aleatórios livres.

## Formatos HTTP

- Sucesso do tracker: `ResultadoTracker` diretamente.
- Falha de validação do tracker: `ErroValidacao[]` diretamente.
- Falhas da cafeteria: `{ "mensagem": "cafeteriaId inválido." }`.
- Estatísticas: `{ "mediaCafes": number }`.
- Saúde: `{ "mensagem": "Cafeína Tracker API está no ar." }`.
