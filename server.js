import express from "express";
import cors from "cors";
import "dotenv/config";
import { fetchData } from "./fetch.js";

const app = express();

app.use(cors());
app.use("/proxy", fetchData);

app.listen(process.env.PORT, () => {
  console.log(`Servidor proxy escuchando en el puerto ${process.env.PORT}`);
});
