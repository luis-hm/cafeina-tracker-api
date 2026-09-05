# Spec: Cafeína Tracker API

> feature: cafeina-tracker-api
> status: auditada

## Contexto

A API serve como demonstração didática de testes automatizados com Jest e
Jasmine sobre a mesma lógica de negócio TypeScript. Ela recomenda cafés a
partir do sono e das reuniões de uma pessoa desenvolvedora, classifica o
risco, simula uma cafeteria e mantém estatísticas apenas em memória.

## Histórias

### US-001 — Receber uma recomendação diária de cafés

Como pessoa desenvolvedora, quero calcular minha necessidade de café a partir
do sono e das reuniões, para ter uma recomendação previsível e limitada.

#### AC-001 — Um dia descansado começa com um café

- **Dado** que dormi pelo menos 8 horas e não tenho reuniões
- **Quando** calculo os cafés necessários
- **Então** recebo exatamente 1 café recomendado

#### AC-002 — Cada hora de sono em falta aumenta a recomendação

- **Dado** que dormi menos de 8 horas e não tenho reuniões
- **Quando** calculo os cafés necessários
- **Então** recebo o café base mais 1 café por hora de sono em falta

#### AC-003 — Duas reuniões acrescentam um café

- **Dado** que tenho uma quantidade não negativa de reuniões
- **Quando** calculo os cafés necessários
- **Então** recebo 1 café adicional por grupo completo de 2 reuniões

#### AC-004 — A recomendação nunca ultrapassa dez cafés

- **Dado** que a combinação de sono e reuniões resultaria em mais de 10 cafés
- **Quando** calculo os cafés necessários
- **Então** recebo exatamente 10 cafés recomendados

### US-002 — Entender o risco e o motivo da recomendação

Como pessoa desenvolvedora, quero uma classificação clara e uma justificativa
bem-humorada, para interpretar a recomendação rapidamente.

#### AC-005 — Cada faixa de cafés possui uma classificação de risco

- **Dado** um total recomendado entre 1 e 10 cafés
- **Quando** classifico o risco da cafeína
- **Então** recebo Seguro até 3, Atenção de 4 a 6, Risco Alto de 7 a 9 e Chama o Cardiologista em 10

#### AC-006 — O motivo extra vem de uma lista fixa e sorteável

- **Dado** uma lista fixa com pelo menos 5 motivos bem-humorados
- **Quando** sorteio um motivo com um valor aleatório controlado
- **Então** recebo o item correspondente dessa lista

### US-003 — Rejeitar perfis inválidos e compor resultados válidos

Como consumidor da API, quero erros por campo e um resultado completo para
entradas válidas, para corrigir os dados sem ambiguidade.

#### AC-007 — Horas de sono inválidas são identificadas

- **Dado** um perfil com horas de sono ausentes, não numéricas, não finitas, menores que 0 ou maiores que 24
- **Quando** valido o perfil
- **Então** recebo um erro associado ao campo horasSono

#### AC-008 — Quantidades de reuniões inválidas são identificadas

- **Dado** um perfil com reuniões ausentes, não inteiras, não finitas ou negativas
- **Quando** valido o perfil
- **Então** recebo um erro associado ao campo quantidadeReunioes

#### AC-009 — Um perfil válido produz um resultado completo

- **Dado** um perfil com horas de sono e reuniões válidas
- **Quando** monto o resultado do tracker com o sorteio controlado
- **Então** recebo cafés recomendados, nível de risco e motivo extra coerentes

### US-004 — Consultar uma cafeteria simulada

Como pessoa desenvolvedora, quero consultar preço e disponibilidade de café,
para demonstrar testes de comportamento assíncrono e aleatório.

#### AC-010 — Uma cafeteria válida retorna status depois da simulação

- **Dado** um identificador de cafeteria não vazio e valores aleatórios controlados
- **Quando** consulto o status da cafeteria
- **Então** após 200 ms recebo o identificador, um preço entre R$ 3,00 e R$ 12,00 com duas casas e uma disponibilidade booleana

#### AC-011 — Uma cafeteria sem identificador é rejeitada

- **Dado** um identificador vazio ou formado apenas por espaços
- **Quando** consulto o status da cafeteria
- **Então** a consulta é rejeitada com a mensagem cafeteriaId inválido.

### US-005 — Acompanhar a média de cafés em memória

Como apresentador do seminário, quero registrar recomendações e consultar sua
média, para demonstrar isolamento de estado entre testes.

#### AC-012 — Sem recomendações a média é zero

- **Dado** que as estatísticas foram reiniciadas
- **Quando** calculo a média de cafés
- **Então** recebo 0

#### AC-013 — Recomendações registradas produzem média aritmética

- **Dado** duas ou mais recomendações registradas
- **Quando** calculo a média de cafés
- **Então** recebo a média aritmética dos valores recomendados

#### AC-014 — Reiniciar remove todas as recomendações anteriores

- **Dado** que existem recomendações registradas
- **Quando** reinicio as estatísticas
- **Então** a média volta a ser 0

### US-006 — Consumir as funcionalidades por HTTP

Como consumidor da API, quero acessar o tracker, a cafeteria, as estatísticas
e a saúde do serviço por HTTP, para integrar sem conhecer a lógica interna.

#### AC-015 — Um perfil válido retorna e registra a recomendação

- **Dado** um corpo de requisição com perfil válido
- **Quando** envio POST para /tracker
- **Então** recebo HTTP 200 com o resultado completo e a recomendação passa a compor as estatísticas

#### AC-016 — Um perfil inválido retorna todos os erros encontrados

- **Dado** um corpo de requisição com campos inválidos ou ausentes
- **Quando** envio POST para /tracker
- **Então** recebo HTTP 400 com uma lista de erros por campo e nada é registrado

#### AC-017 — A cafeteria pode ser consultada por HTTP

- **Dado** um identificador de cafeteria na URL
- **Quando** envio GET para /cafeteria/:id
- **Então** recebo HTTP 200 com o status simulado da cafeteria

#### AC-018 — A rota de cafeteria sem identificador explica o erro

- **Dado** uma URL de cafeteria sem identificador ou com identificador em branco
- **Quando** envio a requisição GET
- **Então** recebo HTTP 400 com a mensagem cafeteriaId inválido.

#### AC-019 — Estatísticas e saúde estão disponíveis por HTTP

- **Dado** que a API está em execução
- **Quando** consulto /estatisticas e /health
- **Então** ambas respondem HTTP 200 com a média atual e uma confirmação de saúde, respectivamente

### US-007 — Demonstrar paridade entre Jest e Jasmine

Como apresentador do seminário, quero executar a mesma matriz de casos de
negócio nos dois frameworks, para comparar suas APIs sem mudar o contrato.

#### AC-020 — Jest e Jasmine cobrem a mesma matriz da lógica de negócio

- **Dado** as suítes Jest e Jasmine da lógica de negócio
- **Quando** comparo os identificadores dos casos de teste de cada suíte
- **Então** as duas possuem exatamente a mesma matriz de casos e ambas passam

#### AC-021 — A execução de produção usa somente JavaScript compilado

- **Dado** uma instalação das dependências do projeto
- **Quando** executo o build e inicio o servidor ou a suíte Jasmine
- **Então** ambos usam os arquivos JavaScript gerados em build sem ts-node nem jasmine-ts

## Fora de escopo

- Autenticação e autorização.
- Persistência em banco de dados ou entre reinícios do processo.
- Interface web ou aplicativo móvel.
- Integração real com cafeterias.
- Deploy e operação em produção.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | Quantidade de reuniões representa uma contagem inteira. | confirmada | A autorização para melhorar lacunas permite rejeitar valores fracionários, ausentes e não finitos. |
| ASM-002 | Horas de sono podem ter frações, mas precisam ser números finitos entre 0 e 24. | confirmada | Preserva a fórmula literal e permite valores como 7,5 horas. |
| ASM-003 | O preço simulado é arredondado para centavos e fica no intervalo fechado de R$ 3,00 a R$ 12,00. | confirmada | Define precisão monetária e inclui os limites quando o aleatório é controlado nos testes. |
| ASM-004 | Identificadores contendo apenas espaços são equivalentes a identificadores vazios. | confirmada | Evita respostas válidas para IDs sem conteúdo útil. |
| ASM-005 | Erros de perfil são retornados como uma lista JSON; outros erros usam um objeto com a propriedade mensagem. | confirmada | Mantém o formato solicitado e uma resposta simples para erros não tabulares. |
| ASM-006 | O atraso simulado da cafeteria é exatamente 200 ms e a porta padrão do servidor é 3000. | confirmada | Torna o comportamento determinístico para demonstração e ainda permite sobrescrever PORT. |

## Perguntas em aberto

Nenhuma.
