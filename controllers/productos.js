const {Producto} = require('../models');

//obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res) => {

  const {limite = 5, desde = 0} = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({estado: true}),
    Producto.find({estado: true})
      .populate([{path:'usuario', select: 'nombre'}, {path:'categoria', select: 'nombre'}])
      .skip(desde)
      .limit(limite)
  ]);

  res.json({
    total,
    productos
  });
}

//obtenerProducto - populate
const obtenerProducto = async(req, res) => {
  const {id} = req.params;
  const producto = await Producto.findById(id)
    .populate([{path:'usuario', select: 'nombre'}, {path:'categoria', select: 'nombre'}]);

  res.json(producto);
}

const crearProducto = async(req, res) => {

  const {estado, usuario, ...body} = req.body;

  const nombre = body.nombre.toUpperCase();

  const productoDB = await Producto.findOne({nombre});

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${nombreMayus}, ya existe`
    });
  }

  //Generar datos a guardar
  const data = {
    ...body,
    nombre,
    usuario: req.usuario._id
  }

  const producto = new Producto(data);

  //Guardar DB
  await producto.save();

  res.status(201).json(producto);

}

//actualizarProducto
const actualizarProducto = async(req, res) => {
  const {id} = req.params;
  const {estado, usuario, ...data} = req.body

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

  res.json(producto);
}

//borrarProducto
const borrarProducto = async(req, res) => {

  const {id} = req.params;

  const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {returnOriginal: false});

  res.json(producto);
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
}