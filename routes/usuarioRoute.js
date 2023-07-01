import express from 'express'
import {formularioLogin} from '../controllers/usuarioController.js'

const router = express.Router()

router.route('/login')
    .get(formularioLogin)
    .post(
        (req, res) => {
            res.json({ msg: 'Respuesta tipo Post' })
        }
    )


export default router