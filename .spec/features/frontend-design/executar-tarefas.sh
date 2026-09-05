#!/usr/bin/env bash
# executar-tarefas.sh — gerado por `onp-spec plano frontend-design` em 2026-09-01 04:38
# NÃO edite à mão: mudou tasks.md ou a config, regenere o plano.
#
# uso:
#   bash executar-tarefas.sh                  tudo (ondas → sequenciais → gate)
#   bash executar-tarefas.sh --faixa <id>     reexecuta UMA faixa (+ merge + gate)
#   bash executar-tarefas.sh --seq <T-xxx>    reexecuta UMA tarefa sequencial
#   bash executar-tarefas.sh --gate           só o gate (verify + audit)
#   bash executar-tarefas.sh --listar         mostra faixas, tarefas e estados
#   (acrescente --sem-gate para não rodar o gate ao final)
#
# resumo do que está rolando, a qualquer momento: onp-spec resumo frontend-design
set -u
set -o pipefail

RUN_ID='cafeina-tracker-api-frontend-design-mti6fnft'
FEATURE='frontend-design'
BASE_BRANCH='spec/frontend-design'
ENGINE='/home/dev/.codex/skills/onp-spec-driven/scripts/onp-spec.mjs'
CODEX_FLAGS=(--sandbox 'workspace-write')
STREAM_FLAGS=(--json)
FALHAS=""
COM_GATE=1
RESUMO_MODEL='gpt-5.6-luna'
RESUMO_PID=""

verde()    { printf '\033[32m%s\033[0m\n' "$*"; }
vermelho() { printf '\033[31m%s\033[0m\n' "$*"; }
amarelo()  { printf '\033[33m%s\033[0m\n' "$*"; }
info()     { printf '· %s\n' "$*"; }
falhar()   { vermelho "✘ $*"; exit 1; }

# eventos vão para o ledger GLOBAL (~/.onp-spec/painel/ledger.jsonl):
# um arquivo para todos os projetos, é o que o onp-spec resumo lê
evento() { node "$ENGINE" evento --run "$RUN_ID" "$@" >/dev/null 2>&1 || true; }

# ── ambiente (todos os modos passam por aqui) ────────────────────────
preparar_ambiente() {
  command -v git >/dev/null 2>&1 || falhar "git não encontrado"
  command -v node >/dev/null 2>&1 || falhar "node não encontrado"
  command -v codex >/dev/null 2>&1 || falhar "Codex CLI (codex) não encontrado — instale-o ou siga o modo manual em plano-execucao.md"
  TOPLEVEL=$(git rev-parse --show-toplevel 2>/dev/null) || falhar "fora de um repositório git"
  cd "$TOPLEVEL" || exit 1
  # artefatos recém-gerados pelo `onp-spec plano` são sujeira esperada:
  # se forem a ÚNICA sujeira, o script mesmo commita; qualquer outra, aborta
  if [ -n "$(git status --porcelain)" ]; then
    if [ -z "$(git status --porcelain | grep -v -e 'plano-execucao\.' -e 'plano\.json' -e 'executar-tarefas\.sh')" ]; then
      git add -A
      git commit -q -m "plano de execução: $FEATURE (artefatos gerados)"
      info "artefatos do plano commitados"
    else
      falhar "árvore suja além dos artefatos do plano — commite ou faça git stash antes (os worktrees partem do último commit)"
    fi
  fi
  git ls-files --error-unmatch -- '.spec/features/frontend-design/spec.md' >/dev/null 2>&1 || falhar "spec.md não está commitada — os worktrees das faixas precisam dela no git"
  ATUAL=$(git rev-parse --abbrev-ref HEAD)
  [ "$ATUAL" != "HEAD" ] || falhar "HEAD destacado — troque para uma branch"
  if [ "$ATUAL" != "$BASE_BRANCH" ]; then
    if git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
      git checkout -q "$BASE_BRANCH" || falhar "não consegui trocar para $BASE_BRANCH"
    else
      git checkout -q -b "$BASE_BRANCH" || falhar "não consegui criar $BASE_BRANCH"
    fi
    info "branch de trabalho: $BASE_BRANCH (a partir de $ATUAL)"
  fi
  git worktree prune
  LOG_DIR="$(dirname "$TOPLEVEL")/onp-worktrees/cafeina-tracker-api-frontend-design-logs"
  WT_BASE="$(dirname "$TOPLEVEL")/onp-worktrees/cafeina-tracker-api-frontend-design"
  STREAMS_DIR="${ONP_SPEC_HOME:-$HOME/.onp-spec}/painel/streams/$RUN_ID"
  mkdir -p "$LOG_DIR" "$STREAMS_DIR"
}

# worktree limpo mesmo depois de uma tentativa que falhou
preparar_worktree() { # $1=faixa $2=branch $3=worktree
  git worktree prune
  if [ -e "$3" ]; then git worktree remove --force "$3" >/dev/null 2>&1; rm -rf "$3"; fi
  if git show-ref --verify --quiet "refs/heads/$2"; then git branch -D "$2" >/dev/null 2>&1; fi
  git worktree add "$3" -b "$2" >/dev/null 2>&1 || { vermelho "✘ não consegui criar o worktree de $1 em $3"; return 1; }
}

tentativa() { # $1=faixa — conta reexecuções (vai para o ledger)
  local arq="$LOG_DIR/.tentativa-$1"
  local n=1
  [ -f "$arq" ] && n=$(( $(cat "$arq") + 1 ))
  printf "%s" "$n" > "$arq"
  printf "%s" "$n"
}

# uma tarefa = uma sessão codex exec headless com contexto limpo.
# o JSONL da sessão vira o stream da tarefa no ledger
rodar_tarefa() { # $1=escopo(faixa|seq) $2=T-xxx $3=prompt $4=modelo $5=esforço
  local chave="$1--$2"
  local stream="$STREAMS_DIR/$chave.jsonl"
  evento --tipo tarefa --tarefa "$2" --faixa "$1" --estado executando --stream "$chave"
  info "$2 — codex exec ($4 · $5) · stream: $chave"
  # --add-dir: o .git compartilhado dos worktrees mora no repo principal —
  # sem ele o sandbox workspace-write bloquearia o commit da tarefa
  if codex exec "$3" --model "$4" -c model_reasoning_effort="$5" "${STREAM_FLAGS[@]}" "${CODEX_FLAGS[@]}" --add-dir "$TOPLEVEL" > "$stream" 2>>"$LOG_DIR/$1.log"; then
    evento --tipo tarefa --tarefa "$2" --faixa "$1" --estado concluida --stream "$chave"
    node "$ENGINE" stream-resumo "$RUN_ID" "$chave" 2>/dev/null || true
    return 0
  fi
  evento --tipo tarefa --tarefa "$2" --faixa "$1" --estado falhou --stream "$chave"
  node "$ENGINE" stream-resumo "$RUN_ID" "$chave" 2>/dev/null || true
  return 1
}

mesclar_faixa() { # $1=faixa $2=branch $3=worktree $4=exit-da-faixa
  if [ "$4" -ne 0 ]; then
    evento --tipo faixa --faixa "$1" --estado falhou
    vermelho "✘ $1 falhou (log: $LOG_DIR/$1.log) — worktree mantido para inspeção: $3"
    amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --faixa $1"
    FALHAS="$FALHAS $1"; return 1
  fi
  evento --tipo faixa --faixa "$1" --estado mesclando
  if git merge --no-ff "$2" -m "merge $1 ($FEATURE)"; then
    git worktree remove --force "$3" >/dev/null 2>&1
    git branch -d "$2" >/dev/null 2>&1
    evento --tipo faixa --faixa "$1" --estado mesclada
    verde "✔ $1 mesclada em $BASE_BRANCH"
  else
    git merge --abort >/dev/null 2>&1
    evento --tipo faixa --faixa "$1" --estado conflito
    vermelho "✘ conflito ao mesclar $1 — resolva na mão: git merge $2 (worktree mantido: $3)"
    FALHAS="$FALHAS $1"; return 1
  fi
}

marcar_concluidas() { # $@=T-xxx
  for t in "$@"; do node "$ENGINE" tarefa "$FEATURE" "$t" concluida >/dev/null || true; done
}

# ── resumo geral de andamento: 1/min enquanto a execução roda ─────────
# escrito por IA (codex exec somente leitura) com fallback do motor; vai
# para o terminal e para o ledger — o agente repassa o texto no chat.
gerar_resumo() {
  local ctx ia
  ctx=$(node "$ENGINE" resumo "$FEATURE" --contexto 2>/dev/null) || ctx=""
  [ -n "$ctx" ] || return 0
  ia=$(codex exec "Você narra, para o dono do produto, uma execução de tarefas de código em andamento. Estado mecânico:

$ctx

Escreva o RESUMO GERAL DE ANDAMENTO: um parágrafo único de 2 a 4 frases, em português simples, dizendo o que está acontecendo agora, o que já terminou, o que falhou e se o usuário precisa agir. Sem markdown, sem listas." --model "$RESUMO_MODEL" --sandbox read-only --ephemeral 2>/dev/null)
  if [ -n "$ia" ]; then
    node "$ENGINE" resumo "$FEATURE" --gravar --origem ia --texto "$ia" >/dev/null 2>&1 || true
    printf '\n📣 resumo (IA): %s\n' "$ia"
  else
    node "$ENGINE" resumo "$FEATURE" --gravar >/dev/null 2>&1 || true
    printf '\n📣 resumo: %s\n' "$(node "$ENGINE" resumo "$FEATURE" 2>/dev/null)"
  fi
}

# mata o loop E o sleep filho — senão o sleep herda o stdout e quem chamou
# o script via pipe fica esperando EOF por até 60s depois do exit
parar_resumos() {
  [ -n "$RESUMO_PID" ] || return 0
  command -v pkill >/dev/null 2>&1 && pkill -P "$RESUMO_PID" 2>/dev/null
  kill "$RESUMO_PID" 2>/dev/null
  RESUMO_PID=""
}

iniciar_resumos() {
  ( while :; do sleep 60; gerar_resumo; done ) &
  RESUMO_PID=$!
  # ao sair: para o loop e grava um último resumo (o estado final, do motor)
  trap 'parar_resumos; node "$ENGINE" resumo "$FEATURE" --gravar >/dev/null 2>&1 || true' EXIT
}

# ── sequencial T-015 (ordem do tasks.md) ──
executar_seq_T_015() {
  info 'sequencial T-015 — Implementar tokens, fontes e fundações visuais'
  if rodar_tarefa seq 'T-015' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-015 — "Implementar tokens, fontes e fundações visuais"
  critérios/refs: AC-035 (Cores e tipografia seguem tokens únicos), AC-036 (A composição funciona de celular a desktop), AC-050 (Teclado, foco e regiões ao vivo seguem uma ordem estável)
  arquivos permitidos (e seus testes): frontend/src/styles/tokens.css, frontend/src/styles/reset.css, frontend/src/styles/globals.css, frontend/src/styles/motion.css, frontend/src/main.tsx
  mensagem de commit: "T-015 frontend-design: Implementar tokens, fontes e fundações visuais"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' high >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-015 frontend-design: Implementar tokens, fontes e fundações visuais (auto-commit do plano)'
    fi
    marcar_concluidas T-015
    verde "✔ T-015 concluída"
    return 0
  fi
  vermelho "✘ T-015 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-015"
  FALHAS="$FALHAS T-015"
  return 1
}

# ── sequencial T-016 (ordem do tasks.md) ──
executar_seq_T_016() {
  info 'sequencial T-016 — Montar o layout responsivo e o cabeçalho'
  if rodar_tarefa seq 'T-016' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-016 — "Montar o layout responsivo e o cabeçalho"
  critérios/refs: AC-034 (O painel abre com uma máquina de espresso interativa), AC-036 (A composição funciona de celular a desktop), AC-046 (A saúde da API fica visível sem dominar o cabeçalho)
  arquivos permitidos (e seus testes): frontend/src/app/App.tsx, frontend/src/app/App.module.css, frontend/src/components/AppHeader.tsx, frontend/src/components/AppHeader.module.css, frontend/src/components/ApiStatus.tsx
  mensagem de commit: "T-016 frontend-design: Montar o layout responsivo e o cabeçalho"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' high >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-016 frontend-design: Montar o layout responsivo e o cabeçalho (auto-commit do plano)'
    fi
    marcar_concluidas T-016
    verde "✔ T-016 concluída"
    return 0
  fi
  vermelho "✘ T-016 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-016"
  FALHAS="$FALHAS T-016"
  return 1
}

# ── sequencial T-017 (ordem do tasks.md) ──
executar_seq_T_017() {
  info 'sequencial T-017 — Implementar formulário e estados de cálculo'
  if rodar_tarefa seq 'T-017' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-017 — "Implementar formulário e estados de cálculo"
  critérios/refs: AC-037 (Sono e reuniões possuem controles acessíveis), AC-038 (Calcular comunica processamento sem permitir duplicação), AC-039 (Erros explicam como corrigir cada campo), AC-049 (Falhas de rede oferecem recuperação no contexto), AC-050 (Teclado, foco e regiões ao vivo seguem uma ordem estável)
  arquivos permitidos (e seus testes): frontend/src/features/tracker/components/PerfilForm.tsx, frontend/src/features/tracker/components/PerfilForm.module.css, frontend/src/features/tracker/useTracker.ts
  mensagem de commit: "T-017 frontend-design: Implementar formulário e estados de cálculo"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' high >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-017 frontend-design: Implementar formulário e estados de cálculo (auto-commit do plano)'
    fi
    marcar_concluidas T-017
    verde "✔ T-017 concluída"
    return 0
  fi
  vermelho "✘ T-017 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-017"
  FALHAS="$FALHAS T-017"
  return 1
}

# ── sequencial T-018 (ordem do tasks.md) ──
executar_seq_T_018() {
  info 'sequencial T-018 — Construir xícara-medidor, risco e motion principal'
  if rodar_tarefa seq 'T-018' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-018 — "Construir xícara-medidor, risco e motion principal"
  critérios/refs: AC-040 (A xícara representa proporcionalmente a recomendação), AC-041 (Cada risco tem texto, cor e sinal próprios), AC-042 (A animação principal ocorre uma vez e termina estável), AC-043 (Movimento reduzido preserva toda a informação)
  arquivos permitidos (e seus testes): frontend/src/features/tracker/components/XicaraMedidor.tsx, frontend/src/features/tracker/components/XicaraMedidor.module.css, frontend/src/features/tracker/components/RiscoGauge.tsx, frontend/src/features/tracker/components/ResultadoTracker.tsx
  mensagem de commit: "T-018 frontend-design: Construir xícara-medidor, risco e motion principal"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' xhigh >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-018 frontend-design: Construir xícara-medidor, risco e motion principal (auto-commit do plano)'
    fi
    marcar_concluidas T-018
    verde "✔ T-018 concluída"
    return 0
  fi
  vermelho "✘ T-018 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-018"
  FALHAS="$FALHAS T-018"
  return 1
}

# ── sequencial T-019 (ordem do tasks.md) ──
executar_seq_T_019() {
  info 'sequencial T-019 — Implementar cafeteria e média da sessão'
  if rodar_tarefa seq 'T-019' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-019 — "Implementar cafeteria e média da sessão"
  critérios/refs: AC-044 (A cafeteria possui estados de consulta completos), AC-045 (A média atualiza depois de um cálculo válido), AC-049 (Falhas de rede oferecem recuperação no contexto)
  arquivos permitidos (e seus testes): frontend/src/features/cafeteria/CafeteriaStatus.tsx, frontend/src/features/cafeteria/CafeteriaStatus.module.css, frontend/src/features/estatisticas/MediaCafes.tsx, frontend/src/features/estatisticas/MediaCafes.module.css
  mensagem de commit: "T-019 frontend-design: Implementar cafeteria e média da sessão"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' high >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-019 frontend-design: Implementar cafeteria e média da sessão (auto-commit do plano)'
    fi
    marcar_concluidas T-019
    verde "✔ T-019 concluída"
    return 0
  fi
  vermelho "✘ T-019 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-019"
  FALHAS="$FALHAS T-019"
  return 1
}

# ── sequencial T-020 (ordem do tasks.md) ──
executar_seq_T_020() {
  info 'sequencial T-020 — Implementar laboratório Jest versus Jasmine'
  if rodar_tarefa seq 'T-020' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-020 — "Implementar laboratório Jest versus Jasmine"
  critérios/refs: AC-047 (O laboratório abre como painel complementar), AC-048 (O laboratório compara o mesmo caso nos dois frameworks), AC-050 (Teclado, foco e regiões ao vivo seguem uma ordem estável), AC-051 (O caso de teste funciona como um guia linha por linha), AC-052 (A leitura guiada preserva o contexto do caso completo), AC-053 (O tráfego da API conecta o teste ao comportamento observado)
  arquivos permitidos (e seus testes): frontend/src/features/laboratorio/LaboratorioTestes.tsx, frontend/src/features/laboratorio/LaboratorioTestes.module.css, frontend/src/features/laboratorio/exemplos.ts
  mensagem de commit: "T-020 frontend-design: Implementar laboratório Jest versus Jasmine"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' xhigh >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-020 frontend-design: Implementar laboratório Jest versus Jasmine (auto-commit do plano)'
    fi
    marcar_concluidas T-020
    verde "✔ T-020 concluída"
    return 0
  fi
  vermelho "✘ T-020 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-020"
  FALHAS="$FALHAS T-020"
  return 1
}

# ── sequencial T-021 (ordem do tasks.md) ──
executar_seq_T_021() {
  info 'sequencial T-021 — Integrar motion acessível e estados globais'
  if rodar_tarefa seq 'T-021' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-021 — "Integrar motion acessível e estados globais"
  critérios/refs: AC-034 (O painel abre com uma máquina de espresso interativa), AC-042 (A animação principal ocorre uma vez e termina estável), AC-043 (Movimento reduzido preserva toda a informação), AC-049 (Falhas de rede oferecem recuperação no contexto), AC-050 (Teclado, foco e regiões ao vivo seguem uma ordem estável)
  arquivos permitidos (e seus testes): frontend/src/app/App.tsx, frontend/src/styles/motion.css
  mensagem de commit: "T-021 frontend-design: Integrar motion acessível e estados globais"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-terra' high >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-021 frontend-design: Integrar motion acessível e estados globais (auto-commit do plano)'
    fi
    marcar_concluidas T-021
    verde "✔ T-021 concluída"
    return 0
  fi
  vermelho "✘ T-021 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-021"
  FALHAS="$FALHAS T-021"
  return 1
}

# ── sequencial T-022 (ordem do tasks.md) ──
executar_seq_T_022() {
  info 'sequencial T-022 — Executar QA responsivo e documentar a interface'
  if rodar_tarefa seq 'T-022' 'Você executa UMA tarefa da feature "frontend-design" (fluxo onp-spec, spec-anchored).
Leia primeiro: .spec/features/frontend-design/spec.md, .spec/features/frontend-design/tasks.md e .spec/constituicao.md.

Sua tarefa (somente ela):
T-022 — "Executar QA responsivo e documentar a interface"
  critérios/refs: AC-034 (O painel abre com uma máquina de espresso interativa), AC-036 (A composição funciona de celular a desktop), AC-043 (Movimento reduzido preserva toda a informação), AC-050 (Teclado, foco e regiões ao vivo seguem uma ordem estável)
  arquivos permitidos (e seus testes): docs/frontend-design.md, .spec/features/frontend-design/qa-visual.md
  mensagem de commit: "T-022 frontend-design: Executar QA responsivo e documentar a interface"

Regras inegociáveis:
- Todo critério de aceite referenciado vira teste com @spec:AC-xxx no título.
- NUNCA enfraqueça, pule (skip/todo) ou apague um teste para passar — teste pulado não é prova e o audit acusa.
- Rode os testes localmente com `npm run test:spec:all` até passarem.
- NÃO edite tasks.md, NÃO rode onp-spec verify/audit e NÃO toque em outras tarefas — o orquestrador cuida disso.
- Ao final de CADA tarefa: `git add` só no que você tocou e um commit próprio.' 'gpt-5.6-luna' medium >> "$LOG_DIR/seq.log" 2>&1; then
    # commit de segurança se o agente esqueceu (rastreabilidade > perfeição)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A && git commit -q -m 'T-022 frontend-design: Executar QA responsivo e documentar a interface (auto-commit do plano)'
    fi
    marcar_concluidas T-022
    verde "✔ T-022 concluída"
    return 0
  fi
  vermelho "✘ T-022 falhou (log: $LOG_DIR/seq.log)"
  amarelo "  reexecute só ela: bash .spec/features/frontend-design/executar-tarefas.sh --seq T-022"
  FALHAS="$FALHAS T-022"
  return 1
}

# ── gate: quem decide é a máquina ────────────────────────────────────
rodar_gate() {
  echo
  info "gate: verify + audit --ci"
  evento --tipo gate --etapa inicio
  node "$ENGINE" verify "$FEATURE"
  local v=$?
  evento --tipo gate --etapa verify --exit "$v"
  node "$ENGINE" audit --ci
  AUDIT=$?
  evento --tipo gate --etapa audit --exit "$AUDIT"
  # fecha a contabilidade: status das tarefas + prova do verify no git
  if [ -n "$(git status --porcelain -- '.spec')" ]; then
    git add -A -- '.spec'
    git commit -q -m "$FEATURE: status das tarefas + prova do verify (plano)"
    info "status das tarefas e prova do verify commitados"
  fi
  return "$AUDIT"
}

encerrar() { # $1=escopo
  echo
  if [ -n "$FALHAS" ]; then vermelho "faixas/tarefas com falha:$FALHAS"; fi
  # sem gate não existe veredito: NUNCA anunciar alinhamento sem o audit
  if [ "$COM_GATE" -eq 0 ]; then
    evento --tipo fim --exit 1 --escopo "$1"
    if [ -z "$FALHAS" ]; then
      amarelo "○ trabalho de '$1' terminou SEM o gate (--sem-gate) — isto NÃO é prova de nada"
      amarelo "  para o veredito: bash .spec/features/frontend-design/executar-tarefas.sh --gate"
      exit 0
    fi
    vermelho "e ainda há falhas — conserte e rode o gate"
    exit 1
  fi
  rodar_gate
  local audit=$?
  if [ "$audit" -eq 0 ] && [ -z "$FALHAS" ]; then
    evento --tipo fim --exit 0 --escopo "$1"
    verde "✔ plano concluído — especificação e código alinhados (audit exit 0) na branch $BASE_BRANCH"
    info "próximo passo: revise e leve para a main quando quiser (git merge $BASE_BRANCH)"
    exit 0
  fi
  evento --tipo fim --exit 1 --escopo "$1"
  vermelho "plano terminou com pendências — leia a saída do audit acima e os logs em $LOG_DIR"
  amarelo "dica: reexecute só o que falhou (--faixa <id> / --seq <T-xxx>)"
  exit 1
}

executar_tudo() {
  evento --tipo inicio --escopo tudo
  iniciar_resumos
  info "logs em: $LOG_DIR"
  info "resumo geral de andamento: a cada 1 min aqui no terminal (e via: onp-spec resumo)"
  executar_seq_T_015 || true
  executar_seq_T_016 || true
  executar_seq_T_017 || true
  executar_seq_T_018 || true
  executar_seq_T_019 || true
  executar_seq_T_020 || true
  executar_seq_T_021 || true
  executar_seq_T_022 || true
  encerrar tudo
}

listar() {
  echo "execução: $RUN_ID (feature $FEATURE, branch $BASE_BRANCH)"
  echo "  seq       T-015 (sequencial)"
  echo "  seq       T-016 (sequencial)"
  echo "  seq       T-017 (sequencial)"
  echo "  seq       T-018 (sequencial)"
  echo "  seq       T-019 (sequencial)"
  echo "  seq       T-020 (sequencial)"
  echo "  seq       T-021 (sequencial)"
  echo "  seq       T-022 (sequencial)"
  echo
  echo "reexecutar uma faixa:    --faixa <id>"
  echo "reexecutar sequencial:   --seq <T-xxx>"
  echo "só o gate:               --gate"
}

MODO="tudo"
ALVO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --listar) MODO="listar" ;;
    --gate) MODO="gate" ;;
    --sem-gate) COM_GATE=0 ;;
    --faixa) MODO="faixa"; ALVO="${2:-}"; shift ;;
    --seq) MODO="seq"; ALVO="${2:-}"; shift ;;
    -h|--help) sed -n "2,14p" "$0"; exit 0 ;;
    *) vermelho "argumento desconhecido: $1"; sed -n "2,14p" "$0"; exit 2 ;;
  esac
  shift
done

if [ "$MODO" = "listar" ]; then listar; exit 0; fi

preparar_ambiente

case "$MODO" in
  tudo) executar_tudo ;;
  gate) COM_GATE=1; iniciar_resumos; encerrar gate ;;
  faixa)
    case "$ALVO" in
      *) falhar "faixa desconhecida: '$ALVO' — veja as disponíveis com --listar" ;;
    esac ;;
  seq)
    case "$ALVO" in
      T-015) evento --tipo inicio --escopo "seq:T-015"; iniciar_resumos; executar_seq_T_015 || true; encerrar "seq:T-015" ;;
      T-016) evento --tipo inicio --escopo "seq:T-016"; iniciar_resumos; executar_seq_T_016 || true; encerrar "seq:T-016" ;;
      T-017) evento --tipo inicio --escopo "seq:T-017"; iniciar_resumos; executar_seq_T_017 || true; encerrar "seq:T-017" ;;
      T-018) evento --tipo inicio --escopo "seq:T-018"; iniciar_resumos; executar_seq_T_018 || true; encerrar "seq:T-018" ;;
      T-019) evento --tipo inicio --escopo "seq:T-019"; iniciar_resumos; executar_seq_T_019 || true; encerrar "seq:T-019" ;;
      T-020) evento --tipo inicio --escopo "seq:T-020"; iniciar_resumos; executar_seq_T_020 || true; encerrar "seq:T-020" ;;
      T-021) evento --tipo inicio --escopo "seq:T-021"; iniciar_resumos; executar_seq_T_021 || true; encerrar "seq:T-021" ;;
      T-022) evento --tipo inicio --escopo "seq:T-022"; iniciar_resumos; executar_seq_T_022 || true; encerrar "seq:T-022" ;;
      *) falhar "tarefa sequencial desconhecida: '$ALVO' — veja as disponíveis com --listar" ;;
    esac ;;
esac
