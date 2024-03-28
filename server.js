import express from "express";
import cors from "cors";
import "dotenv/config";
import { fetchData } from "./fetch.js";
import { reloadServer } from "./setInterval.js";
const app = express();

app.use(cors());

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

reloadServer({ app });
