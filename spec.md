# spec.md — cafeina-tracker-api

> Especificação técnica no padrão Spec-Driven Development (SDD).
> Este arquivo é a fonte da verdade do projeto. Qualquer agente de IA que for
> implementar o sistema deve seguir esta especificação na íntegra, na ordem
> das seções, e só gerar código depois de entender as seções 1 a 6.

---

## 1. Visão geral

**Nome do sistema:** Cafeína Tracker pra Dev
**Nome do repositório:** `cafeina-tracker-api`
**Tagline interna (piada do seminário):** *"Caffeine-Driven Development (CDD) — porque toda metodologia boa termina em D."*

**O que é:** uma API REST simples que calcula quantos cafés um desenvolvedor
precisa tomar pra sobreviver ao dia de trabalho, com base em horas de sono e
quantidade de reuniões, classifica o nível de risco de "overdose de
cafeína", sorteia um motivo extra pra justificar mais um café, e consulta o
status simulado de uma cafeteria (preço e disponibilidade).

**Propósito do artefato:** este sistema é o objeto de demonstração ao vivo
de um seminário de TI sobre testes automatizados, comparando **Jest** e
**Jasmine** rodando sobre a mesma lógica de negócio em TypeScript. O sistema
precisa, portanto, ser simples de explicar em poucos minutos e ter uma
lógica de negócio 100% desacoplada da camada HTTP, para ser testável pelos
dois frameworks sem nenhuma dependência de DOM ou de UI.

**Fora de escopo:** autenticação, persistência em banco de dados, front-end
completo, deploy em produção (o usuário fará o deploy manualmente depois).

---

## 2. Objetivos e critérios de sucesso

- O sistema deve rodar como uma API REST em Node.js + TypeScript + Express.
- Toda a lógica de negócio deve viver em funções puras, sem nenhuma
  referência a `req`/`res` do Express, para ser testável isoladamente.
- A mesma lista de casos de teste da lógica de negócio deve existir **nas
  duas** suítes (Jest e Jasmine), com paridade de cobertura entre elas.
- A suíte Jest deve cobrir, além da lógica de negócio: os endpoints HTTP
  (via `supertest`), um exemplo de snapshot testing, e relatório de
  cobertura de código.
- A suíte Jasmine deve cobrir a lógica de negócio equivalente à do Jest,
  usando `spyOn` para os pontos assíncronos e aleatórios.
- O projeto deve compilar e rodar sem exigir `ts-node` em produção nem
  dependências instáveis (evitar `jasmine-ts`) — compilar TypeScript com
  `tsc` para uma pasta `build/` é o método usado tanto para rodar o servidor
  quanto para rodar a suíte Jasmine.

---

## 3. Escopo funcional

### 3.1 Entidades e tipos

```typescript
interface PerfilDev {
  horasSono: number;          // 0 a 24
  quantidadeReunioes: number; // >= 0
}

interface ResultadoTracker {
  cafesRecomendados: number;
  nivelRisco: 'Seguro' | 'Atenção' | 'Risco Alto' | 'Chama o Cardiologista';
  motivoExtra: string;
}

interface StatusCafeteria {
  cafeteriaId: string;
  precoCafe: number;
  disponivel: boolean;
}

interface ErroValidacao {
  campo: string;
  mensagem: string;
}
```

### 3.2 Regras de negócio (funções puras — `src/logica/tracker.ts`)

#### `calcularCafesNecessarios(horasSono: number, quantidadeReunioes: number): number`
- Fórmula: `1 + max(0, 8 - horasSono) + floor(quantidadeReunioes / 2)`, com teto de 10.
- WHEN `horasSono` for 8 ou mais e `quantidadeReunioes` for 0, THE sistema SHALL retornar exatamente 1 (o café base do dia).
- WHEN `horasSono` for menor que 8, THE sistema SHALL somar 1 café pra cada hora de sono faltante em relação a 8.
- WHEN `quantidadeReunioes` for maior que 0, THE sistema SHALL somar 1 café a cada 2 reuniões (arredondado para baixo).
- IF o resultado calculado ultrapassar 10, THEN o sistema SHALL retornar exatamente 10 (teto máximo).

#### `classificarRiscoCafeina(cafesRecomendados: number): NivelRisco`
- IF `cafesRecomendados` for menor ou igual a 3, THEN o sistema SHALL classificar como `'Seguro'`.
- IF `cafesRecomendados` estiver entre 4 e 6, THEN o sistema SHALL classificar como `'Atenção'`.
- IF `cafesRecomendados` estiver entre 7 e 9, THEN o sistema SHALL classificar como `'Risco Alto'`.
- IF `cafesRecomendados` for 10, THEN o sistema SHALL classificar como `'Chama o Cardiologista'`.

#### `sortearMotivoExtra(): string`
- WHEN a função é chamada, THE sistema SHALL sortear e retornar uma string de uma lista fixa de pelo menos 5 motivos bem-humorados (ex: "a reunião podia ser um e-mail", "o build quebrou de novo", "é sexta-feira").
- Deve usar `Math.random()` internamente, para ser mockável nos testes.

#### `validarPerfilDev(perfil: PerfilDev): ErroValidacao[]`
- IF `horasSono` for menor que 0 ou maior que 24, THEN o sistema SHALL adicionar um erro com campo `"horasSono"`.
- IF `quantidadeReunioes` for negativo, THEN o sistema SHALL adicionar um erro com campo `"quantidadeReunioes"`.
- WHEN o perfil for válido, THE sistema SHALL retornar uma lista vazia.

#### `montarResultado(perfil: PerfilDev): ResultadoTracker`
- Função de composição que chama as três funções acima em sequência e monta o objeto de retorno completo.

### 3.3 Serviço assíncrono (`src/servico/cafeteria.ts`)

#### `buscarStatusCafeteria(cafeteriaId: string): Promise<StatusCafeteria>`
- Simula uma chamada de rede com `setTimeout` de ~200ms (representa uma
  futura integração real com uma API de cafeteria).
- WHEN `cafeteriaId` for uma string não vazia, THE sistema SHALL retornar um preço aleatório entre 3 e 12 (reais) e uma disponibilidade booleana aleatória.
- IF `cafeteriaId` estiver vazio, THEN o sistema SHALL rejeitar a Promise com o erro `"cafeteriaId inválido."`.
- Deve usar `Math.random()` internamente, para ser mockável nos testes.

### 3.4 Estado em memória (`src/servico/estatisticas.ts`)

#### `registrarResultado(resultado: ResultadoTracker): void`
- WHEN chamada, THE sistema SHALL adicionar `resultado.cafesRecomendados` a uma lista em memória.

#### `calcularMediaCafes(): number`
- IF a lista estiver vazia, THEN o sistema SHALL retornar 0.
- WHEN a lista tiver ao menos um item, THE sistema SHALL retornar a média aritmética.

#### `resetarEstatisticas(): void`
- Limpa a lista em memória. **Uso obrigatório em `beforeEach` nos testes** que tocam essa camada, para evitar contaminação entre specs.

### 3.5 Endpoints HTTP (`src/servidor.ts`)

#### `POST /tracker`
Corpo esperado: `PerfilDev`.
- WHEN o corpo for válido, THE sistema SHALL retornar HTTP 200 com um `ResultadoTracker` e registrar o resultado nas estatísticas.
- IF o corpo for inválido, THEN o sistema SHALL retornar HTTP 400 com a lista de `ErroValidacao`.

#### `GET /cafeteria/:id`
- WHEN `:id` for informado, THE sistema SHALL retornar HTTP 200 com o `StatusCafeteria`.
- IF `:id` estiver vazio, THEN o sistema SHALL retornar HTTP 400 com uma mensagem de erro.

#### `GET /estatisticas`
- WHEN chamado, THE sistema SHALL retornar HTTP 200 com `{ mediaCafes: number }`.

#### `GET /health`
- WHEN chamado, THE sistema SHALL retornar HTTP 200 com uma mensagem simples confirmando que o servidor está no ar.

---

## 4. Arquitetura recomendada

Arquitetura em camadas simples (sem banco de dados, sem autenticação):

```
Rotas (Express)  →  Serviços/Lógica de negócio (funções puras)  →  Estado em memória
```

**Por que separar assim:** a camada de lógica de negócio não pode importar
nada do Express. Isso é o que permite que ela seja testada tanto por Jest
quanto por Jasmine sem nenhuma dependência do runtime HTTP ou de DOM
simulado. As rotas são só "casca fina" que chama a lógica e traduz o
resultado em HTTP.

---

## 5. Stack de desenvolvimento

- **Runtime:** Node.js LTS
- **Linguagem:** TypeScript (strict mode ligado, sem uso de `any`)
- **Framework HTTP:** Express
- **Sem front-end** neste escopo (pode ser adicionado depois como HTML estático simples, fora desta spec)

---

## 6. Stack de testes

- **Jest** (`ts-jest`) — testa a lógica de negócio pura, os endpoints HTTP (via `supertest`), inclui um exemplo de `toMatchSnapshot()` e roda com `--coverage`.
- **Jasmine** (compilado via `tsc`, sem `ts-node`/`jasmine-ts`) — testa a mesma lógica de negócio pura, usando `spyOn` para os pontos assíncronos e aleatórios.
- **Importante:** `@types/jest` e `@types/jasmine` **não podem** conviver no mesmo `tsconfig` (ambos declaram globais como `describe`/`it`/`expect` e geram conflito de tipos). Usar dois arquivos de configuração:
  - `tsconfig.json` (base): `"types": ["node", "jasmine"]`, inclui `src/**/*.ts` e `tests-jasmine/**/*.ts`. Usado por `npm run build`.
  - `tsconfig.jest.json` (estende a base): `"types": ["node", "jest"]`, inclui `src/**/*.ts` e `tests-jest/**/*.ts`. Usado só pelo `ts-jest`.
- **Convenção de nomes:** arquivos Jest terminam em `.test.ts`; arquivos Jasmine terminam em `.spec.ts`.

---

## 7. Estrutura de pastas

```
cafeina-tracker-api/
  package.json
  tsconfig.json
  tsconfig.jest.json
  jest.config.js
  README.md
  src/
    logica/
      tipos.ts
      tracker.ts
    servico/
      cafeteria.ts
      estatisticas.ts
    servidor.ts
    index.ts
  tests-jest/
    tracker.test.ts
    cafeteria.test.ts
    servidor.test.ts
  tests-jasmine/
    tracker.spec.ts
    cafeteria.spec.ts
    support/
      jasmine.json
```

---

## 8. Plano de tarefas (executar nesta ordem)

1. Inicializar `package.json` com scripts: `build`, `start`, `dev`, `test:jest`, `test:jest:coverage`, `test:jasmine`.
2. Instalar dependências (ver seção 6) e configurar `tsconfig.json` + `tsconfig.jest.json` + `jest.config.js`.
3. Implementar `src/logica/tipos.ts` e `src/logica/tracker.ts` conforme seção 3.2.
4. Implementar `src/servico/cafeteria.ts` e `src/servico/estatisticas.ts` conforme seções 3.3 e 3.4.
5. Implementar `src/servidor.ts` e `src/index.ts` conforme seção 3.5.
6. Escrever a suíte Jest completa (`tests-jest/`), incluindo o exemplo de snapshot.
7. Escrever a suíte Jasmine completa (`tests-jasmine/`), com a mesma cobertura de casos da suíte Jest para a lógica de negócio.
8. Rodar `npm run build`, `npm run test:jest` e `npm run test:jasmine` e confirmar que tudo passa sem erros antes de considerar a tarefa concluída.
9. Escrever um `README.md` com instruções de instalação, execução e explicação rápida do propósito do projeto (uso em seminário).

---

## 9. Convenções de código

- Nomes de variáveis, funções e tipos em português, consistentes com o domínio descrito nesta spec.
- TypeScript em modo estrito (`strict: true`), proibido uso de `any`.
- Nenhuma lógica de negócio deve importar `express`.
- Toda função que usa `Math.random()` ou `setTimeout`/chamada assíncrona deve ser exportada individualmente, para permitir mock/spy direto nos testes.

---

## 10. Decisões que fecham lacunas da especificação

- `quantidadeReunioes` é uma contagem inteira, finita e não negativa.
- `horasSono` aceita frações, mas deve ser um número finito entre 0 e 24.
- O preço simulado é arredondado para duas casas decimais e permanece entre
  R$ 3,00 e R$ 12,00, inclusive nos valores-limite controlados em teste.
- Identificadores vazios ou formados apenas por espaços são inválidos.
- O atraso simulado da cafeteria é exatamente 200 ms.
- Erros de perfil usam diretamente uma lista de `ErroValidacao`; demais erros
  usam `{ "mensagem": string }`.
- `src/servidor.ts` exporta o aplicativo Express sem abrir uma porta;
  `src/index.ts` é o único ponto de inicialização e usa `PORT` ou `3000`.
- As suítes de lógica carregam marcadores de paridade comparados por um teste
  Jest, tornando a equivalência entre Jest e Jasmine verificável.
