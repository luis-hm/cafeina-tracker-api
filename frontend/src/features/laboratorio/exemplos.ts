export const exemplosDePerfil = [
  { nome: 'Dia tranquilo', horasSono: 8, quantidadeReunioes: 1 },
  { nome: 'Sprint intensa', horasSono: 5, quantidadeReunioes: 6 },
] as const

export type TestRunner = 'jest' | 'jasmine'
export type TestPhase = 'Arrange' | 'Act' | 'Assert'

export interface GuidedTestLine {
  code: string
  phase: TestPhase
  title: string
  explanation: string
  importance: string
  difference?: string
}

export interface GuidedTestCase {
  runner: TestRunner
  label: string
  fileName: string
  objective: string
  parityMarker: string
  lines: GuidedTestLine[]
}

const commonArrange = {
  profileOpen: {
    phase: 'Arrange',
    title: 'Começa a montar a entrada',
    explanation:
      'Cria o objeto que representa o dia da pessoa desenvolvedora enviado para a API.',
    importance:
      'Sem uma entrada conhecida, o teste não consegue prever qual recomendação deveria receber.',
  },
  sleep: {
    phase: 'Arrange',
    title: 'Define seis horas de sono',
    explanation:
      'Informa um déficit de duas horas em relação às oito horas consideradas ideais.',
    importance:
      'Esse valor adiciona dois cafés à regra de cálculo e torna o resultado determinístico.',
  },
  meetings: {
    phase: 'Arrange',
    title: 'Define duas reuniões',
    explanation:
      'Duas reuniões completas adicionam mais um café à recomendação.',
    importance:
      'A linha cobre a segunda parte da regra sem criar um cenário difícil de explicar.',
  },
} as const

export const guidedTestCases: Record<TestRunner, GuidedTestCase> = {
  jest: {
    runner: 'jest',
    label: 'Jest',
    fileName: 'tracker.test.ts',
    objective:
      'Provar que seis horas de sono e duas reuniões resultam em quatro cafés: um café base, dois pelo sono e um pelas reuniões.',
    parityMarker: '@paridade:CALC-BASE',
    lines: [
      {
        code: "test('recomenda 4 cafés para o perfil base', async () => {",
        phase: 'Arrange',
        title: 'Declara o caso no Jest',
        explanation:
          'Abre um teste assíncrono e dá a ele um nome que descreve o comportamento esperado.',
        importance:
          'O nome documenta a regra de negócio e ajuda a localizar rapidamente uma falha no relatório.',
        difference: 'No Jasmine, a função equivalente se chama it.',
      },
      {
        code: '  const perfil = {',
        ...commonArrange.profileOpen,
      },
      {
        code: '    horasSono: 6,',
        ...commonArrange.sleep,
      },
      {
        code: '    quantidadeReunioes: 2,',
        ...commonArrange.meetings,
      },
      {
        code: '  }',
        phase: 'Arrange',
        title: 'Finaliza o perfil',
        explanation: 'Fecha o objeto usado como corpo da requisição.',
        importance:
          'Mantém toda a preparação reunida antes da ação que será exercitada.',
      },
      {
        code: '  const resposta = await request(app)',
        phase: 'Act',
        title: 'Inicia a chamada HTTP',
        explanation:
          'Usa o Supertest para chamar o servidor Express em memória e aguarda a resposta.',
        importance:
          'Exercita a mesma fronteira HTTP usada pelo frontend, sem precisar abrir uma porta real.',
      },
      {
        code: "    .post('/tracker')",
        phase: 'Act',
        title: 'Escolhe método e rota',
        explanation: 'Define que a ação observada é um POST para /tracker.',
        importance:
          'Garante que o teste cobre o endpoint correto e não apenas a função de cálculo isolada.',
      },
      {
        code: '    .send(perfil)',
        phase: 'Act',
        title: 'Envia o perfil preparado',
        explanation: 'Serializa o objeto perfil como JSON da requisição.',
        importance:
          'Conecta os valores do Arrange à ação executada contra a API.',
      },
      {
        code: '  expect(resposta.status).toBe(200)',
        phase: 'Assert',
        title: 'Confere o contrato HTTP',
        explanation: 'Verifica que a API aceitou a entrada e respondeu com status 200.',
        importance:
          'Se o endpoint rejeitar o perfil ou quebrar, esta expectativa aponta a falha antes de analisar o corpo.',
        difference: 'No Jasmine, a expectativa usa toEqual(200).',
      },
      {
        code: '  expect(resposta.body.cafesRecomendados).toBe(4)',
        phase: 'Assert',
        title: 'Confere a regra de negócio',
        explanation:
          'Lê cafesRecomendados no JSON retornado e exige exatamente o valor quatro.',
        importance:
          'Esta é a prova principal: uma mudança acidental na fórmula faz o teste falhar.',
        difference: 'No Jasmine, a expectativa equivalente usa toEqual(4).',
      },
      {
        code: '}) // @paridade:CALC-BASE',
        phase: 'Assert',
        title: 'Fecha e identifica o caso',
        explanation:
          'Encerra o teste e adiciona o marcador que liga este cenário à versão Jasmine.',
        importance:
          'O marcador permite auditar mecanicamente se os dois runners cobrem o mesmo comportamento.',
      },
    ],
  },
  jasmine: {
    runner: 'jasmine',
    label: 'Jasmine',
    fileName: 'tracker.spec.ts',
    objective:
      'Provar o mesmo resultado de quatro cafés usando a sintaxe do Jasmine, sem mudar a entrada nem a regra observada.',
    parityMarker: '@paridade:CALC-BASE',
    lines: [
      {
        code: "it('recomenda 4 cafés para o perfil base', async () => {",
        phase: 'Arrange',
        title: 'Declara o caso no Jasmine',
        explanation:
          'Abre um spec assíncrono com um nome que descreve o comportamento esperado.',
        importance:
          'Apesar do nome da função mudar, o caso continua documentando a mesma regra.',
        difference: 'No Jest, a função usada neste projeto se chama test.',
      },
      {
        code: '  const perfil = {',
        ...commonArrange.profileOpen,
      },
      {
        code: '    horasSono: 6,',
        ...commonArrange.sleep,
      },
      {
        code: '    quantidadeReunioes: 2,',
        ...commonArrange.meetings,
      },
      {
        code: '  }',
        phase: 'Arrange',
        title: 'Finaliza o perfil',
        explanation: 'Fecha o objeto usado como corpo da requisição.',
        importance:
          'Mantém a preparação idêntica à versão Jest para uma comparação justa.',
      },
      {
        code: '  const resposta = await request(app)',
        phase: 'Act',
        title: 'Inicia a chamada HTTP',
        explanation:
          'Usa o Supertest para chamar o servidor Express em memória e aguarda a resposta.',
        importance:
          'O serviço exercitado é o mesmo; trocar o runner não muda a aplicação testada.',
      },
      {
        code: "    .post('/tracker')",
        phase: 'Act',
        title: 'Escolhe método e rota',
        explanation: 'Define que a ação observada é um POST para /tracker.',
        importance:
          'Garante que o spec percorre a fronteira HTTP completa.',
      },
      {
        code: '    .send(perfil)',
        phase: 'Act',
        title: 'Envia o perfil preparado',
        explanation: 'Serializa o objeto perfil como JSON da requisição.',
        importance:
          'Conecta a preparação à ação com os mesmos dados da versão Jest.',
      },
      {
        code: '  expect(resposta.status).toEqual(200)',
        phase: 'Assert',
        title: 'Confere o contrato HTTP',
        explanation: 'Verifica que a API aceitou a entrada e respondeu com status 200.',
        importance:
          'A expectativa sinaliza uma quebra do endpoint antes da verificação do resultado.',
        difference: 'No Jest, este caso usa toBe(200).',
      },
      {
        code: '  expect(resposta.body.cafesRecomendados).toEqual(4)',
        phase: 'Assert',
        title: 'Confere a regra de negócio',
        explanation:
          'Lê cafesRecomendados no JSON retornado e compara com o valor quatro.',
        importance:
          'Prova exatamente a mesma regra que a expectativa Jest.',
        difference: 'No Jest, este caso usa toBe(4).',
      },
      {
        code: '}) // @paridade:CALC-BASE',
        phase: 'Assert',
        title: 'Fecha e identifica o caso',
        explanation:
          'Encerra o spec e registra o marcador compartilhado com o Jest.',
        importance:
          'A paridade mostra que os frameworks são ferramentas diferentes para a mesma expectativa.',
      },
    ],
  },
}
