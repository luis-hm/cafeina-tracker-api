# Cafeína Tracker pra Dev — painel de espresso + laboratório de testes

Crie um canvas de design com **6 artboards** para a interface web abaixo. Copy toda em
português brasileiro. Não é um dashboard corporativo, não é uma IDE escura, não é
cafeteria artesanal editorial.

## Produto

Página única que transforma **horas de sono** e **quantidade de reuniões** em uma
**recomendação de cafés** (1 a 10) com um **nível de risco**. É a peça visual de um
seminário sobre testes automatizados (Jest vs Jasmine) sobre a mesma API.

Regra real do backend, use nos números dos mockups:
`cafés = min(10, 1 + max(0, 8 − horasSono) + floor(reuniões / 2))` — o valor pode ter
decimal, e decimal se escreve com vírgula.

Faixas de risco: **Seguro** até 3 · **Atenção** de 4 a 6 · **Risco Alto** de 7 a 9 ·
**Chama o Cardiologista** em 10.

## Tese visual

Painel físico de máquina de espresso contemporânea com precisão de instrumento de
laboratório. Alumínio escovado, porcelana, mostradores, etiquetas técnicas
monoespaçadas. O gesto ousado é **um só**: a xícara-medidor, que enche conforme
`cafés / 10` e ocupa o lugar que normalmente seria de um card de resultado.

**Proibido:** hero com título gigante + gradiente + três cards de métrica; fundo quase
preto com verde neon "de dev"; creme + serifada editorial + terracota "de café";
glassmorphism; ilustração 3D, WebGL, parallax, partículas, confete; tema escuro;
gráficos históricos.

## Tokens (usar exatamente estes)

Cores base:
- `--color-porcelain #F7F7F2` — fundo da página e interior da xícara
- `--color-aluminium #D7D8D2` — corpo do painel e superfícies técnicas
- `--color-espresso #241711` — texto principal e líquido da xícara
- `--color-crema #D58A35` — ação principal e detalhe da extração
- `--color-panel-blue #2E5C9A` — foco, links, indicador informativo
- `--color-alarm-red #BF3A30` — erro e risco crítico

Semânticas: `--risk-safe #2E6B57` · `--risk-attention #A76518` ·
`--risk-high #A84D28` · `--risk-critical #BF3A30` · `--text-muted #665E59` ·
`--border-subtle #B8B9B3` · `--surface-raised #FFFFFF` · `--focus-ring #2E5C9A`.

Tipografia (Google Fonts):
- **Display** Bricolage Grotesque 600/700 — nome do produto, número do resultado, títulos
- **Corpo** Manrope 400/500/600 — rótulos, instruções, botões, mensagens
- **Dados** IBM Plex Mono 400/500 — valores, status, JSON, código

Escala: display `clamp(2rem, 4vw, 4.5rem)` · resultado `clamp(2.75rem, 7vw, 6.5rem)` ·
h2 `clamp(1.25rem, 2vw, 1.75rem)` · corpo `1rem` · pequeno `0.875rem` ·
dados `0.8125rem` · line-height corpo `1.55`, apertado `1.05`.

Espaço 4/8/12/16/24/32/48/64px · raio controle `10px`, painel `20px`, pill `999px` ·
sombra painel `0 18px 45px rgb(36 23 17 / 0.12)`, controle `0 1px 1px rgb(36 23 17 / 0.12)`.
Superfícies técnicas se separam por **borda e contraste**, não por sombra: sombra só no
painel principal e no laboratório aberto.

## Layout

**Desktop (1440):** container 1360px, padding lateral 64px, grid 12 colunas.
Header não-sticky (é bancada, não SaaS): eyebrow mono `CDD / PAINEL DIÁRIO`, título
`Cafeína Tracker` em Bricolage, à direita indicador `● API online` e botão secundário
`Abrir laboratório de testes` (ícone frasco de laboratório).
Abaixo: formulário em 5 colunas, painel de extração (xícara + manômetro) em 7.
Rodapé da grade em duas colunas iguais: `Cafeteria simulada` e `Média da sessão`.

**Mobile (390):** coluna única, ordem DOM = ordem visual: header → formulário →
resultado → cafeteria → média → botão do laboratório. Controles em largura total,
alvos de toque ≥ 44×44px, nenhuma rolagem horizontal.

## Componentes

**PerfilForm** — título `Como está seu dia?`
- `Horas de sono`: slider 0–24 passo 0,5, marcadores só em 0, 8 e 24 (o 8 rotulado
  `ideal`), valor em mono ao lado: `6,5 h`.
- `Quantidade de reuniões`: stepper `[−] 4 [+]` com campo numérico editável, inteiro,
  mínimo 0, botão de diminuir desabilitado em 0.
- Botão primário `Calcular meu dia` com ícone de xícara, cor crema, texto espresso.
  Estado carregando: `Extraindo...`, desabilitado.

**XicaraMedidor** — SVG de domínio, desenhado à mão, não um ícone de biblioteca.
Xícara de porcelana vista de frente/perfil, líquido espresso sólido preenchendo por
baixo, **crema como uma faixa de 4px no topo do líquido**, duas linhas de vapor
discretas. O número grande fica **fora** da xícara (contraste), acompanhado da unidade.
Preenchimento = `cafés / 10`.

**RiscoGauge** — manômetro/mostrador ao lado da xícara. Cada risco tem **texto integral +
ícone + cor**, nunca só cor:
| Risco da API | Rótulo auxiliar | Ícone | Cor |
|---|---|---|---|
| Seguro | Dentro da rotina | escudo com check | `--risk-safe` |
| Atenção | Reduza o ritmo | manômetro | `--risk-attention` |
| Risco Alto | Hora de desacelerar | triângulo de alerta | `--risk-high` |
| Chama o Cardiologista | Limite máximo atingido | batimento cardíaco | `--risk-critical` |
Abaixo, o motivo extra como legenda entre aspas, ex.: `"a reunião podia ser um e-mail"`.

**CafeteriaStatus** — título `Cafeteria simulada`, campo de ID com valor `central`,
botão `Consultar cafeteria`. Sucesso: preço em mono `R$ 7,50` + `Disponível agora`
com ícone. Erro: `A cafeteria não respondeu.` + botão `Tentar novamente`.

**MediaCafes** — título `Média da sessão`, valor mono com uma casa decimal `4,2`,
nota fixa em texto pequeno: `Reinicia quando a API reinicia.`

**LaboratorioTestes** — drawer pela direita no desktop (largura ~520px, overlay
escurecendo o resto), diálogo quase cheio no mobile. Cabeçalho com título e botão
fechar. Subtítulo: `Mesma regra. Dois runners. Uma única expectativa.` Abas reais
`Jest` e `Jasmine` mostrando o mesmo caso de teste lado a lado em IBM Plex Mono, com a
linha equivalente destacada pelo marcador `@paridade:CALC-BASE`. Seção final
`Última chamada` com método, caminho, corpo e resposta JSON reais:
`POST /tracker` · `{"horasSono":6.5,"quantidadeReunioes":4}` ·
`{"cafesRecomendados":4.5,"nivelRisco":"Atenção","motivoExtra":"a reunião podia ser um e-mail"}`

## Os 6 artboards

1. **Desktop 1440 — inicial.** Xícara vazia, convite
   `Ajuste seu dia no painel e descubra a dose recomendada.` Sono em 8,0 h, reuniões 0.
   Cafeteria e média em estado zero (`Nenhum cálculo registrado ainda.`).
   Indicador `● API online`.
2. **Desktop 1440 — sucesso, risco Atenção.** Sono 6,5 h · 4 reuniões →
   **4,5 cafés**, xícara 45% cheia, manômetro em `Atenção / Reduza o ritmo`,
   motivo `"a reunião podia ser um e-mail"`. Cafeteria com `R$ 7,50 · Disponível agora`,
   média `4,2`.
3. **Desktop 1440 — sucesso, risco crítico.** Sono 3,0 h · 8 reuniões → **10 cafés**,
   xícara 100%, `Chama o Cardiologista / Limite máximo atingido` em vermelho de alarme,
   motivo `"o bug só acontece em produção"`.
4. **Desktop 1440 — erros.** Duas coisas ao mesmo tempo: erro de validação sob o campo
   de sono (`Informe horas de sono entre 0 e 24.`, campo com borda de alarme e anel de
   foco de 3px visível) e header com `● API offline` mais um botão `Tentar novamente`.
   O último resultado permanece na tela, esmaecido. Nada de "Algo deu errado".
5. **Desktop 1440 — laboratório aberto.** Artboard 2 com o drawer do laboratório aberto
   por cima, aba `Jest` ativa, comparação de código e o bloco `Última chamada`.
6. **Mobile 390 — empilhado.** Um artboard com a tela de sucesso do caso 4,5 cafés na
   coluna única completa: header compacto, formulário, resultado, cafeteria, média e o
   botão `Abrir laboratório de testes`.

## Detalhes que fazem ou quebram

- Nenhum estado depende só de cor — sempre texto + ícone junto.
- Foco visível: anel de 3px azul `#2E5C9A` com offset de 3px, mostre-o em pelo menos um
  controle por artboard.
- Números sempre em IBM Plex Mono; decimal com vírgula; `1 café` no singular e
  `N cafés` no plural.
- Ícones utilitários com traço fino e consistente (1.75px). A xícara e o manômetro são
  desenhos próprios, não ícones prontos.
- Sem rolagem horizontal em nenhuma largura entre 320 e 1440.
