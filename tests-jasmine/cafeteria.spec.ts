import { buscarStatusCafeteria } from '../src/servico/cafeteria';

describe('serviço de cafeteria', () => {
  it('@paridade:CAFETERIA-STATUS @spec:AC-010 retorna preço e disponibilidade após 200 ms', async () => {
    const temporizador = spyOn(global, 'setTimeout');
    spyOn(Math, 'random').and.returnValues(0.5, 0.75);

    const consulta = buscarStatusCafeteria('central');

    expect(temporizador).toHaveBeenCalledWith(jasmine.any(Function), 200);
    const callback = temporizador.calls.mostRecent().args[0];
    callback();

    await expectAsync(consulta).toBeResolvedTo({
      cafeteriaId: 'central',
      precoCafe: 7.5,
      disponivel: true
    });
  });

  it('@paridade:CAFETERIA-ID-INVALIDO @spec:AC-011 rejeita identificadores vazios', async () => {
    await expectAsync(buscarStatusCafeteria('   ')).toBeRejectedWithError(
      'cafeteriaId inválido.'
    );
  });
});
