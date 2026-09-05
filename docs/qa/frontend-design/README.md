# QA visual — frontend design

QA manual executado no Chromium com API e Vite ativos. Não foram encontrados
erros JavaScript, quebra do fluxo principal ou overflow horizontal.

| Viewport | Resultado | Evidência |
|---|---|---|
| 1440 × 1000 | passou | [inicial](./screenshots/desktop-inicial.png) · [resultado](./screenshots/desktop-resultado.png) |
| 1024 × 768 | passou | [laptop](./screenshots/laptop-1024.png) |
| 768 × 1024 | passou | [tablet](./screenshots/tablet-768.png) |
| 390 × 844 | passou | [mobile](./screenshots/mobile-390-corrigido.png) · [laboratório](./screenshots/mobile-laboratorio.png) |

## Fluxos verificados

- saúde da API, cálculo e atualização da média;
- xícara proporcional e risco textual/visual;
- consulta da cafeteria;
- falha offline preservando valores e recuperação;
- tabs Jest/Jasmine, Anterior/Próxima e seleção de linha;
- Escape, focus trap e retorno do foco;
- movimento reduzido;
- ausência de overflow nos quatro viewports.

Laboratório: [Jest](./screenshots/laboratorio-jest.png) ·
[Jasmine](./screenshots/laboratorio-jasmine.png).

## Ajuste realizado durante o QA

O skip link usava transform para ficar fora da viewport, e a captura de página
inteira repetia o elemento fixo. A ocultação passou a usar posição negativa,
preservando o comportamento de teclado.

O Motion emite um aviso de desenvolvimento quando o navegador emula movimento
reduzido; isso confirma a preferência ativa e não é erro da aplicação. Nenhum
teste automatizado de frontend foi criado, conforme a decisão do projeto.
