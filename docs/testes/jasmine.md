# Jasmine: teoria e uso no projeto

## O que é

Jasmine é um framework de testes orientado a especificações de comportamento.
Ele fornece descoberta de suítes, `describe`, `it`, expectativas e spies sem
exigir uma biblioteca de asserções separada.

Seu fluxo mental é semelhante ao Jest, mas as APIs de mock pertencem ao objeto
`jasmine`. No projeto ele funciona como uma segunda implementação da mesma
matriz de regras da API, útil para comparar estilos e verificar que a lógica de
negócio não depende de um runner específico.

## Conceitos principais

- `describe` agrupa uma especificação.
- `it` representa um exemplo de comportamento.
- `expect` compara o resultado obtido com o esperado.
- `beforeEach` e `afterEach` isolam estado entre casos.
- `jasmine.createSpy()` cria uma função espiã.
- `spyOn(objeto, 'metodo')` observa ou substitui um método.
- Um `it` pode retornar uma Promise; o Jasmine aguarda sua conclusão.

Também vale a organização AAA: preparar, agir e verificar. Um caso deve falhar
por uma razão clara e não depender da ordem de execução dos demais.

## Como está configurado

- Fontes dos testes: `tests-jasmine/**/*.spec.ts`
- TypeScript principal: `tsconfig.json`
- Saída compilada: `build/tests-jasmine/**/*.spec.js`
- Configuração do runner: `tests-jasmine/support/jasmine.json`
- Ambiente: Node.js
- Ordem aleatória: desativada para a demonstração atual

O Jasmine não executa o TypeScript diretamente neste projeto. O script primeiro
roda `tsc` e depois aponta o runner para o JavaScript em `build/`. Isso deixa o
processo de produção e o processo de teste explícitos e evita loaders mágicos.

## Onde criar seus testes

Para uma regra em `src/logica/tracker.ts`, crie futuramente:

```text
tests-jasmine/tracker.spec.ts
```

Exemplo apenas didático, não adicionado ao código:

```ts
describe('calcularCafesNecessarios', () => {
  it('considera o déficit de sono', () => {
    // Arrange: definir horas e reuniões.
    // Act: chamar a função pública.
    // Assert: usar expect(resultado).toBe(valorEsperado).
  })
})
```

## Comandos

```bash
# Compila a API e executa Jasmine sobre build/
npm run test:jasmine

# Executa Jest e Jasmine da API
npm test
```

## Spies e assincronismo

Prefira devolver Promises nos casos assíncronos. Use o callback `done` apenas
quando a API testada não puder ser representada por uma Promise. Ao criar um
spy, configure retorno com `and.returnValue`, `and.resolveTo` ou `and.rejectWith`
e verifique chamadas com matchers como `toHaveBeenCalledWith`.

Restaure ou recrie dependências em cada caso. Estado compartilhado torna a
suíte dependente da ordem e dificulta descobrir a causa de uma falha.
