// Importar módulos necesarios
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const express = require('express');
const { sql, poolPromise } = require('./db');


const PORT = process.env.PORT || 5000; // Usa el puerto definido en .env o 5000 por defecto

// Crear la aplicación de Express
const app = express();  

// Configurar middlewares
app.use(bodyParser.json()); // Para manejar JSON en el cuerpo de la solicitud
app.use(cors({
  origin: "https://build-peh6axs6n-fbernal22s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Ruta para manejar el envío del formulario
app.post("/api/submit", (req, res) => {
  console.log("Datos recibidos:", req.body); // Imprime los datos en la consola
  res.status(200).send("Formulario recibido exitosamente.");
});

console.log("Correo usado:", process.env.EMAIL_USER);

// Configurar el transporte de correo con Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Configura en un archivo .env
    pass: process.env.EMAIL_PASS,  // Usa una contraseña segura
  },
});

// Ruta para enviar correos
app.post("/enviar-correo", async (req, res) => {
  const { destinatario, asunto, mensaje } = req.body;

  console.log("📧 Intentando enviar correo a:", destinatario); // Debug

  if (!destinatario || !asunto || !mensaje) {
      return res.status(400).json({ success: false, message: "Faltan datos para enviar el correo" });
  }

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      text: mensaje,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Correo enviado correctamente a ${destinatario}`);
      res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (error) {
      console.error("❌ Error enviando correo:", error);
      res.status(500).json({ success: false, message: "Error enviando correo" });
  }
});

  // Ruta de prueba para saber si el servidor está corriendo
  app.get("/", (req, res) => {
    res.send("✅ API de Vinculación funcionando 🚀");
  });

// Obtener todas las vinculaciones
app.get("/vinculaciones", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM FormularioVinculacion");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});


// Obtener una vinculación por ID
app.get("/vinculacion/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM vinculacion WHERE id = ?", [id], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al obtener datos" });
          return;
      }
      res.json(result[0] || {});
  });
});

// Insertar una nueva vinculación
app.post("/vinculacion", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO vinculacion SET ?", data, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al insertar datos" });
          return;
      }
      res.json({ id: result.insertId, ...data });
  });
});

// Actualizar una vinculación
app.put("/vinculacion/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  db.query("UPDATE vinculacion SET ? WHERE id = ?", [data, id], (err) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al actualizar datos" });
          return;
      }
      res.json({ message: "Vinculación actualizada" });
  });
});

// Eliminar una vinculación
app.delete("/vinculacion/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM vinculacion WHERE id = ?", [id], (err) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al eliminar datos" });
          return;
      }
      res.json({ message: "Vinculación eliminada" });
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ API de Vinculación funcionando 🚀");
});


app.use(express.json());

app.post("/guardar-formulario", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { Nombre, EmailContacto } = req.body;

    await pool.request()
      .input('Nombre', sql.NVarChar, Nombre)
      .input('EmailContacto', sql.NVarChar, EmailContacto)
      .query(`INSERT INTO FormularioVinculacion (Nombre, EmailContacto) VALUES (@Nombre, @EmailContacto)`);

    res.json({ success: true, message: "✅ Datos guardados correctamente en SQL Server" });
  } catch (error) {
    console.error("❌ Error al guardar en SQL Server:", error);
    res.status(500).json({ success: false, message: "❌ Error al guardar en la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

  