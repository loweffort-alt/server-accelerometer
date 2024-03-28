import fetch from "node-fetch"; // Importa la función fetch
import {
  requestOptions,
  urlFCMGoogleAPI,
} from "./fcm-api-v1/sendNotification.js";
import { initialData } from "./initialData.js";
import { fetchData } from "./fetch.js";

function convertEpoch(data) {
  const completeStringTime = `${data.FechaLocal}T${data.HoraLocal}`;
  const completeTime = new Date(completeStringTime);
  const epochTime = completeTime.getTime() / 1000;

  const peruTimezone = 5 * 60 * 60 * 1000;
  epochTime -= peruTimezone;

  return epochTime;
}

//Siempre habrá 2 elementos en dataUpdated, el elemento 1 es comparado con el 0 y si hay cambio entonces varía el JSON
function compareData(dataUpdated) {
  const currentData = dataUpdated[0][0];
  const newData = dataUpdated[1][0];

  if (currentData.id !== newData.id) {
    fetch(urlFCMGoogleAPI, requestOptions)
      .then((response) => {
        // Verificar si la respuesta es exitosa (código de estado en el rango 200-299)
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.status);
        }
        // Convertir la respuesta a JSON
        return response.json();
      })
      .then((data) => {
        // Manejar los datos de la respuesta
        console.log("Respuesta:", data);
      })
      .catch((error) => {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error("Error:", error);
      });
  } else {
    console.log("no cambia, no hagas nada");
  }
}

// Llama a fetchData cada 30 min para mantener actualizados los datos
export const reloadServer = ({ app }) => {
  setInterval(async () => {
    try {
      const data = await fetchData();
      // Actualiza los datos en res.locals.proxyData
      initialData.push(data);
      initialData.shift();
      app.locals.proxyData = data;

      // Comparamos la hora local de cada consulta
      compareData(initialData);
    } catch (error) {
      // Q hacemos en caso caiga el server?
      console.error("Error, server caído", error);
    }
  }, 1800000 /*Por el momento hace la consulta cada 30 min */);
};
