export const fetchData = async (req, res) => {
  try {
    const response = await fetch(
      "https://servidor.ncn.pe/sensor/py/sismoIGP.json",
    );

    if (response.ok) {
      const data = await response.json();

      res.json(data);
    } else {
      res
        .status(response.status)
        .json({ error: "No se pudo obtener los datos" });
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
