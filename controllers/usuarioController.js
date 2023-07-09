import {check, validationResult } from 'express-validator'

import Usuario from '../Model/Usuario.js'
import { generarId } from '../helpers/tokens.js'

const formularioLogin = (req, res) => { 
    res.render(
        'auth/login', 
        {pagina:'Iniciar Sesión'}
        )
}

const formularioRegistro = (req, res) => { 
    res.render(
        'auth/registro', 
        {pagina: 'Crear Cuenta'})
    }
    
    const registrar = async (req, res) => { 
        // Validation
        await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req)
        await check('email').isEmail().withMessage('El email no es válido').run(req)
        await check('password').isLength({min:6}).withMessage('El password debe ser de al menos 6 caractéres').run(req)
        await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)
                
        let resultado = validationResult(req)
        if (!resultado.isEmpty()){
            console.log(resultado.array())
            return res.render(
                'auth/registro', 
                {
                    pagina: 'Crear Cuenta',
                    errores: resultado.array(),
                    usuario: {
                        nombre: req.body.nombre,
                        email: req.body.email,
                    }
                }
            )
        }

        // Check if email exist in DB
        const {nombre, email, password,} = req.body 
        const existeUsuario = await Usuario.findOne({where: {email}})
        if (existeUsuario) {
            return res.render(
                'auth/registro', 
                {
                    pagina: 'Crear Cuenta',
                    errores: [{msg:'El usuario ya está registrado'}],
                    usuario: {
                        nombre,
                        email,
                    }
                }
            )
        }

        // store user in DB
        console.log(generarId());
        await Usuario.create({
            nombre,
            email,
            password,
            token: generarId(),
        })

 }

const formularioRegistroOlvidePassword = (req, res) => { 
    res.render(
        'auth/olvide-password', 
        {pagina: 'Recupera tu acceso a Bienes Raices'})
}
export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioRegistroOlvidePassword,
}