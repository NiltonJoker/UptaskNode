const Usuarios = require("../models/Usuarios");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta en Uptask",
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar Sesión en Uptask",
    error
  });
};

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password
    })
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash('error', error.errors.map(err => err.message))
    res.render("crearCuenta",{
      mensajes: req.flash(),
      nombrePagina: "Crear Cuenta en Uptask",
      email,
      password
    })
  }
};

exports.formReestablecerPassword = (req,res) => {
  res.render("reestablecer",{
    nombrePagina: "Reestablecer tu contraseña"
  });
}