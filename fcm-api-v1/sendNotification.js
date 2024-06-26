import "dotenv/config";
import { JWT } from "google-auth-library";
import {
  firebaseApp,
  firebaseConfig,
} from "../firebaseconfig/realtimeData/index.js";
import { getDatabase, ref, child, get } from "firebase/database";
import { key } from "../credentials/accelerometerKey.js";

const databaseRef = ref(getDatabase(firebaseApp));

//Cada dispositivo manda su token de FCM a Firebase RealtimeDatabase
async function fetchDataFromFirebase() {
  const snapshot = await get(child(databaseRef, "infoDevice"));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const filteredData = Object.values(rawData).map((el) => el.tokenFCM);
    console.log(filteredData[1]);
    return filteredData[1];
  } else {
    throw new Error("No data available");
  }
}

const tokenFCM = await fetchDataFromFirebase();

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

//API V1 URL
export const urlFCMGoogleAPI = `https://fcm.googleapis.com/v1/projects/${firebaseConfig.messagingSenderId}/messages:send`;
const authorization = `Bearer ${eww}`;

export function sendHeadersAndBody(epochTimeNewData) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", authorization);

  const body = {
    message: {
      token: tokenFCM,
      //notification: {
      //title: "Nuevo sismo registrado",
      //body: "La base de datos del IGP ah sido actualizada",
      //},
      data: {
        hurry: "New Sismo",
        description: "Iniciar Envio de datos",
        seismTime: epochTimeNewData,
      },
      android: {
        direct_boot_ok: true,
      },
    },
  };
  console.log(body);

  return {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };
}

//export const requestOptions = {
//method: "POST",
//headers: headers,
//body: JSON.stringify(body),
//};
