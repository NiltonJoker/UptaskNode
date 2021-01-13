const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
// const expressValidator = require("express-validator");
const helpers = require("./helpers");
const flash = require("connect-flash")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const passport = require("./config/passport");

// Crear la conexion a la BD
const db = require("./config/db");
// Importar el modelo
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");
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

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(expressValidator());

// Añadir carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// Pasar vardump a la aplicación
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = {...req.user} || null;
  next();
});

app.use("/", routes());

app.listen(3000);
