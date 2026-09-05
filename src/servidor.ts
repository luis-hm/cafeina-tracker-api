import express, { Express, Response } from 'express';
import path from 'node:path';
import { interpretarPerfilDev, montarResultado } from './logica/tracker';
import { buscarStatusCafeteria } from './servico/cafeteria';
import { calcularMediaCafes, registrarResultado } from './servico/estatisticas';

async function responderStatusCafeteria(
  cafeteriaId: string,
  res: Response
): Promise<void> {
  try {
    const status = await buscarStatusCafeteria(cafeteriaId);
    res.status(200).json(status);
  } catch (erro: unknown) {
    const mensagem =
      erro instanceof Error
        ? erro.message
        : 'Não foi possível consultar a cafeteria.';
    res.status(400).json({ mensagem });
  }
}

export function criarServidor(
  frontendDist = path.resolve(process.cwd(), 'frontend/dist')
): Express {
  const app = express();

  app.use(express.json({ limit: '16kb' }));

  app.post('/tracker', (req, res) => {
    const validacao = interpretarPerfilDev(req.body);

    if (!validacao.valido) {
      res.status(400).json(validacao.erros);
      return;
    }

    const resultado = montarResultado(validacao.perfil);
    registrarResultado(resultado);
    res.status(200).json(resultado);
  });

  app.get('/cafeteria', (_req, res) => {
    res.status(400).json({ mensagem: 'cafeteriaId inválido.' });
  });

  app.get('/cafeteria/:id', async (req, res) => {
    await responderStatusCafeteria(req.params.id ?? '', res);
  });

  app.get('/estatisticas', (_req, res) => {
    res.status(200).json({ mediaCafes: calcularMediaCafes() });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ mensagem: 'Cafeína Tracker API está no ar.' });
  });

  app.use(express.static(frontendDist));

  return app;
}

const app = criarServidor();

export default app;
