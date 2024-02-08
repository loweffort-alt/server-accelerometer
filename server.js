// Importa Express
import express from "express";
import cors from "cors";
import "dotenv/config";

// Crea una aplicación Express
const app = express();

// Define una ruta para tu proxy
app.use(cors());
app.use("/", async (req, res) => {
  try {
    // Realiza la solicitud a la URL deseada
    const response = await fetch(
      "https://servidor.ncn.pe/sensor/py/sismoIGP.json",
    );

    // Verifica si la solicitud fue exitosa
    if (response.ok) {
      // Convierte la respuesta a formato JSON
      const data = await response.json();

      // Envía los datos de vuelta al cliente
      res.json(data);
    } else {
      // Si la solicitud no fue exitosa, devuelve un error
      res
        .status(response.status)
        .json({ error: "No se pudo obtener los datos" });
    }
  } catch (error) {
    // Si hay un error en la solicitud, devuelve un error
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Inicia el servidor en el puerto 3000
app.listen(process.env.PORT, () => {
  console.log(`Servidor proxy escuchando en el puerto ${process.env.PORT}`);
});
