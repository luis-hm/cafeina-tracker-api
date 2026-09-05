# Tasks: Cafeína Tracker API

> feature: cafeina-tracker-api

## T-001 — Configurar projeto, compilação e runners [concluida]
- Refs: US-007, AC-021
- Arquivos: package.json, package-lock.json, tsconfig.json, tsconfig.jest.json, jest.config.js, tests-jasmine/support/jasmine.json, onpspec.config.json, .gitignore
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Configurar CommonJS, TypeScript strict, Jest com relatório JSON e Jasmine sobre build compilado.

## T-002 — Implementar e testar a lógica do tracker [concluida]
- Refs: US-001, US-002, US-003, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009
- Arquivos: src/logica/tipos.ts, src/logica/tracker.ts, tests-jest/tracker.test.ts, tests-jasmine/tracker.spec.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Manter a matriz de casos identificada e equivalente nos dois frameworks.

## T-003 — Implementar e testar o serviço de cafeteria [concluida]
- Refs: US-004, AC-010, AC-011
- Arquivos: src/servico/cafeteria.ts, tests-jest/cafeteria.test.ts, tests-jasmine/cafeteria.spec.ts
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Controlar Math.random e o temporizador nos testes sem dependências de TypeScript em runtime.

## T-004 — Implementar e testar as estatísticas em memória [concluida]
- Refs: US-005, AC-012, AC-013, AC-014
- Arquivos: src/servico/estatisticas.ts, tests-jest/estatisticas.test.ts, tests-jasmine/estatisticas.spec.ts
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Todas as suítes que tocam estado devem chamar resetarEstatisticas em beforeEach.

## T-005 — Implementar e testar a API HTTP [concluida]
- Refs: US-006, AC-015, AC-016, AC-017, AC-018, AC-019
- Arquivos: src/servidor.ts, src/index.ts, tests-jest/servidor.test.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Exportar o app sem iniciar a porta; index.ts é o único ponto que chama listen.

## T-006 — Provar paridade das suítes e snapshot [concluida]
- Refs: US-007, AC-020
- Arquivos: tests-jest/paridade.test.ts, tests-jest/__snapshots__/tracker.test.ts.snap
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Comparar mecanicamente marcadores @paridade e manter um snapshot de ResultadoTracker no Jest.

## T-007 — Documentar instalação, execução e seminário [concluida]
- Refs: US-006, US-007, AC-015, AC-017, AC-019, AC-021
- Arquivos: README.md
- Modelo: gpt-5.6-luna
- Esforço: baixo
- Notas: Incluir comandos, endpoints, exemplos e a comparação resumida entre Jest e Jasmine.
