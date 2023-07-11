import express from 'express'
import { formularioLogin, formularioRegistro, formularioRegistroOlvidePassword, registrar, confirmar,  } from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)

router.route('/registro')
    .get(formularioRegistro)
    .post(registrar)

router.route('/confirmar/:token')
    .get(confirmar)

router.route('/olvide-password')
    .get(formularioRegistroOlvidePassword)



export default router