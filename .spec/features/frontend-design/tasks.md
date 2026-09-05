# Tasks: Design e animações do frontend

> feature: frontend-design

## T-015 — Implementar tokens, fontes e fundações visuais [em-andamento]
- Refs: US-012, AC-035, AC-036, AC-050
- Arquivos: frontend/src/styles/tokens.css, frontend/src/styles/reset.css, frontend/src/styles/globals.css, frontend/src/styles/motion.css, frontend/src/main.tsx
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Importar fontes locais; tokens são a única origem de valores compartilhados.

## T-016 — Montar o layout responsivo e o cabeçalho [em-andamento]
- Refs: US-012, US-015, AC-034, AC-036, AC-046
- Arquivos: frontend/src/app/App.tsx, frontend/src/app/App.module.css, frontend/src/components/AppHeader.tsx, frontend/src/components/AppHeader.module.css, frontend/src/components/ApiStatus.tsx
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Ordem DOM igual à visual; implementar online, verificando e offline sem gerar testes.

## T-017 — Implementar formulário e estados de cálculo [em-andamento]
- Refs: US-013, US-017, AC-037, AC-038, AC-039, AC-049, AC-050
- Arquivos: frontend/src/features/tracker/components/PerfilForm.tsx, frontend/src/features/tracker/components/PerfilForm.module.css, frontend/src/features/tracker/useTracker.ts
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Range, stepper, submit único, foco do primeiro erro e recuperação de rede.

## T-018 — Construir xícara-medidor, risco e motion principal [em-andamento]
- Refs: US-014, AC-040, AC-041, AC-042, AC-043
- Arquivos: frontend/src/features/tracker/components/XicaraMedidor.tsx, frontend/src/features/tracker/components/XicaraMedidor.module.css, frontend/src/features/tracker/components/RiscoGauge.tsx, frontend/src/features/tracker/components/ResultadoTracker.tsx
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Custom SVG é visualização de domínio; reduced motion remove transforms e loops.

## T-019 — Implementar cafeteria e média da sessão [em-andamento]
- Refs: US-015, US-017, AC-044, AC-045, AC-049
- Arquivos: frontend/src/features/cafeteria/CafeteriaStatus.tsx, frontend/src/features/cafeteria/CafeteriaStatus.module.css, frontend/src/features/estatisticas/MediaCafes.tsx, frontend/src/features/estatisticas/MediaCafes.module.css
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: Não adicionar atraso artificial; todos os estados possuem texto e retry.

## T-020 — Implementar laboratório Jest versus Jasmine [em-andamento]
- Refs: US-016, AC-047, AC-048, AC-050, AC-051, AC-052, AC-053
- Arquivos: frontend/src/features/laboratorio/LaboratorioTestes.tsx, frontend/src/features/laboratorio/LaboratorioTestes.module.css, frontend/src/features/laboratorio/exemplos.ts
- Modelo: gpt-5.6-terra
- Esforço: xalto
- Notas: Dialog, focus trap, tabs por teclado, Escape, retorno de foco e guia linha por linha são obrigatórios. Esta tarefa não cria editor nem executa código arbitrário.

## T-021 — Integrar motion acessível e estados globais [em-andamento]
- Refs: US-012, US-014, US-017, AC-034, AC-042, AC-043, AC-049, AC-050
- Arquivos: frontend/src/app/App.tsx, frontend/src/styles/motion.css
- Modelo: gpt-5.6-terra
- Esforço: alto
- Notas: MotionConfig reducedMotion=user; uma sequência principal, sem decoração infinita.

## T-022 — Executar QA responsivo e documentar a interface [em-andamento]
- Refs: US-012, US-013, US-014, US-015, US-016, US-017, AC-034, AC-036, AC-043, AC-050
- Arquivos: docs/frontend-design.md, .spec/features/frontend-design/qa-visual.md
- Modelo: gpt-5.6-luna
- Esforço: medio
- Notas: Registrar screenshots e resultados do checklist nos quatro viewports definidos.
