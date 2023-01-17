const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req, res) => {

  const {limite = 5, desde = 0} = req.query;

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({estado: true}),
    Usuario.find({estado: true})
      .skip(desde)
      .limit(limite)
  ]);

  res.json({
    total,
    usuarios
  });
}

const usuariosPost = async (req, res) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();

  res.status(201).json({
    usuario
  });
}

const usuariosPut = async(req, res) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  
  //validar con base de datos
  if (password) {
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }
  
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { returnOriginal: false });

  res.json(usuario);
}

const usuariosPatch = (req, res) => {
  res.json({
    msg: 'patch API - controlador'
  });
}

const usuariosDelete = async(req, res) => {

  const {id} = req.params;

  //Borrado fisico
  //const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {returnOriginal: false});

  res.json(usuario);
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}