import { buscarStatusCafeteria } from '../src/servico/cafeteria';

describe('serviço de cafeteria', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('@paridade:CAFETERIA-STATUS @spec:AC-010 retorna preço e disponibilidade após 200 ms', async () => {
    const temporizador = jest.spyOn(global, 'setTimeout');
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.75);

    const consulta = buscarStatusCafeteria('central');

    expect(temporizador).toHaveBeenCalledWith(expect.any(Function), 200);
    jest.advanceTimersByTime(200);

    await expect(consulta).resolves.toEqual({
      cafeteriaId: 'central',
      precoCafe: 7.5,
      disponivel: true
    });
  });

  it('@paridade:CAFETERIA-ID-INVALIDO @spec:AC-011 rejeita identificadores vazios', async () => {
    await expect(buscarStatusCafeteria('   ')).rejects.toThrow('cafeteriaId inválido.');
  });
});
