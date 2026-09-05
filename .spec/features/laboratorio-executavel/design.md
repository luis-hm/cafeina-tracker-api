# Design técnico: laboratório executável

## 1. Decisão central

O navegador edita e apresenta resultados; ele não executa o código. A API
coordena uma fila, mas também não interpreta o teste. Cada tentativa é enviada
a um executor isolado e descartável.

```text
Editor React
    │ POST /laboratorio/execucoes
    ▼
API Express ── valida tamanho, runner e imports ──► fila limitada
    ▲                                                   │
    │ GET estado/resultado                              ▼
    └────────────────────────────────────────── container efêmero
                                                   │
                                      Jest OU Jasmine + harness fixo
                                                   │
                                      resultado JSON sanitizado
```

Não usar `eval`, `Function`, `vm`, Worker ou child process sem isolamento
de sistema operacional. Essas opções ainda permitem acesso perigoso à máquina
quando o código é controlado pela pessoa usuária.

## 2. Experiência

O drawer atual recebe dois modos:

- **Guia:** experiência estática já implementada.
- **Praticar:** editor, comandos e resultado da tentativa.

O botão **Praticar este caso** copia o exemplo selecionado. A cópia possui um
`exerciseRevision`; modificar o código marca o documento como sujo. Trocar
runner, restaurar ou fechar exige confirmação quando há alteração ainda não
executada.

```text
┌──────────────────────────────────────────────────────────────┐
│ LABORATÓRIO                              [Guia] [Praticar] × │
├────────────────────────────────┬─────────────────────────────┤
│ Jest · tracker.test.ts         │ OBJETIVO E CONTRATO         │
│  1 test('...', async () => {   │ Entrada: sono 6 / reuniões 2│
│  2   ...                       │ Esperado: 4 cafés           │
│ 10   expect(...).toBe(4)       │ Permitido: request, app...  │
│                                │                             │
│ [Restaurar] [Executar teste]   │ ESTADO / DIAGNÓSTICO        │
│                                │ Expectativa falhou · L10    │
│                                │ esperado 4 · recebido 3     │
└────────────────────────────────┴─────────────────────────────┘
```

Em telas menores, objetivo aparece antes do editor e resultado depois. Editor e
resultado possuem regiões próprias, nunca duas barras de rolagem horizontais.

## 3. Modelo de estados do frontend

```text
ready ──execute──► queued ──start──► running ──► passed
  ▲                   │                │         failed
  │                   └─cancel─────────┴──────── cancelled
  │                                              timed-out
  └──────── restore / edit ◄──────────────────── rejected
```

Estados terminais: `passed`, `failed`, `rejected`, `timed-out`,
`cancelled` e `internal-error`.

Um `AbortController` interrompe polling no cliente, mas cancelar de verdade
exige `DELETE /laboratorio/execucoes/:id`.

## 4. Contrato HTTP proposto

### Criar tentativa

`POST /laboratorio/execucoes`

```json
{
  "runner": "jest",
  "codigo": "test(...)",
  "exerciseRevision": "calc-base-v1"
}
```

Resposta `202 Accepted`:

```json
{
  "id": "exec_...",
  "estado": "queued",
  "posicaoFila": 1,
  "criadaEm": "2026-09-01T00:00:00.000Z"
}
```

### Consultar tentativa

`GET /laboratorio/execucoes/:id`

```json
{
  "id": "exec_...",
  "runner": "jest",
  "estado": "failed",
  "duracaoMs": 184,
  "resumo": { "total": 1, "passou": 0, "falhou": 1 },
  "diagnosticos": [
    {
      "categoria": "expectation",
      "linha": 10,
      "coluna": 3,
      "titulo": "A expectativa recebeu outro valor",
      "mensagem": "Esperado 4, recebido 3.",
      "esperado": 4,
      "recebido": 3,
      "matcher": "toBe",
      "orientacao": "Confira os dados enviados e a regra calculada antes de mudar a expectativa."
    }
  ]
}
```

### Cancelar

`DELETE /laboratorio/execucoes/:id` responde `202` enquanto solicita o
encerramento e é idempotente para estados já terminais.

Erros de contrato usam `400`; tentativa desconhecida usa `404`; fila sem
capacidade usa `429` com `Retry-After`; falha do coordenador usa `503`.

## 5. Diagnósticos

Categorias estáveis:

| Categoria | Fonte | Informação exibida |
|---|---|---|
| `syntax` | parser TypeScript | linha, coluna, trecho e mensagem traduzida |
| `expectation` | reporter Jest/Jasmine | matcher, esperado, recebido e linha |
| `runtime` | exceção no runner | mensagem e stack sanitizada |
| `policy` | validador de imports/APIs | recurso proibido e alternativa |
| `timeout` | supervisor do sandbox | limite e causas comuns |
| `internal` | coordenador | ID de correlação, sem detalhes internos |

O servidor mantém um catálogo de mensagens conhecidas. Se não houver causa
determinística, a UI diz que não conseguiu classificar, mostra o trecho seguro
do runner e não sugere alteração específica.

## 6. Política do sandbox

Configuração recomendada do container:

- imagem versionada com Node, Jest, Jasmine, TypeScript e harness;
- execução como UID/GID não privilegiado;
- rede desabilitada;
- root filesystem somente leitura;
- `tmpfs` exclusivo e apagado ao terminar;
- sem socket Docker, volumes do projeto, secrets ou variáveis do host;
- 1 CPU, 128 MB, 32 PIDs, 5 segundos e 64 KB de stdout/stderr;
- capabilities removidas, `no-new-privileges` e perfil seccomp;
- uma tentativa por container;
- kill forçado e remoção em cancelamento ou timeout.

O código entra por stdin ou arquivo no tmpfs. O resultado sai por stdout em um
único envelope JSON validado. Logs do runner nunca são devolvidos sem limite e
sanitização.

## 7. Harness e imports

O arquivo editável pode usar apenas:

- globais do runner selecionado;
- `request` do Supertest;
- `app` criado pelo harness;
- tipos e fixtures publicados pelo próprio laboratório.

Imports são analisados antes da fila. Módulos nativos, import dinâmico,
`require`, acesso a `process`, `globalThis.fetch`, timers sem limite e
construtores de código são bloqueados por política e novamente pelo sandbox.

O harness reinicia estado em memória entre tentativas para evitar interferência
na média e garantir repetibilidade.

## 8. Componentes previstos

```text
frontend/src/features/laboratorio/
├── LaboratorioTestes.tsx          # shell Guia/Praticar
├── editor/
│   ├── EditorTeste.tsx
│   ├── ContratoExercicio.tsx
│   ├── BarraExecucao.tsx
│   ├── ResultadoExecucao.tsx
│   ├── DiagnosticoTeste.tsx
│   └── useExecucaoTeste.ts
└── api/
    ├── execucoes.ts
    └── tipos.ts

src/laboratorio/
├── tipos.ts
├── politica.ts
├── diagnosticos.ts
├── fila.ts
├── executor.ts
└── rotas.ts

infra/laboratorio/
├── Dockerfile
├── harness/
│   ├── jest-harness.ts
│   └── jasmine-harness.ts
└── politica.json
```

## 9. Acessibilidade

- CodeMirror deve expor nome, instruções e linha/coluna; se não atingir o piso
  necessário, usar textarea nativa na primeira versão.
- `Ctrl+Enter` ou `Cmd+Enter` executa; `Escape` não fecha o drawer quando
  um submenu do editor estiver aberto.
- Mudanças de fila e conclusão usam `aria-live=polite`; falha interna usa
  `assertive` apenas quando impede continuar.
- Diagnósticos formam lista navegável. **Ir para linha** move cursor e foco.
- Esperado e recebido possuem rótulos textuais, não somente diff por cor.
- Movimento reduzido remove transições de resultado e progresso indeterminado.

## 10. Observabilidade e retenção

Registrar apenas ID, runner, estado, duração, categoria e tamanho do código.
Não registrar o código completo por padrão. IDs são opacos e resultados em
memória expiram após 30 minutos ou reinício.

Métricas mínimas: fila atual, duração p50/p95, timeouts, cancelamentos, rejeições
por política e falhas internas. Logs recebem ID de correlação, nunca stack do
host na resposta.

## 11. Estratégia de testes

O projeto continua usando somente Jest e Jasmine:

- Jest: contratos HTTP, fila, política, parser de resultados e componentes
  React do editor/diagnóstico.
- Jasmine: paridade das regras de política, estados da fila e normalização dos
  diagnósticos de runner.
- Casos de segurança usam fixtures inofensivas que tentam recursos proibidos;
  não executam payload destrutivo no host.
- QA manual cobre atalhos, foco, viewport, cancelamento e apresentação.

Conforme decisão atual do projeto, os testes de frontend serão escritos pela
pessoa autora e não devem ser gerados automaticamente sem nova autorização.

## 12. Implantação gradual

1. **Contrato e simulador:** UI completa consumindo resultados fixture.
2. **Executor local isolado:** container obrigatório, somente uma execução.
3. **Fila e cancelamento:** concorrência limitada e estados assíncronos.
4. **Hardening:** política, limites, métricas e auditoria de segurança.
5. **Piloto do seminário:** somente depois dos critérios e provas passarem.
