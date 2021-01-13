const passport = require('passport');
const Usuarios = require("../models/Usuarios")
const { Op } = require("sequelize");

const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs")

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios"
});

// funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  return res.redirect("/iniciar-sesion");
}

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  })
}
// Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
  // Verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({where: { email }})

  // Si no existe
  if(!usuario){
    req.flash('error', "No existe esa cuenta");
    res.redirect("/reestablecer")
  }

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

}

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({where: {
    token: req.params.token
  }})

  if(!usuario){
    req.flash('error', "No Válido")
    res.redirect("/reestablecer")
  }

  res.render("resetPassword",{
    nombrePagina: "Reestablecer Contraseña"
  })
}

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({where: {
    token: req.params.token,
    expiracion: {
      [Op.gte] : Date.now()
    }
  }})

  if(!usuario){
    req.flash("error", "No Válido");
    res.redirect("/reestablecer");
  }

  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  await usuario.save();
  req.flash("correcto", "Tu password se ha modificado correctamente")
  res.redirect("/iniciar-sesion")
}
