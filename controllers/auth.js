const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express');

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

const googleSignIn = async(req, res) => {
  const {id_token} = req.body;

  try {

    const {nombre, correo, img} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({correo});

    if (!usuario) {
      //crearlo
      const data = {
        nombre,
        correo,
        password: ':p',
        img,
        google: true
      }

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
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
    res.status(400).json({
      msg: 'El token no se pudo verificar'
    })
  }

}

module.exports = {
  login,
  googleSignIn
}