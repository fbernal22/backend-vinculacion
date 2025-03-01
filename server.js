// Importar módulos necesarios
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx");
const fs = require("fs");

const PORT = process.env.PORT || 5000; // Usa el puerto definido en .env o 5000 por defecto

// Crear la aplicación de Express
const app = express();  

// Configurar middlewares
app.use(bodyParser.json()); // Para manejar JSON en el cuerpo de la solicitud
app.use(cors({
  origin: "*",
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
app.get("/vinculaciones", (req, res) => {
  db.query("SELECT * FROM vinculacion", (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al obtener datos" });
          return;
      }
      res.json(results);
  });
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

app.use(express.json());
app.use(cors());

app.post("/guardar-excel", (req, res) => {
  const datosFormulario = req.body;
  const filePath = __dirname + "/datos_vinculacion.xlsx";
  let workbook, worksheet;

  console.log("📥 Recibiendo datos para guardar en Excel:", datosFormulario);

  try {
      if (fs.existsSync(filePath)) {
          console.log("📂 Archivo Excel encontrado. Agregando datos...");
          workbook = xlsx.readFile(filePath);

          // 📌 Usar la hoja "Vinculaciones" si ya existe
          if (workbook.SheetNames.includes("Vinculaciones")) {
              worksheet = workbook.Sheets["Vinculaciones"];
              const datosExistentes = xlsx.utils.sheet_to_json(worksheet);
              datosExistentes.push(datosFormulario);
              worksheet = xlsx.utils.json_to_sheet(datosExistentes);
              workbook.Sheets["Vinculaciones"] = worksheet; // 📌 Actualizar la hoja existente
          } else {
              console.log("⚠️ La hoja no existe, creando una nueva...");
              worksheet = xlsx.utils.json_to_sheet([datosFormulario]);
              xlsx.utils.book_append_sheet(workbook, worksheet, "Vinculaciones");
          }
      } else {
          console.log("📂 No se encontró el archivo Excel. Creando uno nuevo...");
          workbook = xlsx.utils.book_new();
          worksheet = xlsx.utils.json_to_sheet([datosFormulario]);
          xlsx.utils.book_append_sheet(workbook, worksheet, "Vinculaciones");
      }

      // 📌 Guardar los cambios en el archivo Excel
      xlsx.writeFile(workbook, filePath);

      console.log("✅ Datos guardados en Excel correctamente.");
      res.json({ mensaje: "✅ Datos guardados en Excel correctamente" });
  } catch (error) {
      console.error("❌ Error guardando en Excel:", error);
      res.status(500).json({ mensaje: "Error guardando en Excel" });
  }
});
  
app.get("/descargar-excel", (req, res) => {
  const filePath = __dirname + "/datos_vinculacion.xlsx"; // Ruta absoluta

  if (fs.existsSync(filePath)) {
      console.log("📂 Archivo encontrado, iniciando descarga...");
      res.download(filePath);
  } else {
      console.log("❌ Archivo no encontrado.");
      res.status(404).json({ mensaje: "❌ No se encontró el archivo Excel" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ API de Vinculación funcionando 🚀");
});


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
