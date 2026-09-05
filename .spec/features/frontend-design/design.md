# Design visual: painel de espresso e laboratório de testes

## 1. Tese visual

**Produto:** Cafeína Tracker pra Dev.

**Público:** participantes de um seminário de TI e pessoas desenvolvedoras que
querem experimentar a API.

**Trabalho único da página:** transformar horas de sono e reuniões em uma
recomendação compreensível de café.

**Direção:** painel físico de máquina de espresso contemporânea, com precisão
de instrumento de laboratório. A interface não imita uma cafeteria artesanal
nem uma IDE escura. Alumínio, porcelana, mostradores, etiquetas técnicas e uma
xícara que reage ao cálculo formam uma identidade própria.

**Risco estético deliberado:** a xícara-medidor ocupa o papel que normalmente
seria de um card de resultado. Ela enche de acordo com `cafesRecomendados / 10`
e divide espaço com um manômetro de risco. É uma visualização funcional, não
uma ilustração decorativa.

## 2. Autocrítica da direção

Foram removidos três atalhos genéricos:

- Nada de hero com título enorme, gradiente e três cards de métricas.
- Nada de fundo quase preto com verde neon para representar “dev”.
- Nada de creme, serifada editorial e terracota usados como estética de café.

O tema do desenvolvimento aparece em etiquetas monoespaçadas, JSON e comparação
de testes; o tema do café aparece na materialidade e na interação principal.

## 3. Tokens visuais

### 3.1 Cores base

| Token | Valor | Uso |
|---|---:|---|
| `--color-porcelain` | `#F7F7F2` | fundo da página e interior da xícara |
| `--color-aluminium` | `#D7D8D2` | corpo do painel e superfícies técnicas |
| `--color-espresso` | `#241711` | texto principal e líquido da xícara |
| `--color-crema` | `#D58A35` | ação principal e detalhe da extração |
| `--color-panel-blue` | `#2E5C9A` | foco, links e indicador informativo |
| `--color-alarm-red` | `#BF3A30` | erro e risco cardiologista |

### 3.2 Cores semânticas derivadas

```css
--risk-safe: #2E6B57;
--risk-attention: #A76518;
--risk-high: #A84D28;
--risk-critical: var(--color-alarm-red);
--text-primary: var(--color-espresso);
--text-muted: #665E59;
--border-subtle: #B8B9B3;
--surface-raised: #FFFFFF;
--focus-ring: var(--color-panel-blue);
```

Não usar cor como único sinal. Todo estado de risco combina texto integral,
ícone Lucide e cor.

### 3.3 Tipografia

| Papel | Família | Pesos | Aplicação |
|---|---|---|---|
| Display | Bricolage Grotesque Variable | 600, 700 | nome do produto, resultado e títulos curtos |
| Corpo | Manrope Variable | 400, 500, 600 | rótulos, instruções, botões e mensagens |
| Dados | IBM Plex Mono | 400, 500 | valores, status, JSON e exemplos de teste |

Escala:

```css
--font-display: clamp(2rem, 4vw, 4.5rem);
--font-result: clamp(2.75rem, 7vw, 6.5rem);
--font-h1: clamp(1.75rem, 3vw, 3rem);
--font-h2: clamp(1.25rem, 2vw, 1.75rem);
--font-body: 1rem;
--font-small: 0.875rem;
--font-data: 0.8125rem;
--line-body: 1.55;
--line-tight: 1.05;
```

### 3.4 Espaço, borda e elevação

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-7: 3rem;
--space-8: 4rem;

--radius-control: 0.625rem;
--radius-panel: 1.25rem;
--radius-round: 999px;

--shadow-control: 0 1px 1px rgb(36 23 17 / 0.12);
--shadow-panel: 0 18px 45px rgb(36 23 17 / 0.12);
```

Superfícies técnicas usam borda e contraste; sombra aparece somente no painel
principal e no laboratório aberto.

## 4. Layout

### 4.1 Desktop — 1100 px ou mais

Container máximo de `1360px`, padding lateral de `clamp(20px, 4vw, 64px)` e
grid de 12 colunas. Formulário usa 5 colunas; máquina/resultado usa 7.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ CDD / CAFEÍNA TRACKER                    ● API online   Laboratório  │
├──────────────────────────────┬───────────────────────────────────────┤
│ Como está seu dia?           │        PAINEL DE EXTRAÇÃO             │
│                              │                                       │
│ Horas de sono        6,5 h   │       ╭──────────────╮                │
│ [────────●──────────────]    │       │   vapor      │  manômetro    │
│                              │       │     ☕ 50%    │  ATENÇÃO      │
│ Reuniões          [−] 4 [+]  │       ╰──────────────╯                │
│                              │          5 cafés                      │
│ [ Calcular meu dia ]         │  “a reunião podia ser um e-mail”     │
├──────────────────────────────┴───────────────────────────────────────┤
│ CAFETERIA CENTRAL    Extraindo... │ MÉDIA DA SESSÃO  4,2 cafés       │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tablet — 768 a 1099 px

- Grid principal em 5/7 ainda é permitido acima de 900 px.
- Entre 768 e 899 px, formulário ocupa a primeira linha e resultado a segunda.
- Cafeteria e média permanecem em duas colunas iguais.

### 4.3 Mobile — 320 a 767 px

```text
┌──────────────────────────┐
│ CAFEÍNA TRACKER  ● online│
│ CDD — painel diário      │
├──────────────────────────┤
│ Horas de sono      6,5 h │
│ [────────●────────────]  │
│ Reuniões       [−] 4 [+] │
│ [ Calcular meu dia ]     │
├──────────────────────────┤
│      ☕ 50%              │
│       5 cafés            │
│       ATENÇÃO            │
│ “a reunião podia...”     │
├──────────────────────────┤
│ Cafeteria central        │
│ R$ 7,50 · disponível     │
├──────────────────────────┤
│ Média da sessão 4,2      │
│ [Abrir laboratório]      │
└──────────────────────────┘
```

- Ordem DOM igual à ordem visual.
- Controles ocupam largura total.
- Alvos interativos têm pelo menos `44px × 44px`.
- O laboratório vira diálogo de tela quase cheia, com margem de 12 px.

## 5. Componentes e comportamento

### 5.1 `AppHeader`

- Eyebrow monoespaçado: `CDD / PAINEL DIÁRIO`.
- Nome: `Cafeína Tracker` em Bricolage, sem ocupar mais de duas linhas.
- `ApiStatus`: ponto + `API online`, `Verificando API` ou `API offline`.
- Ação secundária: `Abrir laboratório de testes`, ícone `FlaskConical`.
- Header não é sticky; a demonstração deve parecer uma bancada, não SaaS.

### 5.2 `PerfilForm`

**Sono**

- `label`: `Horas de sono`.
- Range `min=0`, `max=24`, `step=0.5`.
- Valor textual monoespaçado: `6,5 h`.
- Marcadores somente em `0`, `8` e `24`; 8 recebe rótulo `ideal`.

**Reuniões**

- Label: `Quantidade de reuniões`.
- Stepper com botões `Diminuir reuniões` e `Aumentar reuniões`.
- Campo numérico editável, inteiro, mínimo 0.
- Botão diminuir desabilitado em 0.

**Ação**

- Padrão: `Calcular meu dia`, ícone `Coffee`.
- Loading: `Extraindo...`, ícone com rotação única ou progress ring.
- Press: deslocamento vertical de 2 px por 110 ms para sensação mecânica.
- Enter no formulário dispara cálculo uma única vez.

### 5.3 `XicaraMedidor`

- SVG próprio com `title` e descrição acessível.
- O clip-path interno recebe altura entre 10% e 100% para valores 1–10.
- Líquido espresso sólido; crema é uma linha de 4 px no topo.
- Número grande fica fora da xícara para não perder contraste.
- Texto: singular `1 café`; plural `N cafés`; decimais usam vírgula.
- Motivo extra aparece como legenda, entre aspas, abaixo do risco.

### 5.4 `RiscoGauge`

| API | Rótulo auxiliar | Ícone | Token |
|---|---|---|---|
| Seguro | Dentro da rotina | `ShieldCheck` | `--risk-safe` |
| Atenção | Reduza o ritmo | `Gauge` | `--risk-attention` |
| Risco Alto | Hora de desacelerar | `TriangleAlert` | `--risk-high` |
| Chama o Cardiologista | Limite máximo atingido | `HeartPulse` | `--risk-critical` |

O texto da API nunca é reescrito; o rótulo auxiliar é complementar.

### 5.5 `CafeteriaStatus`

- Título: `Cafeteria simulada`.
- ID padrão editável: `central`.
- Ação: `Consultar cafeteria` / `Extraindo café...`.
- Sucesso: preço monoespaçado com duas casas e `Disponível agora` ou
  `Indisponível no momento`.
- Erro: mensagem específica e `Tentar novamente`.
- A disponibilidade usa ícone e texto; nunca apenas verde/vermelho.

### 5.6 `MediaCafes`

- Título: `Média da sessão`.
- Valor monoespaçado com no máximo uma casa decimal.
- Nota fixa: `Reinicia quando a API reinicia.`
- Estado zero: `Nenhum cálculo registrado ainda.`

### 5.7 `LaboratorioTestes`

- Drawer pela direita no desktop; diálogo quase cheio no mobile.
- `role="dialog"`, `aria-modal="true"`, título associado.
- Focus trap, Escape fecha e foco retorna ao gatilho.
- Tabs reais: `Jest` e `Jasmine`, com setas para navegação.
- O painel é uma lâmina didática, não uma imitação de editor: cada linha é um
  botão de leitura com número, código e estado ativo; não há cursor de edição.
- Antes do código, um resumo declara o objetivo observável do caso e apresenta
  a sequência `Preparar → Executar → Conferir` junto dos termos
  `Arrange → Act → Assert`.
- Ao selecionar uma linha, o bloco completo permanece visível e um painel
  associado explica em português simples:
  - o que a instrução faz;
  - por que ela existe no caso;
  - qual fase do teste representa;
  - o que mudaria entre Jest e Jasmine, quando houver diferença.
- Código em IBM Plex Mono, com destaque da linha selecionada e das expectativas
  equivalentes pelo marcador `@paridade:CALC-BASE`.
- Navegação `Anterior` e `Próxima`, contador `Linha N de M` e seleção direta;
  esses controles apenas percorrem o guia, sem executar o exemplo.
- Seção `Última chamada` mostra método, caminho, corpo, status e resposta reais,
  seguida por uma frase que liga `resposta.body.cafesRecomendados` à expectativa
  ativa no teste.
- Copy introdutória: `Mesma regra. Dois runners. Uma única expectativa.`

```text
┌──────────────────────────────────────────────────────────────┐
│ LABORATÓRIO / TESTES                                  [×]   │
│ Laboratório de testes                                       │
│ Mesma regra. Dois runners. Uma única expectativa.            │
│ [ Jest ] [ Jasmine ]                                        │
├───────────────────────────────┬──────────────────────────────┤
│ OBJETIVO DO CASO              │ LEITURA GUIADA · 4 DE 8     │
│ Recomendar 4 cafés...         │ ASSERT · CONFERIR           │
│                               │ Garante que o valor...       │
│ 1  test('...', async () => {  │ Por que importa              │
│ 2    const resposta = ...     │ Sem esta expectativa...      │
│ 3    ...                      │ [Anterior] [Próxima]         │
│ 4  › expect(...).toBe(4)      │                              │
├───────────────────────────────┴──────────────────────────────┤
│ ÚLTIMA CHAMADA · POST /tracker · 200 OK                      │
│ envio {...} → resposta {...}                                 │
└──────────────────────────────────────────────────────────────┘
```

No desktop, código e explicação usam duas colunas proporcionais. Abaixo de
`760px`, a explicação aparece logo depois do código para preservar a sequência
de leitura. O bloco nunca depende de scroll horizontal: linhas longas quebram
visualmente com recuo, sem mudar seu conteúdo semântico.

## 6. Estados da experiência

| Estado | Formulário | Resultado | Região ao vivo |
|---|---|---|---|
| inicial | habilitado | xícara vazia + convite | nenhuma |
| enviando | desabilita submit | painel em preparação | `Calculando recomendação` |
| sucesso | preserva valores | anima novo resultado | `Recomendação: N cafés, risco X` |
| validação | preserva valores | mantém último resultado esmaecido | primeiro erro e resumo |
| rede offline | preserva valores | mantém último resultado | falha + `Tentar novamente` |

Copy inicial: `Ajuste seu dia no painel e descubra a dose recomendada.`

Erros não dizem “Algo deu errado”. Exemplos:

- `Não foi possível calcular agora. Verifique se a API está online.`
- `A cafeteria não respondeu. Tente a consulta novamente.`
- `Informe horas de sono entre 0 e 24.`

## 7. Motion

Motion é importado de `motion/react`. O app inteiro usa:

```tsx
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

### 7.1 Entrada da página

Uma única sequência, total de 420 ms:

1. Painel principal: opacidade 0→1 e `y: 8→0`, 240 ms.
2. Cabeçalho e utilitários: opacidade 0→1, atraso 80 ms.
3. Sem stagger por card; a página entra como um instrumento único.

### 7.2 Cálculo bem-sucedido

| Momento | Elemento | Movimento |
|---:|---|---|
| 0 ms | botão | press de 2 px por 110 ms |
| resposta | resultado | crossfade de 160 ms |
| +40 ms | café | altura anterior→nova em 700 ms, ease `[0.22, 1, 0.36, 1]` |
| +80 ms | número | spring visual até o novo valor, sem alterar leitura final |
| +500 ms | vapor | duas passagens de 900 ms e encerra |
| +750 ms | risco | entrada por opacidade; crítico recebe um único tremor de 280 ms |

Tremor crítico: `x: [0, -4, 4, -2, 2, 0]`. Não repetir e não aplicar a toda a
tela.

### 7.3 Cafeteria e média

- Cafeteria: aro progride enquanto a Promise está pendente; não introduzir
  atraso artificial para “mostrar” animação.
- Média: crossfade de 160 ms e contagem curta de até 350 ms.
- Drawer: desktop `x: 100%→0` em 260 ms; overlay apenas opacidade.

### 7.4 Movimento reduzido

Com `prefers-reduced-motion: reduce`:

- Duração máxima de opacidade: 150 ms.
- Sem `x`, `y`, escala, preenchimento interpolado, tremor ou vapor.
- Xícara e número assumem valor final imediatamente.
- Drawer aparece por opacidade, com foco idêntico.
- Nenhuma informação ou confirmação depende da animação.

## 8. Acessibilidade

- Um único `h1`; seções seguintes usam `h2` em ordem.
- Skip link `Pular para o cálculo` é o primeiro elemento focável.
- Focus ring de 3 px com offset 3 px; nunca remover outline sem substituição.
- Contraste de texto comum deve atingir WCAG AA; validar tokens no navegador.
- Range possui valor textual via `aria-valuetext`.
- Stepper e ícones têm nomes acessíveis; ícones decorativos usam
  `aria-hidden="true"`.
- Loading usa `aria-busy`; resultado e erro usam regiões `aria-live` adequadas.
- Não mover foco no sucesso. Em validação, focar o primeiro campo inválido.
- Drawer bloqueia foco externo e restaura o gatilho ao fechar.
- Tabs usam `role=tablist`, `role=tab` e `role=tabpanel`; esquerda/direita
  alternam runner, Home/End vão ao primeiro/último.
- Linhas do guia são botões com `aria-pressed`; a explicação usa
  `aria-live="polite"` e o contador informa a posição sem roubar foco.
- Touch targets mínimos de 44 px; espaçamento entre alvos de ao menos 8 px.

## 9. CSS e implementação

- `tokens.css` é a única origem de cores, fontes, escala de espaços, raios,
  sombras e durações compartilhadas.
- `reset.css` normaliza box sizing, mídia e controles sem apagar semântica.
- `globals.css` contém página, tipografia base e helpers globais mínimos.
- Cada componente recebe CSS Module ao lado do `.tsx` quando precisa de estilo
  próprio; não criar um arquivo global por feature.
- Seletores usam classes simples; evitar seletores por tag combinados com
  classes de componente e evitar `!important`.
- Animações simples de hover/focus ficam em CSS; Motion fica reservado a
  transições ligadas a estado, xícara, contagem e drawer.
- Ícones utilitários vêm de `lucide-react` com stroke consistente de 1.75.

## 10. Critérios de revisão visual

Antes da entrega:

1. Capturar screenshots em 1440×900, 1024×768, 390×844 e 320×568.
2. Conferir estados inicial, loading, sucesso em cada risco, validação e rede.
3. Navegar todo o fluxo somente com teclado.
4. Repetir com movimento reduzido.
5. Conferir zoom de 200% sem perda de conteúdo ou rolagem horizontal.
6. Verificar console sem warnings de React, requests ou acessibilidade.
7. Remover qualquer efeito que não explique estado ou hierarquia.

## 11. Referências técnicas

- [Motion para React](https://motion.dev/docs/react-installation): instalação pelo pacote `motion` e import `motion/react`.
- [Motion accessibility](https://motion.dev/docs/react-accessibility): `MotionConfig reducedMotion="user"`.
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/): testes orientados por papéis, rótulos e conteúdo visível.
- [Lucide](https://lucide.dev/): biblioteca para ícones utilitários; visualizações de domínio continuam próprias.
