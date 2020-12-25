const Proyectos = require("../models/Proyectos");

exports.proyectosHome = async (req, res) => {
  try {
    const proyectos = await Proyectos.findAll();

    res.render("index", {
      nombrePagina: "Proyectos",
      proyectos,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.formularioProyecto = (req, res) => {
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
  });
};

exports.nuevoProyecto = async (req, res) => {
  // Validar que tengamos algo en el input
  const { nombre } = req.body;
  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  // Si hay errores
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
    });
  } else {
    // No hay errores
    // Insertar en la BD
    try {
      const proyecto = await Proyectos.create({ nombre });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
};
