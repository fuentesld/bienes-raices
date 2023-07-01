import express from 'express'
import {formularioLogin, formularioRegistro} from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)
    
    .post(
        (req, res) => {
            res.json({ msg: 'Respuesta tipo Post' })
        }
    )
router.route('/registro')
    .get(formularioRegistro)
    .post(
        (req, res) => {
            res.json({ msg: 'Respuesta /auth/registro' })
        }
    )


export default router