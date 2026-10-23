<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/brand/cafeina-logo-dark.svg">
    <img alt="Cafeína Tracker" src="docs/brand/cafeina-logo-light.svg" width="400">
  </picture>
</p>

# Cafeína Tracker pra Dev

> *Caffeine-Driven Development*

Aplicação didática com API Node.js/TypeScript/Express e frontend React/Vite. O projeto recomenda uma
quantidade de cafés com base nas horas de sono e no número de reuniões,
classifica o risco da recomendação, simula uma cafeteria e calcula a média das
recomendações em memória.

O projeto foi preparado para uma demonstração de testes automatizados: a mesma
matriz de lógica de negócio roda em Jest e Jasmine, enquanto o Jest também cobre
HTTP com Supertest. O frontend está configurado para futuros testes Jest com
Testing Library, mas nenhum caso frontend foi gerado.

## Requisitos

- Node.js 20.19 ou superior
- npm 10 ou superior

## Instalação limpa

```bash
npm ci
npm --prefix frontend ci
```

Os dois `package-lock.json` são independentes: o da raiz pertence à API e à
orquestração; o de `frontend/` pertence ao navegador.

## Desenvolvimento

```bash
npm run dev:all
```

- API: `http://127.0.0.1:3000`
- Vite: `http://127.0.0.1:5173`
- O Vite encaminha `/tracker`, `/cafeteria`, `/estatisticas` e `/health` para a API.
- Se um processo falhar, o outro também é encerrado.

Para executar separadamente, use `npm run dev:api` e `npm run dev:web`.

## Build e produção local

```bash
npm run build:all
npm start
```

O Express serve API e `frontend/dist` em `http://localhost:3000`. Para usar
outra porta:

```bash
PORT=4000 npm start
```

O processo de produção executa somente JavaScript compilado; `tsx` e Vite são
ferramentas de desenvolvimento e build.

## Endpoints

### Saúde

```http
GET /health
```

```json
{
  "mensagem": "Cafeína Tracker API está no ar."
}
```

### Calcular recomendação

```http
POST /tracker
Content-Type: application/json
```

```json
{
  "horasSono": 6,
  "quantidadeReunioes": 4
}
```

Exemplo de resposta:

```json
{
  "cafesRecomendados": 5,
  "nivelRisco": "Atenção",
  "motivoExtra": "o build quebrou de novo"
}
```

`horasSono` aceita números finitos entre 0 e 24. `quantidadeReunioes` deve ser
um inteiro não negativo. Entradas inválidas retornam HTTP 400 com todos os
erros encontrados:

```json
[
  {
    "campo": "horasSono",
    "mensagem": "horasSono deve ser um número finito entre 0 e 24."
  }
]
```

### Consultar cafeteria simulada

```http
GET /cafeteria/:id
```

Após 200 ms, retorna um preço entre R$ 3,00 e R$ 12,00 e a disponibilidade:

```json
{
  "cafeteriaId": "central",
  "precoCafe": 7.5,
  "disponivel": true
}
```

### Consultar estatísticas

```http
GET /estatisticas
```

```json
{
  "mediaCafes": 5
}
```

A média considera somente chamadas válidas a `POST /tracker` e volta a zero
quando o processo reinicia, pois não há banco de dados neste escopo.

## Comandos de teste

```bash
# Lógica, HTTP e snapshot no Jest
npm run test:jest

# Jest com relatório de cobertura em coverage/
npm run test:jest:coverage

# Tipos dos testes Jest com a mesma configuração usada pelo editor
npm run typecheck:jest

# Compila TypeScript e executa Jasmine sobre build/
npm run test:jasmine

# Executa as duas suítes
npm test

# Testes comportamentais do frontend
npm run test:frontend

# Todas as suítes
npm run test:all

# Builds, tipos do Jest, testes, lint e tipos do frontend
npm run verify:all

# Auditoria dos dois lockfiles
npm run audit:all
```

Os casos compartilhados possuem marcadores `@paridade:<caso>`. O teste de
contrato em `tests-jest/paridade.test.ts` compara os marcadores das duas suítes
e falha se um caso existir em apenas um framework.

## Estrutura

```text
src/
  logica/       tipos e funções puras do tracker
  servico/      cafeteria assíncrona e estatísticas em memória
  servidor.ts   aplicação Express, rotas e frontend compilado
  index.ts      ponto de inicialização do processo
frontend/
  src/app/      composição e testes comportamentais
  src/components/ui/  componentes reutilizáveis
  src/features/ módulos de domínio do navegador
  src/lib/      cliente HTTP e utilitários
  src/test/     setup e mocks técnicos do Jest
tests-jest/     lógica, serviços, endpoints, paridade e snapshot
tests-jasmine/  matriz equivalente da lógica e dos serviços
```

## Decisões de arquitetura

- A lógica de negócio não importa Express e pode ser testada isoladamente.
- `src/servidor.ts` exporta o app; somente `src/index.ts` chama `listen`.
- TypeScript usa modo estrito e não há `any` explícito no código de produção.
- Jest e Jasmine possuem `tsconfig` separados para evitar conflito entre seus
  tipos globais.
- O estado das estatísticas é reiniciado em `beforeEach` nas suítes que o usam.
- O frontend chama `fetch` somente em `src/lib/http.ts` e consome features por
  suas interfaces públicas.
- Desenvolvimento usa dois processos; produção local usa um único Express.

## Documentação

Os guias detalhados estão em [`docs/`](docs/README.md), incluindo a teoria de
Jest e Jasmine e a estrutura recomendada para você implementar seus testes.

## Portas ocupadas

O Vite usa `strictPort`, então não troca silenciosamente a porta 5173. Se 3000
ou 5173 estiver ocupada, encerre o processo correspondente. Em Linux,
`ss -ltnp` ajuda a identificar o processo. Depois execute `npm run dev:all`.

## Fora de escopo

Autenticação, persistência, integração real com cafeterias e deploy em nuvem não
fazem parte desta versão. O refinamento visual e as animações estão especificados
separadamente em `.spec/features/frontend-design/`.
