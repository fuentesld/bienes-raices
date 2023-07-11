import express from 'express'
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)

router.route('/registro')
    .get(formularioRegistro)
    .post(registrar)

router.route('/confirmar/:token')
    .get(confirmar)

router.route('/olvide-password')
    .get(formularioOlvidePassword)
    .post(resetPassword)

router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword)





// const router = express.Router();

// router.get('/login', formularioLogin);
// // router.post('/login', autenticar);

// // Cerrar sesión
// // router.post('/cerrar-sesion', cerrarSesion)

// router.get('/registro', formularioRegistro)
// router.post('/registro', registrar)

// router.get('/confirmar/:token', confirmar)

// router.get('/olvide-password', formularioOlvidePassword)
// router.post('/olvide-password', resetPassword)

// Almacena el nuevo password
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);

export default router