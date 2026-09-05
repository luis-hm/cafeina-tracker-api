# Auditoria de arquitetura

## Objetivo

Esta revisão avaliou módulos, interfaces, seams, dependências, artefatos de
build, execução e testes. O princípio usado foi manter módulos profundos: uma
interface pequena deve esconder bastante comportamento e concentrar mudanças.

## Correções aplicadas

| Achado | Problema arquitetural | Correção |
|---|---|---|
| HTML de cobertura duplicado | `html` e `lcov` geravam duas árvores navegáveis | reporters alterados para `text`, `html` e `lcovonly` |
| Entrada HTTP convertida por cast | o transporte afirmava ter `PerfilDev` antes de validar os dados externos | `interpretarPerfilDev(unknown)` agora devolve sucesso ou erros de forma discriminada |
| Handler conhecia parsing e invariantes | conhecimento do domínio estava espalhado no Express | parsing, validação e construção foram concentrados no módulo `logica/tracker` |
| Health dentro de cafeteria | o módulo de cafeteria expunha uma capacidade operacional sem relação com seu domínio | criado `frontend/src/features/status/` |
| Requisito de Node divergente | a raiz aceitava versões que o Vite atual não suporta | ambos os pacotes agora exigem Node 20.19+ |
| Comando `dev` ambíguo | `npm run dev` iniciava apenas a API compilada | `dev` agora encaminha para `dev:all` |
| Interface frontend morta | `ErroApi` era exportado sem consumidor ou invariantes próprios | tipo removido da interface pública |
| Formatação do servidor quebrada | rotas aparentavam estar fora da factory e dificultavam leitura | factory e handlers foram reorganizados sem criar arquivos rasos |

## Decisões mantidas intencionalmente

### Dois pacotes e dois lockfiles

Backend e frontend possuem runtimes e toolchains diferentes. Mantê-los como
pacotes npm independentes evita instalar React no servidor ou Express no bundle
do navegador. Um workspace seria possível, mas contrariaria o isolamento e a
reprodutibilidade definidos pela spec atual sem trazer leverage neste tamanho.

### Tipos HTTP repetidos no frontend

`frontend/src/types/api.ts` espelha os payloads do servidor deliberadamente. O
frontend não importa `src/logica/tipos.ts`, pois essa dependência atravessaria a
seam HTTP e poderia carregar detalhes de Node/Express para o navegador.

Se os contratos crescerem, a evolução recomendada é gerar um pacote de contrato
ou tipos a partir de OpenAPI, não importar o backend diretamente.

### Rotas no mesmo módulo Express

O servidor possui quatro rotas pequenas e uma única implementação. Separar cada
rota agora criaria módulos rasos que apenas repassariam parâmetros. A factory
`criarServidor` já oferece a seam necessária para execução e testes.

### Estado de estatísticas em memória

O estado global da sessão é parte do escopo didático. Persistência, concorrência
entre múltiplos processos e banco de dados exigiriam outro módulo e outra spec.

### Jest e Jasmine em árvores distintas

As duas árvores existem para comparar runners sobre as mesmas regras. Não são
duplicação acidental: os marcadores de paridade verificam que a matriz de casos
permanece equivalente.

## Riscos conhecidos e próximos passos

- O frontend confia no formato de respostas HTTP 200 após a checagem do status.
  Se a API passar a ser externa ou versionada separadamente, adicione validação
  runtime dos payloads na seam dos adaptadores.
- O serviço de cafeteria usa aleatoriedade e temporizador globais. A seam atual
  é suficiente para uma implementação; extraia dependências somente quando
  existir um segundo adapter real ou uma integração externa.
- Não há autenticação, persistência ou rate limiting porque o sistema continua
  sendo uma demonstração local.
- Os testes frontend permanecem ausentes por decisão do responsável. Jest está
  configurado, mas a auditoria da spec não considerará esses critérios provados
  até que os casos sejam escritos.
- A feature visual continua especificada e ainda não implementada.

## Resultado estrutural

Depois das correções, as dependências principais apontam das bordas para o
domínio:

```text
React/App → features → lib/http → HTTP → Express → lógica/serviços
                                types ← features
```

O parsing de entrada fica no domínio, o transporte apenas traduz HTTP, e cada
feature frontend expõe somente sua própria capacidade.
