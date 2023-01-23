const {Categoria} = require('../models');

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res) => {

  const {limite = 5, desde = 0} = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({estado: true}),
    Categoria.find({estado: true})
      .populate('usuario', 'nombre')
      .skip(desde)
      .limit(limite)
  ]);

  res.json({
    total,
    categorias
  });
}

//obtenerCategoria - populate
const obtenerCategoria = async(req, res) => {
  const {id} = req.params;
  const categoria = await Categoria.findById(id)
    .populate('usuario', 'nombre');

  res.json(categoria);
}

const crearCategoria = async(req, res) => {

  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({nombre});

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${nombre}, ya esxite`
    });
  }

  //Generar datos a guardar
  const data = {
    nombre,
    usuario: req.usuario._id
  }

  const categoria = new Categoria(data);

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);

}

//actualizarCategoria
const actualizarCategoria = async(req, res) => {
  const {id} = req.params;
  const {estado, usuario, ...data} = req.body

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

  res.json(categoria);
}

//borrarCategoria
const borrarCategoria = async(req, res) => {

  const {id} = req.params;

  const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {returnOriginal: false});

  res.json(categoria);
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria
}