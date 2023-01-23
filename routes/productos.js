const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {existeCategoriaPorId, existeProductoPorId} = require('../helpers/db-validators')


const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerProductos);

//Obtener una categoria - publico
router.get('/:id', [
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], obtenerProducto);

//Crear una categoria - persona con token
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('categoria', 'No es un id de Mongo').notEmpty(),
  check('categoria').custom(existeCategoriaPorId),
  validarCampos
], crearProducto);

//Actualizar una categoria - persona con token
router.put('/:id', [
  validarJWT,
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], actualizarProducto);

//Borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], borrarProducto);

module.exports = router;