import express from 'express'
import {formularioLogin, formularioRegistro, formularioRegistroOlvidePassword,} from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)

router.route('/registro')
    .get(formularioRegistro)

router.route('/olvide-password')
    .get(formularioRegistroOlvidePassword)



export default router