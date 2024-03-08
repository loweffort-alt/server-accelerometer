import "dotenv/config";
import { JWT } from "google-auth-library";
import { key } from "../credentials/accelerometer-c758f-21785a7fbcc6.js";
import { app } from "../firebaseconfig/realtimeData/index.js";
import { getDatabase, ref, child, get } from "firebase/database";
//import fetch from "node-fetch"; // Importa la función fetch

const databaseRef = ref(getDatabase(app));
async function fetchDataFromFirebase() {
  const snapshot = await get(child(databaseRef, "infoDevice"));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const filteredData = Object.values(rawData).map((el) => el.tokenFCM);
    return filteredData[0];
  } else {
    throw new Error("No data available");
  }
}

const tokenFCM = await fetchDataFromFirebase();
console.log(tokenFCM);

//const GOOGLE_APPLICATION_CREDENTIALS = process.env.TOKEN;

async function getAccessToken() {
  try {
    return new Promise(function (resolve, reject) {
      const jwtClient = new JWT(
        key.client_email,
        null,
        key.private_key,
        `https://www.googleapis.com/auth/firebase.messaging`,
      );

      jwtClient.authorize(function (err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  } catch (error) {
    console.error("Error al cargar la configuración:", error);
    throw error; // O manejar el error como prefieras
  }
}

const eww = await getAccessToken();

//Número del proyecto
const idProject = "219815381267";

//API V1 URL
export const url = `https://fcm.googleapis.com/v1/projects/${idProject}/messages:send`;
const authorization = `Bearer ${eww}`;

export const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", authorization);

export const body = {
  message: {
    token: tokenFCM,
    //notification: {
    //title: "Nuevo sismo registrado",
    //body: "La base de datos del IGP ah sido actualizada",
    //},
    data: {
      hurry: "New Sismo",
      description: "Iniciar Envio de datos",
    },
    android: {
      direct_boot_ok: true,
    },
  },
};

export const requestOptions = {
  method: "POST",
  headers: headers,
  body: JSON.stringify(body),
};

//fetch(url, requestOptions)
//.then((response) => {
//// Verificar si la respuesta es exitosa (código de estado en el rango 200-299)
//if (!response.ok) {
//throw new Error("Error en la solicitud: " + response.status);
//}
//// Convertir la respuesta a JSON
//return response.json();
//})
//.then((data) => {
//// Manejar los datos de la respuesta
//console.log("Respuesta:", data);
//})
//.catch((error) => {
//// Manejar cualquier error que ocurra durante la solicitud
//console.error("Error:", error);
//});
