import {check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Usuario from '../Model/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => { 
    res.render(
        'auth/login', 
        {
            pagina:'Iniciar Sesión',
            csrfToken: req.csrfToken(),
        }
    )
}

const autenticar = async (req, res) => { 
    //  Validation
    await check('email').isEmail().withMessage('El email no es válido').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado = validationResult(req)
    if (!resultado.isEmpty()){
        return res.render(
            'auth/login', 
            {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
            }
        )
    }

    // Validate email
    const {email, password,} = req.body 
    const usuario = await Usuario.findOne({where: {email}})
    if (!usuario) {
        return res.render(
            'auth/login', 
            {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{msg:'El usuario NO existe'}],
            }
        )
    }

    // Validate user is confirmed
    if (!usuario.confirmado){
        return res.render(
            'auth/login', 
            {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{msg:'La cuenta NO ha sido confirmada'}],
            }
        )
    }

    // Validate password
    if (!usuario.verificarPassword(password)) {
        return res.render(
            'auth/login', 
            {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{msg:'El Password es incorrecto'}],
            }
        )
    }

    //  user Authenticate
    const token = generarJWT(usuario.id)

    // Store token in cookie
    return res.cookie(
        '_token', 
        token, 
        {
            httpOnly:true,
            // secure: true,
            // sameSite: true
        }
    ).redirect('/mis-propiedades')

}

const formularioRegistro = (req, res) => { 
    res.render(
        'auth/registro', 
        {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
        })
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
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
                usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email,
                },
                
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
                csrfToken: req.csrfToken(),
                errores: [{msg:'El usuario ya está registrado'}],
                usuario: {
                    nombre,
                    email,
                },
            }
        )
    }

    // store user in DB
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
    })

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email, 
        token: usuario.token,
    })

    // Show confirm message
    res.render('templates/mensaje', 
    {
        pagina: 'Cuenta creada correctamente',
        mensaje:'Hemos enviado un Email de Confirmacion al correo registrado, presiona en el enlace para activar tu cuenta'
    })

}

const confirmar = async (req, res) => { 
    const {token} = req.params
    // Verify if token is valid
    const usuario = await Usuario.findOne({where: {token}})

    if (!usuario){
        return res.render(
                'auth/confirmar-cuenta',
                {
                    pagina: 'Error al confirmar la cuenta',
                    mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
                    error: true,
                }
            )
    }

    // confirm account
    usuario.token = null,
    usuario.confirmado = true
    await usuario.save()
    res.render(
        'auth/confirmar-cuenta',
        {
            pagina: 'Cuenta Confirmada',
            mensaje: 'La cuenta se confirmó correctamente',
            error: false,
        }
    )
}

const formularioOlvidePassword = (req, res) => { 
    res.render(
        'auth/olvide-password', 
        {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
        })
}

const resetPassword = async (req,res) => { 

    // Validation
    await check('email').isEmail().withMessage('El email no es válido').run(req)
    let resultado = validationResult(req)
    if (!resultado.isEmpty()){
        console.log(resultado.array())
        return res.render(
            'auth/olvide-password', 
            {
                pagina: 'Recupera tu acceso a Bienes Raices',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),                
            }
        )
    }

    // Check if email exist
    const {email} = req.body 
    const usuario = await Usuario.findOne({where: {email}})
    if (!usuario) {
        return res.render(
            'auth/olvide-password', 
            {
                pagina: 'Recupera tu acceso a Bienes Raices',
                csrfToken: req.csrfToken(),
                errores: [{msg:'El email no está registrado'}],
            }
        )
    }

    // Generate Token
    usuario.token = generarId()
    await usuario.save()

    // Send verification email
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Show confirm message
    res.render('templates/mensaje', 
    {
        pagina: 'Reestablece tu Password',
        mensaje:'Hemos enviado un Email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => { 
    const {token} = req.params

    // Verify if token is valid
    const usuario = await Usuario.findOne({where: {token}})

    if (!usuario){
        return res.render(
                'auth/confirmar-cuenta',
                {
                    pagina: 'Restablece Tu password',
                    mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
                    error: true,
                }
            )
    }

    // Send form for change password 
    res.render(
        'auth/reset-password', 
        {
            pagina: 'Restablece Tu Password',
            csrfToken: req.csrfToken(),
        })
}

const nuevoPassword = async (req, res) => { 
    await check('password').isLength({min:6}).withMessage('El password debe ser de al menos 6 caractéres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)
            
    let resultado = validationResult(req)
    if (!resultado.isEmpty()){
        console.log(resultado.array())
        return res.render(
            'auth/reset-password', 
            {
                pagina: 'Restablece Tu Password',
                csrfToken: req.csrfToken(),
                errores: resultado.array(),
            }
        )
    }

    const {token} = req.params
    const {password} = req.body

    // Verify if token is valid
    const usuario = await Usuario.findOne({where: {token}})

    //update user password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    await usuario.save()

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Restablecido',
        mensaje: 'El password se guado correctamente'
    })

}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
}