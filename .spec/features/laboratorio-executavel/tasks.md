# Tasks: Laboratório executável

> feature: laboratorio-executavel

## T-023 — Fechar decisões de ameaça e experiência [pendente]

- Refs: US-018, US-022, AC-054, AC-055, AC-070, AC-071
- Arquivos: .spec/features/laboratorio-executavel/spec.md, .spec/features/laboratorio-executavel/design.md, docs/laboratorio-executavel.md
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Não iniciar código enquanto Q-001 a Q-005 estiverem abertas.

## T-024 — Definir contratos e fixtures compartilhadas [pendente]

- Refs: US-019, US-020, US-021, AC-057, AC-059, AC-060, AC-063, AC-064, AC-065, AC-066, AC-067, AC-068
- Arquivos: src/laboratorio/tipos.ts, frontend/src/features/laboratorio/api/tipos.ts, frontend/src/features/laboratorio/api/fixtures.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: DTOs HTTP ficam separados entre backend e browser; fixtures precisam cobrir todos os estados terminais.

## T-025 — Construir imagem e harness isolados [pendente]

- Refs: US-020, US-022, AC-062, AC-070, AC-071
- Arquivos: infra/laboratorio/Dockerfile, infra/laboratorio/harness/jest-harness.ts, infra/laboratorio/harness/jasmine-harness.ts, infra/laboratorio/politica.json
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Rede desligada, usuário não root, rootfs read-only, tmpfs e limites obrigatórios.

## T-026 — Implementar política e diagnósticos determinísticos [pendente]

- Refs: US-021, AC-064, AC-065, AC-066, AC-067, AC-068, AC-069
- Arquivos: src/laboratorio/politica.ts, src/laboratorio/diagnosticos.ts
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Nenhuma orientação pode ser inventada; categorias e mensagens são contratos estáveis.

## T-027 — Implementar executor, fila e ciclo de vida [pendente]

- Refs: US-020, US-022, AC-060, AC-061, AC-062, AC-070, AC-071, AC-072
- Arquivos: src/laboratorio/executor.ts, src/laboratorio/fila.ts
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Executor não roda dentro do processo principal e sempre limpa o ambiente terminal.

## T-028 — Expor endpoints de execução e cancelamento [pendente]

- Refs: US-020, US-021, US-022, AC-060, AC-061, AC-062, AC-063, AC-072
- Arquivos: src/laboratorio/rotas.ts, src/servidor.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: POST 202, GET por ID, DELETE idempotente, 429 com Retry-After e respostas sanitizadas.

## T-029 — Implementar editor e proteção contra perda [pendente]

- Refs: US-018, US-019, US-023, AC-054, AC-055, AC-056, AC-057, AC-058, AC-059, AC-073, AC-075
- Arquivos: frontend/src/features/laboratorio/editor/EditorTeste.tsx, frontend/src/features/laboratorio/editor/EditorTeste.module.css, frontend/src/features/laboratorio/editor/ContratoExercicio.tsx, frontend/src/features/laboratorio/editor/BarraExecucao.tsx
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Implementar CodeMirror somente após Q-003; confirmar antes de descartar alterações.

## T-030 — Implementar cliente, polling e cancelamento [pendente]

- Refs: US-020, AC-060, AC-061, AC-062, AC-063, AC-072, AC-074
- Arquivos: frontend/src/features/laboratorio/api/execucoes.ts, frontend/src/features/laboratorio/editor/useExecucaoTeste.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Uma tentativa ativa, AbortController para polling e cancelamento real via API.

## T-031 — Implementar resultado e diagnóstico navegável [pendente]

- Refs: US-021, US-023, AC-063, AC-064, AC-065, AC-066, AC-067, AC-068, AC-069, AC-073, AC-074
- Arquivos: frontend/src/features/laboratorio/editor/ResultadoExecucao.tsx, frontend/src/features/laboratorio/editor/DiagnosticoTeste.tsx, frontend/src/features/laboratorio/editor/ResultadoExecucao.module.css
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Ir para linha, esperado/recebido rotulados e fallback honesto para diagnóstico desconhecido.

## T-032 — Integrar modos Guia e Praticar [pendente]

- Refs: US-018, US-019, US-023, AC-054, AC-055, AC-058, AC-073, AC-074, AC-075
- Arquivos: frontend/src/features/laboratorio/LaboratorioTestes.tsx, frontend/src/features/laboratorio/LaboratorioTestes.module.css, frontend/src/features/laboratorio/exemplos.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Guia atual permanece funcional; Praticar é progressivo e retorna ao guia sem perder acessibilidade.

## T-033 — Escrever provas automatizadas com Jest e Jasmine [pendente]

- Refs: US-018, US-019, US-020, US-021, US-022, US-023, AC-054, AC-055, AC-056, AC-057, AC-058, AC-059, AC-060, AC-061, AC-062, AC-063, AC-064, AC-065, AC-066, AC-067, AC-068, AC-069, AC-070, AC-071, AC-072, AC-073, AC-074, AC-075
- Arquivos: tests-jest/laboratorio, tests-jasmine/laboratorio, frontend/src/features/laboratorio/__tests__
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Tarefa reservada à pessoa autora do projeto. O agente não gera esses testes sem nova autorização explícita.

## T-034 — Executar hardening, QA e documentação [pendente]

- Refs: US-020, US-021, US-022, US-023, AC-062, AC-067, AC-068, AC-070, AC-071, AC-072, AC-073, AC-074, AC-075
- Arquivos: docs/laboratorio-executavel.md, docs/qa/laboratorio-executavel/README.md, .spec/features/laboratorio-executavel/qa-seguranca.md
- Modelo: gpt-5.6-luna
- Esforço: alto
- Notas: Threat model, limites reais, teardown, teclado, reduced motion e quatro viewports.
