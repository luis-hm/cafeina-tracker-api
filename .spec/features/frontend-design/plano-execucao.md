# Plano de execução — frontend-design

> gerado por `onp-spec plano` em 2026-09-01 04:38 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano frontend-design --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 8 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/frontend-design`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-015 | Implementar tokens, fontes e fundações visuais | `gpt-5.6-terra` | high |
| T-016 | Montar o layout responsivo e o cabeçalho | `gpt-5.6-terra` | high |
| T-017 | Implementar formulário e estados de cálculo | `gpt-5.6-terra` | high |
| T-018 | Construir xícara-medidor, risco e motion principal | `gpt-5.6-terra` | xhigh |
| T-019 | Implementar cafeteria e média da sessão | `gpt-5.6-terra` | high |
| T-020 | Implementar laboratório Jest versus Jasmine | `gpt-5.6-terra` | xhigh |
| T-021 | Integrar motion acessível e estados globais | `gpt-5.6-terra` | high |
| T-022 | Executar QA responsivo e documentar a interface | `gpt-5.6-luna` | medium |

## Gestão de branches e commits

1. branch de trabalho `spec/frontend-design` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify frontend-design` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Execução — Codex headless (codex exec)

```bash
bash .spec/features/frontend-design/executar-tarefas.sh
```

Cada tarefa roda `codex exec` com **janela de contexto limpa**, na árvore principal,
uma após a outra, com `--model` e `model_reasoning_effort` já definidos por tarefa e sandbox `workspace-write`.
Os prompts exatos estão embutidos no script.
Logs: `../onp-worktrees/cafeina-tracker-api-frontend-design-logs/`.

**Confirmação de custos — antes de executar**: os modelos e esforços por
tarefa estão nas tabelas acima; o agente CONFIRMA com o usuário se estão
dentro da licença/cota dele (modelo forte + esforço alto torra tokens).
Para gastar menos: `onp-spec plano frontend-design --modelo gpt-5.6-luna --esforco baixo`
(tudo) ou por tarefa `onp-spec tarefa frontend-design T-xxx --modelo <m> --esforco <nível>` — e regenere o plano.

### 📣 Acompanhamento — tabela + resumo no chat (a cada 1 min)

O script roda em **background**: o agente AVISA o usuário antes de iniciar e,
enquanto roda, posta no chat a cada ~1 minuto a **tabela de andamento** (qual
tarefa está rodando, qual não está, o que concluiu/falhou) junto com o
**resumo geral de andamento** (escrito por IA; sem IA, o motor resume). Ao
final, o usuário recebe o resumo completo da execução. A qualquer momento:

```bash
onp-spec resumo frontend-design --tabela   # a tabela de andamento
onp-spec resumo frontend-design            # o resumo em texto
```

