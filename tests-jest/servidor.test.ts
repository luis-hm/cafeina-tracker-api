import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import request from 'supertest';
import app, { criarServidor } from '../src/servidor';
import * as cafeteria from '../src/servico/cafeteria';
import { resetarEstatisticas } from '../src/servico/estatisticas';

describe('API HTTP', () => {
  beforeEach(() => {
    resetarEstatisticas();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('@spec:AC-015 POST /tracker retorna e registra um resultado válido', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const resposta = await request(app)
      .post('/tracker')
      .send({ horasSono: 8, quantidadeReunioes: 0 });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({
      cafesRecomendados: 1,
      nivelRisco: 'Seguro',
      motivoExtra: 'a reunião podia ser um e-mail'
    });

    const estatisticas = await request(app).get('/estatisticas');
    expect(estatisticas.body).toEqual({ mediaCafes: 1 });
  });

  it('@spec:AC-016 POST /tracker retorna todos os erros e não registra entrada inválida', async () => {
    const resposta = await request(app).post('/tracker').send({});

    expect(resposta.status).toBe(400);
    expect(resposta.body).toEqual([
      expect.objectContaining({ campo: 'horasSono' }),
      expect.objectContaining({ campo: 'quantidadeReunioes' })
    ]);

    const estatisticas = await request(app).get('/estatisticas');
    expect(estatisticas.body).toEqual({ mediaCafes: 0 });
  });

  it('@spec:AC-017 GET /cafeteria/:id retorna o status da cafeteria', async () => {
    jest.spyOn(cafeteria, 'buscarStatusCafeteria').mockResolvedValue({
      cafeteriaId: 'central',
      precoCafe: 6.5,
      disponivel: true
    });

    const resposta = await request(app).get('/cafeteria/central');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({
      cafeteriaId: 'central',
      precoCafe: 6.5,
      disponivel: true
    });
  });

  it('@spec:AC-018 GET /cafeteria sem identificador ou com espaços retorna erro claro', async () => {
    const semId = await request(app).get('/cafeteria');
    const idEmBranco = await request(app).get('/cafeteria/%20');

    expect(semId.status).toBe(400);
    expect(semId.body).toEqual({ mensagem: 'cafeteriaId inválido.' });
    expect(idEmBranco.status).toBe(400);
    expect(idEmBranco.body).toEqual({ mensagem: 'cafeteriaId inválido.' });
  });

  it('@spec:AC-019 GET /estatisticas e /health informam média e saúde', async () => {
    const estatisticas = await request(app).get('/estatisticas');
    const health = await request(app).get('/health');

    expect(estatisticas.status).toBe(200);
    expect(estatisticas.body).toEqual({ mediaCafes: 0 });
    expect(health.status).toBe(200);
    expect(health.body).toEqual({ mensagem: 'Cafeína Tracker API está no ar.' });
  });

  it('@spec:AC-030 serve o frontend depois das rotas da API em um único processo', async () => {
    const frontendDist = mkdtempSync(path.join(tmpdir(), 'cafeina-frontend-'));
    writeFileSync(
      path.join(frontendDist, 'index.html'),
      '<!doctype html><title>Cafeína Tracker</title>',
      'utf8'
    );
    writeFileSync(path.join(frontendDist, 'health'), 'arquivo estático', 'utf8');

    try {
      const servidor = criarServidor(frontendDist);
      const pagina = await request(servidor).get('/');
      const health = await request(servidor).get('/health');

      expect(pagina.status).toBe(200);
      expect(pagina.text).toContain('<title>Cafeína Tracker</title>');
      expect(health.headers['content-type']).toContain('application/json');
      expect(health.body).toEqual({
        mensagem: 'Cafeína Tracker API está no ar.'
      });
    } finally {
      rmSync(frontendDist, { recursive: true, force: true });
    }
  });
});
