// Importar las dependencias necesarias
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

// Crear la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos en formato JSON
app.use(bodyParser.json());

// Ruta para manejar los datos enviados por Elementor
app.post("/webhook", async (req, res) => {
  const email = req.body.fields?.Email; // Capturar el email del formulario
  if (!email) {
    return res.status(400).send("Falta el campo de email.");
  }

  const brevoData = {
    email: email,
    listIds: [123], // Cambiar por el ID de tu lista en Brevo
    updateEnabled: true,
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/contacts",
      brevoData,
      {
        headers: {
          Authorization: `Bearer ${process.env.BREVO_API_KEY}`, // Usar la clave API desde variables de entorno
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Contacto agregado:", response.data);
    res.status(200).send("Contacto agregado correctamente.");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).send("Error al agregar el contacto.");
  }
});

// Ruta principal para pruebas
app.get("/", (req, res) => {
  res.send("Servidor intermedio funcionando.");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
