# Interface do seminário

## Objetivo

O frontend apresenta o Cafeína Tracker como uma bancada de demonstração sobre
API, regras de negócio e testes automatizados. O formulário é o painel de
entrada e a xícara é o instrumento de saída.

Execute API e frontend juntos com:

```bash
npm run dev
```

- Frontend: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3000`

## Roteiro sugerido

1. Mostre o indicador `API online`.
2. Explique que sono e reuniões formam o payload enviado à API.
3. Ajuste os controles e use **Calcular meu dia**.
4. Relacione o preenchimento da xícara ao número de cafés e o manômetro ao risco.
5. Mostre a média mantida em memória e a consulta assíncrona da cafeteria.
6. Abra o laboratório e compare o mesmo caso em Jest e Jasmine.

## Laboratório didático

O laboratório desta versão é somente leitura. Ele apresenta:

- objetivo observável do caso;
- fases **Arrange / Preparar**, **Act / Executar** e **Assert / Conferir**;
- código completo e seleção de cada linha;
- explicação do que a linha faz e por que ela é necessária;
- diferença equivalente entre Jest e Jasmine;
- marcador de paridade;
- último payload e resultado reais produzidos pelo painel.

**Anterior** e **Próxima** percorrem o guia. Clicar em uma linha abre sua
explicação. A interface ainda não interpreta nem executa código arbitrário.

## Componentes principais

| Parte | Responsabilidade |
|---|---|
| `AppHeader` | Identidade, saúde da API e abertura do laboratório |
| `PerfilForm` | Entrada acessível, validação, loading e retry |
| `ResultadoTracker` | Coordena xícara, risco e motivo |
| `XicaraMedidor` | Traduz 1–10 cafés em preenchimento proporcional |
| `RiscoGauge` | Traduz risco usando texto, ícone e cor |
| `CafeteriaStatus` | Demonstra uma consulta assíncrona |
| `MediaCafes` | Mostra a média do processo atual |
| `LaboratorioTestes` | Guia linha por linha de Jest e Jasmine |

## Acessibilidade

- Skip link como primeiro controle de teclado.
- Alvos interativos de pelo menos 44 pixels.
- Loading, erros e resultados em regiões de status.
- Primeiro campo inválido recebe foco sem apagar valores.
- Laboratório prende o foco, fecha com Escape e devolve o foco ao gatilho.
- Tabs aceitam setas, Home e End.
- Movimento reduzido remove vapor, tremor e transformações sem remover conteúdo.

## Limite desta entrega

O laboratório ainda não oferece editor, execução de testes nem diagnóstico de
código. Essa evolução possui uma spec própria e só deve ser implementada após
aprovação.

As evidências ficam em [`docs/qa/frontend-design/`](./qa/frontend-design/).
