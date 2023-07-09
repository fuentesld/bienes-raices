import express from 'express'
import { formularioLogin, formularioRegistro, formularioRegistroOlvidePassword, registrar, } from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)

router.route('/registro')
    .get(formularioRegistro)
    .post(registrar)

router.route('/olvide-password')
    .get(formularioRegistroOlvidePassword)



export default router