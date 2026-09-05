# Tasks: Arquitetura e dependências do frontend

> feature: frontend-arquitetura

## T-008 — Criar scaffold e instalar dependências [pendente]
- Refs: US-008, AC-022, AC-023, AC-024, AC-033
- Arquivos: frontend/package.json, frontend/package-lock.json, frontend/index.html, frontend/tsconfig.json, frontend/tsconfig.app.json, frontend/tsconfig.node.json, frontend/eslint.config.js
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Usar create-vite react-ts; instalar por npm; nunca contornar peer dependencies com force.

## T-009 — Criar fundações e fronteiras de módulos [pendente]
- Refs: US-009, AC-025, AC-026
- Arquivos: frontend/src/app/App.tsx, frontend/src/components/ui/Button.tsx, frontend/src/components/ui/FieldMessage.tsx, frontend/src/components/ui/IconButton.tsx, frontend/src/components/ui/StatusPill.tsx, frontend/src/components/ui/index.ts, frontend/src/features/tracker/index.ts, frontend/src/features/cafeteria/index.ts, frontend/src/features/estatisticas/index.ts, frontend/src/features/laboratorio/exemplos.ts, frontend/src/features/laboratorio/index.ts, frontend/src/features/status/index.ts, frontend/src/lib/http.ts, frontend/src/lib/formatadores.ts, frontend/src/lib/classes.ts, frontend/src/styles/tokens.css, frontend/src/styles/reset.css, frontend/src/styles/globals.css, frontend/src/styles/motion.css, frontend/src/types/api.ts, frontend/src/main.tsx
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Cada diretório precisa conter responsabilidade real; evitar arquivos index que reexportem detalhes privados.

## T-010 — Implementar adaptadores HTTP tipados [pendente]
- Refs: US-009, AC-027, AC-032
- Arquivos: frontend/src/features/tracker/api.ts, frontend/src/features/cafeteria/api.ts, frontend/src/features/estatisticas/api.ts, frontend/src/features/status/api.ts, frontend/src/features/tracker/useTracker.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Fetch somente nos adaptadores; não gerar testes ou mocks nesta tarefa.

## T-011 — Configurar Vite, proxy e execução conjunta [pendente]
- Refs: US-010, AC-028, AC-029
- Arquivos: frontend/vite.config.ts, package.json, package-lock.json
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Preservar scripts existentes da API e usar strictPort para falha explícita.

## T-012 — Servir o build estático pelo Express [pendente]
- Refs: US-010, AC-030
- Arquivos: src/servidor.ts, tests-jest/servidor.test.ts
- Modelo: gpt-5.6-terra
- Esforço: medio
- Notas: Rotas da API mantêm precedência; teste prova entrega do index estático quando dist existe.

## T-013 — Configurar testes e gate combinado [pendente]
- Refs: US-011, AC-031, AC-032, AC-033
- Arquivos: frontend/jest.config.cjs, frontend/src/test/setup-jest.ts, frontend/src/test/styleMock.cjs, frontend/src/test/fileMock.cjs, frontend/eslint.config.js, frontend/package.json, scripts/run-spec-tests.mjs, onpspec.config.json, package.json
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Configurar Jest com jsdom e passWithNoTests; não criar casos de teste frontend. Jasmine permanece configurado na raiz.

## T-014 — Documentar instalação e comandos integrados [pendente]
- Refs: US-008, US-010, US-011, AC-022, AC-024, AC-028, AC-030, AC-031, AC-033
- Arquivos: README.md, frontend/README.md, docs/README.md, docs/arquitetura.md, docs/auditoria-arquitetura.md, docs/testes/jest.md, docs/testes/jasmine.md, docs/testes/estrutura.md
- Modelo: gpt-5.6-luna
- Esforço: baixo
- Notas: Incluir setup limpo, desenvolvimento, produção, testes, solução de portas ocupadas e teoria de Jest/Jasmine.
