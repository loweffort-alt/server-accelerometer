import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch"; // Importa la función fetch
import { requestOptions, url } from "./fcm-api-v1/sendNotification.js";
const app = express();

app.use(cors());

//const URL = "https://accel-server-test.onrender.com/prueba.json";

// Función fetchData que obtiene los datos de la URL especificada
const fetchData = async () => {
  try {
    const response = await fetch(
      "https://accel-server-test.onrender.com/prueba.json",
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("No se pudo obtener los datos");
    }
  } catch (error) {
    throw new Error("Error al obtener los datos: " + error.message);
  }
};

// Middleware personalizado para actualizar los datos en la ruta '/proxy'
const updateProxyData = async (req, res, next) => {
  try {
    const data = await fetchData();
    res.setHeader("Cache-Control", "no-store");

    res.locals.proxyData = data; // Actualiza los datos en res.locals
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Middleware para la ruta '/proxy' que devuelve los datos almacenados en res.locals.proxyData
app.use("/proxy", updateProxyData, (req, res) => {
  res.json(res.locals.proxyData); // Envía los datos almacenados en res.locals.proxyData
});

const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor proxy escuchando en el puerto ${PORT}`);
});

const wea = [
  [
    {
      id: 239,
      NumeroReporte: 116,
      FechaLocal: "2024-02-19",
      HoraLocal: "11:23:17",
      Magnitud: 5.5,
      Referencia: "FAKE DATA",
      Latitud: -9.44,
      Longitud: -79.14,
      Profundidad: 35,
      Intensidad: "IV-V Chimbote",
      simulacro: 0,
      created_at: "2024-02-19T11:26:53.000-05:00",
      sound: false,
      TipoMagnitud: "",
      Mensaje: "",
      ReferenciaUnidad: "",
      Simulacro: "",
      Mapa: "",
      FechaLocalEnviaSSN: "",
      FechaRecepcion: "",
      UsuarioRegistra: "",
      createdAt: "",
      updatedAt: "",
    },
  ],
  [
    {
      id: 239,
      NumeroReporte: 116,
      FechaLocal: "2024-02-19",
      HoraLocal: "11:23:17",
      Magnitud: 5.5,
      Referencia: "FAKE DATA",
      Latitud: -9.44,
      Longitud: -79.14,
      Profundidad: 35,
      Intensidad: "IV-V Chimbote",
      simulacro: 0,
      created_at: "2024-02-19T11:26:53.000-05:00",
      sound: false,
      TipoMagnitud: "",
      Mensaje: "",
      ReferenciaUnidad: "",
      Simulacro: "",
      Mapa: "",
      FechaLocalEnviaSSN: "",
      FechaRecepcion: "",
      UsuarioRegistra: "",
      createdAt: "",
      updatedAt: "",
    },
  ],
];

// Llama a fetchData cada 10 segundos para mantener actualizados los datos
setInterval(async () => {
  try {
    const data = await fetchData();
    // Actualiza los datos en res.locals.proxyData
    wea.push(data);
    wea.shift();
    app.locals.proxyData = data;
    // Comparamos la hora local de cada consulta
    const HoraActual = wea[1][0].HoraLocal;
    const HoraPrevia = wea[0][0].HoraLocal;
    if (HoraActual !== HoraPrevia) {
      fetch(url, requestOptions)
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
  } catch (error) {
    // Q hacemos en caso caiga el server?
    console.error("Error, server caído", error);
  }
}, 60000 /*Por el momento hace la consulta cada 10 segundos */);
