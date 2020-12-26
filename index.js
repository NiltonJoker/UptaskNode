const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");

const helpers = require("./helpers");

// Crear la conexion a la BD
const db = require("./config/db");
// Importar el modelo
require("./models/Proyectos");
require("./models/Tareas")
db.sync()
  .then(() => {
    console.log("conectado al servidor");
  })
  .catch((error) => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static("public"));

// Habilitar pug
app.set("view engine", "pug");
// Añadir carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

// Pasar vardump a la aplicación
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  res.locals.vardump = helpers.vardump;
  next();
});

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes());

app.listen(3000);
