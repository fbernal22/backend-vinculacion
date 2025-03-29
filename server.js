// Importar módulos necesarios
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { sql, poolPromise } = require('./db');


const PORT = process.env.PORT || 3001; // Usa el puerto definido en .env 

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


app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ API de Vinculación funcionando 🚀");
});


app.use(express.json());

app.post("/guardar-formulario", async (req, res) => {
  try {
    const pool = await poolPromise;
    const { fechadediligenciamiento, Contraparte, tipodecontraparte, Proceso, tipoPersona,
      nombreCompleto, tipoDocumento, numeroDocumento, fechaNacimiento, paisNacimiento,
      departamentoNacimiento, ciudadNacimiento, fechaExpedicion, paisExpedicion,
      departamentoExpedicion, ciudadExpedicion, razonSocial, tipodeidentificaciondesociedad,
      numeroNIT, nombreCompletorl, tipoDocumentorl, numeroDocumentoRepresentante,
      esPEP, nombreentidad, cargoPEP, fechadevinculacionalcargo, fechadedesvinculacioncargo,
      fideicomitentepat, EntidadFiduciaria, entidadpublica, valoradministrado,
      descripcionrelacioncomercial, fechaConstitucion, telefonoCelular, correoElectronico,
      direccionResidencia, paisResidencia, departamentoResidencia, ciudadResidencia,
      paisResidenciaaccionista, departamentoResidenciaaccionista, ciudadResidenciaaccionista,
      paisResidenciaaccionistapj, departamentoResidenciaaccionistapj, ciudadResidenciaaccionistapj,
      actividadEconomica, ingresosMensuales, recibeotrosingresos, Valorotrosingresos,
      descrpcionotrosingresos, egresosMensuales, activos, pasivos, patrimonioNeto, origenFondos,
      sujetoaretencion, resolucionautoretenedor, agenteretenedor, responsableiva,
      grancontribuyente, contribuyenterenta, agenteretenedorica, autoretenedor,
      conceptoautoretenedor, Tienerendiminetofinanciero, rendimientosfinancieros, comision,
      informacionbancaria, entidadfinancieradepagos, numerodecuenta, plazodepagos,
      productosfinancierosextranjeros, indicarcual, transaccionesenelextranjero, indiquecual1,
      responsabilidadfiscal, pais, nombredelpep, datoscomerciales, nombrerefcom, cargorefcom,
      telefonoCelularrefcom1, correoElectronicorefcom, datosfinancieros, nombrereffin,
      cargoreffin, telefonoCelularrefcom, correoElectronicoreffin, aceptaTerminos,
      autorizaConsultas, declaraVeracidad, declaracionpep } = req.body;

    await pool.request()
    .input('fechadediligenciamiento', req.body.fechadediligenciamiento)
    .input('Contraparte', req.body.Contraparte)
    .input('tipodecontraparte', req.body.tipodecontraparte)
    .input('Proceso', req.body.Proceso)
    .input('tipoPersona', req.body.tipoPersona)
    .input('nombreCompleto', req.body.nombreCompleto)
    .input('tipoDocumento', req.body.tipoDocumento)
    .input('numeroDocumento', req.body.numeroDocumento)
    .input('fechaNacimiento', req.body.fechaNacimiento)
    .input('paisNacimiento', req.body.paisNacimiento)
    .input('departamentoNacimiento', req.body.departamentoNacimiento)
    .input('ciudadNacimiento', req.body.ciudadNacimiento)
    .input('fechaExpedicion', req.body.fechaExpedicion)
    .input('paisExpedicion', req.body.paisExpedicion)
    .input('departamentoExpedicion', req.body.departamentoExpedicion)
    .input('ciudadExpedicion', req.body.ciudadExpedicion)
    .input('razonSocial', req.body.razonSocial)
    .input('tipodeidentificaciondesociedad', req.body.tipodeidentificaciondesociedad)
    .input('numeroNIT', req.body.numeroNIT)
    .input('nombreCompletorl', req.body.nombreCompletorl)
    .input('tipoDocumentorl', req.body.tipoDocumentorl)
    .input('numeroDocumentoRepresentante', req.body.numeroDocumentoRepresentante)
    .input('esPEP', req.body.esPEP)
    .input('nombreentidad', req.body.nombreentidad)
    .input('cargoPEP', req.body.cargoPEP)
    .input('fechadevinculacionalcargo', req.body.fechadevinculacionalcargo)
    .input('fechadedesvinculacioncargo', req.body.fechadedesvinculacioncargo)
    .input('fideicomitentepat', req.body.fideicomitentepat)
    .input('EntidadFiduciaria', req.body.EntidadFiduciaria)
    .input('entidadpublica', req.body.entidadpublica)
    .input('valoradministrado', req.body.valoradministrado)
    .input('descripcionrelacioncomercial', req.body.descripcionrelacioncomercial)
    .input('fechaConstitucion', req.body.fechaConstitucion)
    .input('telefonoCelular', req.body.telefonoCelular)
    .input('correoElectronico', req.body.correoElectronico)
    .input('direccionResidencia', req.body.direccionResidencia)
    .input('paisResidencia', req.body.paisResidencia)
    .input('departamentoResidencia', req.body.departamentoResidencia)
    .input('ciudadResidencia', req.body.ciudadResidencia)
    .input('paisResidenciaaccionista', req.body.paisResidenciaaccionista)
    .input('departamentoResidenciaaccionista', req.body.departamentoResidenciaaccionista)
    .input('ciudadResidenciaaccionista', req.body.ciudadResidenciaaccionista)
    .input('paisResidenciaaccionistapj', req.body.paisResidenciaaccionistapj)
    .input('departamentoResidenciaaccionistapj', req.body.departamentoResidenciaaccionistapj)
    .input('ciudadResidenciaaccionistapj', req.body.ciudadResidenciaaccionistapj)
    .input('actividadEconomica', req.body.actividadEconomica)
    .input('ingresosMensuales', req.body.ingresosMensuales)
    .input('recibeotrosingresos', req.body.recibeotrosingresos)
    .input('Valorotrosingresos', req.body.Valorotrosingresos)
    .input('descrpcionotrosingresos', req.body.descrpcionotrosingresos)
    .input('egresosMensuales', req.body.egresosMensuales)
    .input('activos', req.body.activos)
    .input('pasivos', req.body.pasivos)
    .input('patrimonioNeto', req.body.patrimonioNeto)
    .input('origenFondos', req.body.origenFondos)
    .input('sujetoaretencion', req.body.sujetoaretencion)
    .input('resolucionautoretenedor', req.body.resolucionautoretenedor)
    .input('agenteretenedor', req.body.agenteretenedor)
    .input('responsableiva', req.body.responsableiva)
    .input('grancontribuyente', req.body.grancontribuyente)
    .input('contribuyenterenta', req.body.contribuyenterenta)
    .input('agenteretenedorica', req.body.agenteretenedorica)
    .input('autoretenedor', req.body.autoretenedor)
    .input('conceptoautoretenedor', req.body.conceptoautoretenedor)
    .input('Tienerendiminetofinanciero', req.body.Tienerendiminetofinanciero)
    .input('rendimientosfinancieros', req.body.rendimientosfinancieros)
    .input('comision', req.body.comision)
    .input('informacionbancaria', req.body.informacionbancaria)
    .input('entidadfinancieradepagos', req.body.entidadfinancieradepagos)
    .input('numerodecuenta', req.body.numerodecuenta)
    .input('plazodepagos', req.body.plazodepagos)
    .input('productosfinancierosextranjeros', req.body.productosfinancierosextranjeros)
    .input('indicarcual', req.body.indicarcual)
    .input('transaccionesenelextranjero', req.body.transaccionesenelextranjero)
    .input('indiquecual1', req.body.indiquecual1)
    .input('responsabilidadfiscal', req.body.responsabilidadfiscal)
    .input('pais', req.body.pais)
    .input('nombredelpep', req.body.nombredelpep)
    .input('datoscomerciales', req.body.datoscomerciales)
    .input('nombrerefcom', req.body.nombrerefcom)
    .input('cargorefcom', req.body.cargorefcom)
    .input('telefonoCelularrefcom1', req.body.telefonoCelularrefcom1)
    .input('correoElectronicorefcom', req.body.correoElectronicorefcom)
    .input('datosfinancieros', req.body.datosfinancieros)
    .input('nombrereffin', req.body.nombrereffin)
    .input('cargoreffin', req.body.cargoreffin)
    .input('telefonoCelularrefcom', req.body.telefonoCelularrefcom)
    .input('correoElectronicoreffin', req.body.correoElectronicoreffin)
    .input('aceptaTerminos', req.body.aceptaTerminos)
    .input('autorizaConsultas', req.body.autorizaConsultas)
    .input('declaraVeracidad', req.body.declaraVeracidad)
    .input('declaracionpep', req.body.declaracionpep)
    .query(`INSERT INTO FormularioVinculacion ([fechadediligenciamiento], [Contraparte], [tipodecontraparte], [Proceso], [tipoPersona], [nombreCompleto],
    [tipoDocumento], [numeroDocumento], [fechaNacimiento], [paisNacimiento], [departamentoNacimiento], [ciudadNacimiento],
    [fechaExpedicion], [paisExpedicion], [departamentoExpedicion], [ciudadExpedicion], [razonSocial],
    [tipodeidentificaciondesociedad], [numeroNIT], [nombreCompletorl], [tipoDocumentorl], [numeroDocumentoRepresentante],
    [esPEP], [nombreentidad], [cargoPEP], [fechadevinculacionalcargo], [fechadedesvinculacioncargo],
    [fideicomitentepat], [EntidadFiduciaria], [entidadpublica], [valoradministrado], [descripcionrelacioncomercial],
    [fechaConstitucion], [telefonoCelular], [correoElectronico], [direccionResidencia], [paisResidencia],
    [departamentoResidencia], [ciudadResidencia], [paisResidenciaaccionista], [departamentoResidenciaaccionista],
    [ciudadResidenciaaccionista], [paisResidenciaaccionistapj], [departamentoResidenciaaccionistapj],
    [ciudadResidenciaaccionistapj], [actividadEconomica], [ingresosMensuales], [recibeotrosingresos],
    [Valorotrosingresos], [descrpcionotrosingresos], [egresosMensuales], [activos], [pasivos], [patrimonioNeto],
    [origenFondos], [sujetoaretencion], [resolucionautoretenedor], [agenteretenedor], [responsableiva],
    [grancontribuyente], [contribuyenterenta], [agenteretenedorica], [autoretenedor], [conceptoautoretenedor],
    [Tienerendiminetofinanciero], [rendimientosfinancieros], [comision], [informacionbancaria],
    [entidadfinancieradepagos], [numerodecuenta], [plazodepagos], [productosfinancierosextranjeros],
    [indicarcual], [transaccionesenelextranjero], [indiquecual1], [responsabilidadfiscal], [pais],
    [nombredelpep], [datoscomerciales], [nombrerefcom], [cargorefcom], [telefonoCelularrefcom1],
    [correoElectronicorefcom], [datosfinancieros], [nombrereffin], [cargoreffin], [telefonoCelularrefcom],
    [correoElectronicoreffin], [aceptaTerminos], [autorizaConsultas], [declaraVeracidad], [declaracionpep]) VALUES (@fechadediligenciamiento, @Contraparte, @tipodecontraparte, @Proceso, @tipoPersona, @nombreCompleto,
    @tipoDocumento, @numeroDocumento, @fechaNacimiento, @paisNacimiento, @departamentoNacimiento, @ciudadNacimiento,
    @fechaExpedicion, @paisExpedicion, @departamentoExpedicion, @ciudadExpedicion, @razonSocial,
    @tipodeidentificaciondesociedad, @numeroNIT, @nombreCompletorl, @tipoDocumentorl, @numeroDocumentoRepresentante,
    @esPEP, @nombreentidad, @cargoPEP, @fechadevinculacionalcargo, @fechadedesvinculacioncargo,
    @fideicomitentepat, @EntidadFiduciaria, @entidadpublica, @valoradministrado, @descripcionrelacioncomercial,
    @fechaConstitucion, @telefonoCelular, @correoElectronico, @direccionResidencia, @paisResidencia,
    @departamentoResidencia, @ciudadResidencia, @paisResidenciaaccionista, @departamentoResidenciaaccionista,
    @ciudadResidenciaaccionista, @paisResidenciaaccionistapj, @departamentoResidenciaaccionistapj,
    @ciudadResidenciaaccionistapj, @actividadEconomica, @ingresosMensuales, @recibeotrosingresos,
    @Valorotrosingresos, @descrpcionotrosingresos, @egresosMensuales, @activos, @pasivos, @patrimonioNeto,
    @origenFondos, @sujetoaretencion, @resolucionautoretenedor, @agenteretenedor, @responsableiva,
    @grancontribuyente, @contribuyenterenta, @agenteretenedorica, @autoretenedor, @conceptoautoretenedor,
    @Tienerendiminetofinanciero, @rendimientosfinancieros, @comision, @informacionbancaria,
    @entidadfinancieradepagos, @numerodecuenta, @plazodepagos, @productosfinancierosextranjeros,
    @indicarcual, @transaccionesenelextranjero, @indiquecual1, @responsabilidadfiscal, @pais,
    @nombredelpep, @datoscomerciales, @nombrerefcom, @cargorefcom, @telefonoCelularrefcom1,
    @correoElectronicorefcom, @datosfinancieros, @nombrereffin, @cargoreffin, @telefonoCelularrefcom,
    @correoElectronicoreffin, @aceptaTerminos, @autorizaConsultas, @declaraVeracidad, @declaracionpep)`);

    res.json({ success: true, message: "✅ Datos guardados correctamente en SQL Server" });
  } catch (error) {
    console.error("❌ Error al guardar en SQL Server:", error);
    res.status(500).json({ success: false, message: "❌ Error al guardar en la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

  