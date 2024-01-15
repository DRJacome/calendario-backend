/* 
    Event Routes
    /api/eventos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/eventos');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas las peticiones tienen que estar validadas por el validador del JWT.
router.use(validarJWT);
// Obtener eventos.
router.get('/', getEventos);

// Crear un nuevo evento.
router.post('/', [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de finalización es obligatoria').custom(isDate),
    validarCampos
], crearEvento);

// Actualizar evento.
router.put('/:id', actualizarEvento);

// Borrar evento.
router.delete('/:id', eliminarEvento);

module.exports = router;