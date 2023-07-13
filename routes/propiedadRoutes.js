import express from 'express'
import { admin, } from '../controllers/propiedadController.js'

const router = express.Router()

router.route('/mis-propiedades')
    .get(admin)
    .post(admin)


export default router