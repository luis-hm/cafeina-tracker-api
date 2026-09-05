# Spec: Laboratório executável

> feature: laboratorio-executavel
> status: rascunho

## Contexto

O laboratório atual ensina a anatomia de um teste usando exemplos estáticos.
A próxima evolução permitirá que a pessoa participante do seminário copie um
caso guiado, altere o código e execute Jest ou Jasmine pela interface.

O resultado deve dizer não apenas se passou ou falhou, mas também classificar
problemas de sintaxe, expectativa, execução, API não permitida ou tempo
excedido. Como o texto digitado é código arbitrário, ele nunca pode usar
`eval` no navegador nem compartilhar o processo da API.

## Histórias

### US-018 — Transformar o guia em prática

Como participante do seminário, quero partir de um caso explicado para uma área
de prática, para aprender modificando um exemplo que já compreendo.

#### AC-054 — O guia abre um exercício sem perder o original

- **Dado** uma linha ou caso do guia estático Jest/Jasmine
- **Quando** aciono Praticar este caso
- **Então** o editor abre com uma cópia do caso e o guia original permanece inalterado

#### AC-055 — O exercício declara objetivo e regra esperada

- **Dado** o modo Praticar aberto
- **Quando** observo o cabeçalho do exercício
- **Então** vejo runner, objetivo, entrada, resultado esperado e quais recursos de teste estão disponíveis

### US-019 — Escrever um teste com contexto

Como pessoa aprendiz, quero editar um teste com ajuda estrutural, para
experimentar sem perder o contexto de Arrange, Act e Assert.

#### AC-056 — O editor preserva linhas e localização

- **Dado** um código TypeScript carregado
- **Quando** digito, removo ou colo conteúdo
- **Então** números de linha, seleção, desfazer/refazer e posição do cursor continuam disponíveis

#### AC-057 — Jest e Jasmine usam modelos equivalentes

- **Dado** o mesmo objetivo de teste
- **Quando** alterno o runner antes de modificar o exercício
- **Então** recebo modelos equivalentes com a mesma entrada e expectativa, usando somente a sintaxe própria do runner

#### AC-058 — Alterações não são perdidas por troca acidental

- **Dado** um exercício modificado
- **Quando** tento trocar runner, restaurar exemplo ou fechar o laboratório
- **Então** a interface avisa sobre alterações não executadas e permite continuar ou cancelar

#### AC-059 — O editor informa o contrato permitido

- **Dado** o editor focado
- **Quando** consulto a ajuda do exercício
- **Então** vejo imports, globais, limite de tempo e APIs proibidas sem depender de documentação externa

### US-020 — Executar Jest ou Jasmine pela interface

Como participante, quero executar meu teste e acompanhar seu estado, para
confirmar imediatamente se minha hipótese está correta.

#### AC-060 — Executar cria uma tentativa identificável

- **Dado** código não vazio e um runner selecionado
- **Quando** aciono Executar teste
- **Então** uma tentativa recebe identificador, runner e horário, e transita por Na fila, Executando e um estado terminal

#### AC-061 — O envio duplicado é impedido

- **Dado** uma tentativa em fila ou execução
- **Quando** aciono novamente o botão ou o atalho
- **Então** nenhuma segunda tentativa é criada e a interface mantém o estado atual

#### AC-062 — A execução pode ser cancelada

- **Dado** uma tentativa ainda não terminada
- **Quando** aciono Cancelar execução
- **Então** o trabalho isolado é encerrado, o estado vira Cancelada e o editor volta a ficar disponível

#### AC-063 — O sucesso mostra a prova observada

- **Dado** um teste que passa
- **Quando** a execução termina
- **Então** vejo runner, duração, quantidade de testes, expectativa executada e resumo Passou sem depender apenas da cor verde

### US-021 — Entender por que o teste falhou

Como pessoa aprendiz, quero um diagnóstico relacionado ao meu código, para
entender a falha e saber qual é o próximo passo.

#### AC-064 — Erro de sintaxe aponta local e explicação

- **Dado** código que não pode ser analisado
- **Quando** a tentativa termina
- **Então** vejo categoria Sintaxe, linha, coluna, trecho relacionado, mensagem em português e uma orientação de correção

#### AC-065 — Falha de expectativa separa esperado e recebido

- **Dado** um teste válido cuja expectativa falha
- **Quando** a tentativa termina
- **Então** vejo categoria Expectativa, valor esperado, valor recebido, matcher e a linha responsável

#### AC-066 — Erro de execução preserva uma pilha segura

- **Dado** código que lança uma exceção durante Arrange ou Act
- **Quando** a tentativa termina
- **Então** vejo categoria Execução, mensagem, linha do exercício e uma pilha limitada aos arquivos do sandbox

#### AC-067 — Recursos proibidos recebem diagnóstico próprio

- **Dado** código que tenta rede, processo, sistema de arquivos ou import fora da lista permitida
- **Quando** envio ou executo o exercício
- **Então** a tentativa é recusada como Recurso não permitido e explica qual alternativa do laboratório deve ser usada

#### AC-068 — Timeout diferencia lentidão de asserção

- **Dado** código que excede o limite configurado
- **Quando** o runner é interrompido
- **Então** vejo categoria Tempo excedido, limite aplicado e orientação para revisar Promise, callback, timer ou loop

#### AC-069 — O diagnóstico nunca inventa uma correção

- **Dado** qualquer falha
- **Quando** o resultado é apresentado
- **Então** explicações são derivadas de parser, runner e políticas conhecidas, e incerteza aparece explicitamente em vez de afirmar uma causa não comprovada

### US-022 — Executar sem comprometer o sistema

Como responsável pelo seminário, quero isolamento forte, para que um exercício
errado ou malicioso não acesse a máquina, a rede ou outras tentativas.

#### AC-070 — Cada tentativa usa sandbox efêmero e limitado

- **Dado** qualquer código enviado
- **Quando** a execução começa
- **Então** ela roda fora do processo da API, sem rede, como usuário não privilegiado, com filesystem descartável e limites de CPU, memória, processos, saída e tempo

#### AC-071 — Encerrar remove os artefatos da tentativa

- **Dado** uma tentativa aprovada, falha, cancelada ou expirada
- **Quando** o estado terminal é persistido
- **Então** o ambiente efêmero é destruído e apenas resultado sanitizado e metadados ficam disponíveis durante a sessão

#### AC-072 — Concorrência não degrada a apresentação

- **Dado** o limite simultâneo atingido
- **Quando** outra execução é solicitada
- **Então** ela permanece em fila com posição visível ou é recusada com orientação clara, sem bloquear a API principal

### US-023 — Usar o laboratório durante uma apresentação

Como apresentador, quero navegação e resultados previsíveis, para demonstrar
o recurso por teclado e recuperar rapidamente um exemplo funcional.

#### AC-073 — O fluxo completo funciona por teclado

- **Dado** o laboratório aberto
- **Quando** uso somente teclado
- **Então** alterno Guia e Praticar, edito, executo, cancelo, navego pelo diagnóstico e retorno ao editor com foco visível

#### AC-074 — Resultado é anunciado sem roubar o foco

- **Dado** uma tentativa em andamento
- **Quando** seu estado muda ou termina
- **Então** uma região ao vivo anuncia o resumo e o foco permanece no controle atual, salvo ação explícita para Ir ao resultado

#### AC-075 — Restaurar exemplo recupera um estado executável

- **Dado** um exercício alterado ou falho
- **Quando** confirmo Restaurar exemplo
- **Então** o modelo do runner selecionado volta ao editor e uma nova execução pode ser feita sem recarregar a página

## Fora de escopo

- Executar código no navegador com `eval`, `Function`, Web Worker ou iframe.
- Permitir dependências npm arbitrárias, acesso à internet, shell, filesystem,
  variáveis de ambiente ou módulos nativos do Node.
- Corrigir ou reescrever automaticamente o código da pessoa.
- Explicação gerada por IA na primeira versão.
- Colaboração em tempo real, contas, ranking, salvamento em nuvem ou histórico
  permanente.
- Mais runners além de Jest e Jasmine.
- Testes de carga, cobertura, snapshots visuais ou múltiplos arquivos livres.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-019 | A primeira versão executará somente TypeScript e um arquivo de teste por tentativa. | aberta | — |
| ASM-020 | O exercício poderá importar apenas um harness do Cafeína Tracker, Supertest e APIs do runner selecionado. | aberta | — |
| ASM-021 | O limite inicial será 5 segundos, 128 MB de memória, 1 CPU, 32 processos e 64 KB de saída. | aberta | — |
| ASM-022 | Resultados ficarão somente em memória e serão descartados ao reiniciar o serviço. | aberta | — |
| ASM-023 | A interface reutilizará o drawer atual com modos Guia e Praticar. | aberta | — |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | A primeira entrega será apenas local para o seminário ou ficará acessível a usuários não confiáveis pela internet? | aberta | Recomendação: local primeiro, mantendo sandbox por container desde o início. |
| Q-002 | Docker pode ser requisito obrigatório para executar os testes isolados? | aberta | Recomendação: sim; sem isolamento de SO a feature não deve executar código arbitrário. |
| Q-003 | O editor deve usar CodeMirror 6 ou começar como textarea monoespaçada? | aberta | Recomendação: CodeMirror 6 para linha/coluna, diagnóstico e atalhos acessíveis. |
| Q-004 | A pessoa editará o arquivo completo ou somente o corpo de um teste dentro de um harness fixo? | aberta | Recomendação: arquivo completo com imports estritamente permitidos. |
| Q-005 | Diagnósticos determinísticos bastam na primeira versão ou haverá integração futura com IA? | aberta | Recomendação: determinísticos primeiro; IA exige consentimento, custo e política próprios. |
