# Plano de execução — frontend-arquitetura

> gerado por `onp-spec plano` em 2026-09-01 04:22 — NÃO edite à mão;
> mudou tasks.md ou a config? Regenere: `onp-spec plano frontend-arquitetura --sequencial`

## Resumo — o que vai acontecer

- **modo SEQUENCIAL (escolha do usuário)**: 7 tarefa(s) pendente(s), UMA APÓS A OUTRA, na árvore principal
- sem worktrees e sem paralelismo — cada tarefa roda numa janela de contexto limpa, na ordem do tasks.md
- tudo acontece na branch de trabalho `spec/frontend-arquitetura`; levar para a main é decisão sua

## Ordem de execução (uma tarefa após a outra)

| tarefa | título | modelo | esforço |
|---|---|---|---|
| T-008 | Criar scaffold e instalar dependências | `gpt-5.6-terra` | medium |
| T-009 | Criar fundações e fronteiras de módulos | `gpt-5.6-terra` | high |
| T-010 | Implementar adaptadores HTTP tipados | `gpt-5.6-terra` | high |
| T-011 | Configurar Vite, proxy e execução conjunta | `gpt-5.6-terra` | medium |
| T-012 | Servir o build estático pelo Express | `gpt-5.6-terra` | medium |
| T-013 | Configurar testes e gate combinado | `gpt-5.6-terra` | high |
| T-014 | Documentar instalação e comandos integrados | `gpt-5.6-luna` | low |

## Gestão de branches e commits

1. branch de trabalho `spec/frontend-arquitetura` criada do ponto atual (se ainda não existir)
2. as tarefas rodam nela mesma, na ordem — **1 tarefa = 1 commit** (`T-xxx feature: título`), marcada `[concluida]` só com trabalho feito
3. gate final na branch de trabalho: `onp-spec verify frontend-arquitetura` + `onp-spec audit --ci` — **exit 0 ou não está pronto**

## Como executar

### ▶ Execução — Codex headless (codex exec)

```bash
bash .spec/features/frontend-arquitetura/executar-tarefas.sh
```

Cada tarefa roda `codex exec` com **janela de contexto limpa**, na árvore principal,
uma após a outra, com `--model` e `model_reasoning_effort` já definidos por tarefa e sandbox `workspace-write`.
Os prompts exatos estão embutidos no script.
Logs: `../onp-worktrees/cafeina-tracker-api-frontend-arquitetura-logs/`.

**Confirmação de custos — antes de executar**: os modelos e esforços por
tarefa estão nas tabelas acima; o agente CONFIRMA com o usuário se estão
dentro da licença/cota dele (modelo forte + esforço alto torra tokens).
Para gastar menos: `onp-spec plano frontend-arquitetura --modelo gpt-5.6-luna --esforco baixo`
(tudo) ou por tarefa `onp-spec tarefa frontend-arquitetura T-xxx --modelo <m> --esforco <nível>` — e regenere o plano.

### 📣 Acompanhamento — tabela + resumo no chat (a cada 1 min)

O script roda em **background**: o agente AVISA o usuário antes de iniciar e,
enquanto roda, posta no chat a cada ~1 minuto a **tabela de andamento** (qual
tarefa está rodando, qual não está, o que concluiu/falhou) junto com o
**resumo geral de andamento** (escrito por IA; sem IA, o motor resume). Ao
final, o usuário recebe o resumo completo da execução. A qualquer momento:

```bash
onp-spec resumo frontend-arquitetura --tabela   # a tabela de andamento
onp-spec resumo frontend-arquitetura            # o resumo em texto
```

