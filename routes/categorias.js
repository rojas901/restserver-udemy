const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {existeCategoriaPorId} = require('../helpers/db-validators')


const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria - publico
router.get('/:id', [
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], obtenerCategoria);

//Crear una categoria - persona con token
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  validarCampos
], crearCategoria);

//Actualizar una categoria - persona con token
router.put('/:id', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo Válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], borrarCategoria);

module.exports = router;