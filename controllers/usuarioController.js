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

const formularioRegistroOlvidePassword = (req, res) => { 
    res.render(
        'auth/olvide-password', 
        {pagina: 'Recupera tu acceso a Bienes Raices'})
}
export {
    formularioLogin,
    formularioRegistro,
    formularioRegistroOlvidePassword,
}