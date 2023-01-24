const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');
const path = require('path');
const fs = require('fs');

const cargarArchivo = async (req, res) => {

  try {

    //const nombre = await subirArchivo(req.files, ['pdf'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, 'imgs');

    res.json({
      nombre
    });
  } catch (error) {
    res.status(400).json({ error });
  }

}

const actualizarImagen = async (req, res) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  //Limpiar imagenes previas
  if (modelo.img) {
    //hay que borrar imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async(req, res) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  //Limpiar imagenes previas
  if (modelo.img) {
    //hay que borrar imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }
  }

  res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen
}