const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (req, res) => {
  try {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render("index", {
      nombrePagina: "Proyectos " + res.locals.year,
      proyectos,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
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
      proyectos,
    });
  } else {
    // No hay errores
    // Insertar en la BD
    // const usuarioId = res.locals.usuario.id;
    try {
      await Proyectos.create({ nombre, usuarioId });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
};

exports.proyectoPorUrl = async (req, res) => {
  try {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
      where: {
        url: req.params.url,
        usuarioId
      },
    });

    const [proyectos, proyecto] = await Promise.all([
      proyectosPromise,
      proyectoPromise,
    ]);

    if (!proyecto) {
      return next();
    }

    const tareas = await Tareas.findAll({
      where: { proyectoId: proyecto.id },
      // include: [{ model: Proyectos }],
    });

    res.render("tareas", {
      nombrePagina: "Tareas del Proyecto",
      proyecto,
      proyectos,
      tareas,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.formularioEditar = async (req, res) => {
  try {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
      where: {
        id: req.params.id,
        usuarioId
      },
    });

    const [proyectos, proyecto] = await Promise.all([
      proyectosPromise,
      proyectoPromise,
    ]);

    res.render("nuevoProyecto", {
      nombrePagina: "Editar Proyecto",
      proyectos,
      proyecto,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.actualizarProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
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
      proyectos,
    });
  } else {
    // No hay errores
    // Insertar en la BD
    try {
      await Proyectos.update(
        { nombre: nombre },
        { where: { id: req.params.id } }
      );
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  try {
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    res.status(200).send("Proyecto Eliminado Correctamente");
  } catch (error) {
    console.log(error);
    return next();
  }
};
