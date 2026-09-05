import app from './servidor';

const portaAmbiente = Number(process.env.PORT);
const porta =
  Number.isInteger(portaAmbiente) && portaAmbiente > 0 ? portaAmbiente : 3000;

app.listen(porta, () => {
  console.log(`Cafeína Tracker API ouvindo na porta ${porta}.`);
});
