const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res) => {

  const {correo, password} = req.body;

  try {
    //verificar si email existe
    const usuario = await Usuario.findOne({correo});
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo'
      });
    }

    //verificar estado de usuario
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false'
      });
    }

    //verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    //generar el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    });
  }


}

module.exports = {
  login
}