import("dotenv/config");

export const fetchData = async (req, res) => {
  try {
    const response = await fetch(process.env.PRODUCTION_URL);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      res
        .status(response.status)
        .json({ error: "No se pudo obtener los datos" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
