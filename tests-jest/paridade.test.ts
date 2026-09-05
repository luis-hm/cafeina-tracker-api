import { Dirent, existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function listarArquivos(diretorio: string, sufixo: string): string[] {
  const entradas: Dirent[] = readdirSync(diretorio, { withFileTypes: true });

  return entradas.flatMap((entrada) => {
    const caminho = path.join(diretorio, entrada.name);

    if (entrada.isDirectory()) {
      return listarArquivos(caminho, sufixo);
    }

    return caminho.endsWith(sufixo) ? [caminho] : [];
  });
}

function extrairMarcadores(arquivos: string[]): string[] {
  const marcadores = new Set<string>();

  for (const arquivo of arquivos) {
    const conteudo = readFileSync(arquivo, 'utf8');

    for (const ocorrencia of conteudo.matchAll(/@paridade:([A-Z0-9-]+)/g)) {
      const marcador = ocorrencia[1];
      if (marcador !== undefined) {
        marcadores.add(marcador);
      }
    }
  }

  return [...marcadores].sort();
}

describe('contratos do projeto', () => {
  it('@spec:AC-020 Jest e Jasmine possuem a mesma matriz marcada de casos de negócio', () => {
    const casosJest = extrairMarcadores(listarArquivos('tests-jest', '.test.ts'));
    const casosJasmine = extrairMarcadores(
      listarArquivos('tests-jasmine', '.spec.ts')
    );

    expect(casosJest.length).toBeGreaterThan(0);
    expect(casosJest).toEqual(casosJasmine);
  });

  it('@spec:AC-021 produção e Jasmine apontam somente para JavaScript compilado', () => {
    const pacote = readFileSync('package.json', 'utf8');
    const configuracaoJasmine = readFileSync(
      'tests-jasmine/support/jasmine.json',
      'utf8'
    );

    expect(pacote).toContain('"start": "node build/src/index.js"');
    expect(pacote).toContain('"test:jasmine": "npm run build && jasmine');
    expect(pacote).not.toMatch(/ts-node|jasmine-ts/);
    expect(configuracaoJasmine).toContain('"spec_dir": "build/tests-jasmine"');
    expect(existsSync('build/src/index.js')).toBe(true);
    expect(existsSync('build/tests-jasmine/tracker.spec.js')).toBe(true);
  });
});
