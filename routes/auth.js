/* 
    Rutas de Usuarios: /auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

/* Estructura de los endPoints:
1. router.post -> método que especifica el tipo de solicitud (GET, POST, etc.).
2. Ruta ->/new.
3. Middlewares -> check('name', 'El nombre es obligatorio.').not().isEmpty().
4. Función controladora de envío y retorno de datos -> crearUsuario.
*/

router.post(
    '/new',
    [// Middlewares.
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('password', 'La contraseña debe tener mínimo 6 caracteres.').isLength({ min: 6 }), validarCampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        check('email', "El email es obligatorio").isEmail(),
        check('password', "La contraseña debe tener mínimo 6 caracteres").isLength({ min: 6 }), validarCampos
    ],
    loginUsuario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;