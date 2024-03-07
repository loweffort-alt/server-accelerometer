import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch"; // Importa la función fetch
const app = express();

app.use(cors());

// Función fetchData que obtiene los datos de la URL especificada
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8080/prueba.json");
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

// Inicia el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor proxy escuchando en el puerto ${process.env.PORT}`);
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

// Llama a fetchData cada 30 segundos para mantener actualizados los datos
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
      console.log("Hay nuevo cambio, ENVIA NOTIFICACIÓN");
    } else {
      console.log("no cambia, no hagas nada");
    }
  } catch (error) {
    // Q hacemos en caso caiga el server?
    console.error("Error, server caído", error);
  }
}, 10000 /*Por el momento hace la consulta cada 10 segundos */);
