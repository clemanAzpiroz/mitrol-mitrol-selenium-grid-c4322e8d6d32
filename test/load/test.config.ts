/*
url: process.env.URL
    ? process.env.URL
    : Ambiente en el que se desea realizar la prueba
frecuenciaFija: Frecuencia en la que se realiza la comprobación de inicio de sesión y cambio de estado en ms. Setear undefined si se desea utilizar la frecuenciaVariable.
duracion: Duración total del test en ms
workers: Usar la flag -w para indicar la cantidad de agentes que se desea simular.
frecuenciaVariable: Permite espaciar de forma variable la comprobación de inicio de sesión y cambio de estado.

Para utilizar la frecuencia variable se debe setear frecuenciaFija: undefined

*/

export const testConfig = {
  url: process.env.URL
    ? process.env.URL
    : "https://webpad-stress.mitrol.net/webpad/",
  frecuenciaFija: 45 * 1000,
  duracion: 5 * 60 * 1000,
  workers: parseInt(process.env.MAX || "1"),
};

export const frecuenciaVariable = (i: number) => 30 * (1000 + i);
