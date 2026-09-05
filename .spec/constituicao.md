# Constituição — v1.1.0

<!--
  Princípios inegociáveis do projeto. Não são estilo: são restrições.
  P-xxx = princípio (código de rastreio, como US/AC/T).
  Níveis: [DEVE] obrigatório · [RECOMENDADO] forte · [PODE] permitido/explícito.
  Todo [DEVE] precisa de verificação executável — senão o audit acusa
  "princípio sem verificação" (PRINCIPIO_SEM_VERIFICACAO). Formatos:
    - verificação(gate): satisfeita pelo próprio audit (só p/ princípios "meta")
    - verificação(teste): @principle:P-xxx
    - verificação(proibido): `regex` em `glob`
    - verificação(obrigatório): `regex` em `glob`
-->

## P-001 [DEVE] Todo requisito tem prova executável

Nenhuma feature é declarada pronta sem o audit em modo CI sair limpo (exit 0).
Este princípio é verificado pelo próprio mecanismo do audit (AC_SEM_TESTE,
AC_SEM_PROVA, TASK_CONCLUIDA_SEM_PROVA) — não precisa de teste extra seu.

- verificação(gate): intrínseca ao audit

## P-002 [RECOMENDADO] Segredos nunca em código

Chaves e senhas vêm de variáveis de ambiente, nunca hard-coded.

- verificação(proibido): `(api[_-]?key|senha|password)\s*[:=]\s*['"][^'"]{8,}` em `src/**/*.ts`

## P-003 [DEVE] A lógica de negócio é independente do Express

Os módulos de lógica pura não conhecem requisições, respostas ou o framework
HTTP, para que Jest e Jasmine executem o mesmo contrato sem uma aplicação web.

- verificação(proibido): `from\s+['\"]express['\"]|require\(['\"]express['\"]\)` em `src/logica/**/*.ts`

## P-004 [DEVE] O código de produção não usa any explícito

Entradas externas começam como unknown e são validadas antes do uso; nenhum
atalho de tipagem pode desativar o modo estrito do TypeScript.

- verificação(proibido): `\bany\b` em `src/**/*.ts`
