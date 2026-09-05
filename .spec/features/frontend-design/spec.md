# Spec: Design e animações do frontend

> feature: frontend-design
> status: pronta

## Contexto

O frontend é a peça visual de um seminário sobre testes automatizados. Sua única
tarefa principal é permitir que uma pessoa informe sono e reuniões, calcule a
recomendação e compreenda o resultado em poucos segundos. A identidade combina
um painel físico de máquina de espresso com instrumentos de laboratório de
software, evitando tanto o dashboard corporativo genérico quanto efeitos sem
função.

## Histórias

### US-012 — Reconhecer o produto à primeira vista

Como participante do seminário, quero uma interface com identidade ligada a
café e desenvolvimento, para entender o tema antes mesmo de interagir.

#### AC-034 — O painel abre com uma máquina de espresso interativa

- **Dado** o dashboard em estado inicial
- **Quando** a página termina de carregar
- **Então** vejo o formulário e a xícara-medidor como foco principal, com cafeteria, média e laboratório em posição secundária

#### AC-035 — Cores e tipografia seguem tokens únicos

- **Dado** qualquer componente da página
- **Quando** inspeciono seus estilos
- **Então** cores, fontes, espaços, raios e sombras vêm dos tokens documentados, sem valores arbitrários repetidos

#### AC-036 — A composição funciona de celular a desktop

- **Dado** larguras entre 320 e 1440 pixels
- **Quando** redimensiono a página
- **Então** nenhum conteúdo cria rolagem horizontal e a ordem formulário, resultado, cafeteria, média e laboratório permanece compreensível

### US-013 — Informar o perfil sem ambiguidade

Como pessoa desenvolvedora, quero controles claros para sono e reuniões, para
calcular meu dia usando teclado, mouse ou toque.

#### AC-037 — Sono e reuniões possuem controles acessíveis

- **Dado** o formulário do tracker
- **Quando** navego por rótulos e teclado
- **Então** ajusto horas de sono de 0 a 24 e reuniões por passos inteiros não negativos, com valores visíveis e alvos de toque adequados

#### AC-038 — Calcular comunica processamento sem permitir duplicação

- **Dado** um perfil válido
- **Quando** aciono Calcular meu dia
- **Então** o botão entra em estado Extraindo..., fica desabilitado e uma região de status anuncia o processamento até a resposta

#### AC-039 — Erros explicam como corrigir cada campo

- **Dado** que a API devolve erros de validação
- **Quando** a resposta é exibida
- **Então** cada mensagem aparece junto ao campo correspondente, recebe foco no primeiro erro e não apaga os valores informados

### US-014 — Entender a recomendação por número, texto e movimento

Como pessoa desenvolvedora, quero uma resposta visual e textual coerente, para
entender quantidade e risco sem depender apenas de cor.

#### AC-040 — A xícara representa proporcionalmente a recomendação

- **Dado** um ResultadoTracker com 1 a 10 cafés
- **Quando** o resultado entra na tela
- **Então** a xícara enche na proporção cafesRecomendados dividido por 10 e mostra o valor numericamente

#### AC-041 — Cada risco tem texto, cor e sinal próprios

- **Dado** qualquer uma das quatro classificações da API
- **Quando** o resultado é apresentado
- **Então** vejo o nome completo do risco, um ícone e a cor semântica correspondente, sem depender apenas da cor

#### AC-042 — A animação principal ocorre uma vez e termina estável

- **Dado** que uma nova recomendação chegou
- **Quando** a transição é executada
- **Então** preenchimento, contagem e vapor terminam em até 2,5 segundos, sem movimento decorativo infinito

#### AC-043 — Movimento reduzido preserva toda a informação

- **Dado** prefers-reduced-motion ativado no sistema
- **Quando** calculo uma recomendação ou abro um painel
- **Então** transformações, tremor e vapor são removidos, enquanto conteúdo, foco e mudanças de cor ou opacidade curta permanecem disponíveis

### US-015 — Consultar cafeteria, média e saúde da API

Como apresentador do seminário, quero dados auxiliares compactos, para enriquecer
a demonstração sem competir com o cálculo principal.

#### AC-044 — A cafeteria possui estados de consulta completos

- **Dado** um identificador de cafeteria
- **Quando** consulto seu status
- **Então** vejo Extraindo café..., depois preço e disponibilidade, ou uma mensagem acionável com botão Tentar novamente

#### AC-045 — A média atualiza depois de um cálculo válido

- **Dado** uma recomendação registrada com sucesso
- **Quando** a interface atualiza as estatísticas
- **Então** o valor de média muda suavemente e informa que existe apenas durante o processo atual

#### AC-046 — A saúde da API fica visível sem dominar o cabeçalho

- **Dado** a verificação de /health
- **Quando** a página carrega ou uma reconexão ocorre
- **Então** um indicador textual mostra API online, verificando ou offline e oferece nova tentativa quando necessário

### US-016 — Explicar Jest e Jasmine durante o seminário

Como apresentador, quero revelar o laboratório de testes sob demanda, para
comparar os frameworks sem poluir o fluxo principal.

#### AC-047 — O laboratório abre como painel complementar

- **Dado** o dashboard em qualquer estado
- **Quando** aciono Abrir laboratório de testes
- **Então** um painel acessível abre com foco gerenciado e pode ser fechado por botão, Escape ou retorno de foco

#### AC-048 — O laboratório compara o mesmo caso nos dois frameworks

- **Dado** o painel de laboratório aberto
- **Quando** alterno entre Jest e Jasmine
- **Então** vejo o mesmo cenário e a mesma expectativa escritos na sintaxe de cada runner, com o marcador de paridade e o último JSON enviado e recebido

#### AC-051 — O caso de teste funciona como um guia linha por linha

- **Dado** um exemplo Jest ou Jasmine exibido no laboratório
- **Quando** seleciono uma linha de código ou avanço pelo guia
- **Então** vejo o objetivo daquela linha em português simples, a fase Arrange, Act ou Assert à qual ela pertence e por que ela é necessária para provar o comportamento

#### AC-052 — A leitura guiada preserva o contexto do caso completo

- **Dado** que estou acompanhando a explicação de uma linha
- **Quando** uso Anterior, Próxima ou escolho outra linha
- **Então** a linha ativa permanece destacada no código completo, o contador informa minha posição e a navegação não altera nem executa o exemplo

#### AC-053 — O tráfego da API conecta o teste ao comportamento observado

- **Dado** que já calculei uma recomendação na interface
- **Quando** abro a seção Última chamada do laboratório
- **Então** vejo método, rota, payload, status e resposta usados no cálculo, acompanhados de uma explicação de como a expectativa do teste confere esse resultado

### US-017 — Recuperar-se de falhas e usar a interface com acessibilidade

Como pessoa usuária, quero mensagens específicas e navegação previsível, para
continuar mesmo quando a rede ou a API falhar.

#### AC-049 — Falhas de rede oferecem recuperação no contexto

- **Dado** uma chamada que falhou por indisponibilidade
- **Quando** a interface mostra o erro
- **Então** vejo qual ação falhou, mantenho os dados digitados e tenho um botão Tentar novamente relacionado à mesma ação

#### AC-050 — Teclado, foco e regiões ao vivo seguem uma ordem estável

- **Dado** a página inteira
- **Quando** navego apenas pelo teclado e aciono atualizações assíncronas
- **Então** o foco visível segue a ordem visual e resultados ou erros relevantes são anunciados sem mover o foco inesperadamente

## Fora de escopo

- Tema escuro, seletor de temas ou personalização livre de cores.
- Ilustração 3D, WebGL, vídeo, parallax ou partículas contínuas.
- Gamificação, confete, sons ou vibração.
- Gráficos históricos, pois a API mantém apenas uma média em memória.
- Digitação, edição, interpretação ou execução de código de teste dentro do laboratório.
- Diagnóstico automático de erro de sintaxe, falha de expectativa ou sugestão de correção.
- Alteração da identidade ou contrato HTTP do backend.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-012 | A primeira versão terá somente tema claro inspirado em máquina de espresso. | confirmada | É a direção visual proposta e aceita pelo pedido de detalhá-la para execução. |
| ASM-013 | A xícara-medidor será o único gesto visual ousado da página. | confirmada | Mantém o restante disciplinado e evita aparência de template com efeitos espalhados. |
| ASM-014 | O laboratório usa exemplos de teste estáticos e o último tráfego real da sessão. | confirmada | Esta entrega ensina a anatomia do teste; edição, execução e diagnóstico terão uma spec própria para review. |
| ASM-018 | A explicação linha por linha usa uma seleção guiada e não comentários longos dentro do bloco de código. | confirmada | Mantém o código legível no projetor e reserva a linguagem didática para um painel associado. |
| ASM-015 | Ícones utilitários vêm do Lucide; a xícara e o manômetro são visualizações próprias do domínio. | confirmada | Evita desenhar ícones comuns manualmente sem limitar a assinatura visual. |
| ASM-016 | A copy será em português brasileiro, curta e conversacional. | confirmada | O produto, a API e o seminário já usam português. |

## Perguntas em aberto

Nenhuma.
