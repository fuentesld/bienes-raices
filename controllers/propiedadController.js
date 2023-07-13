
const admin = (req, res) => { 
    res.render(
        'propiedades/admin',
        {
            pagina:'MisPropiedades',
            barra:true,
        }
    )
}

export {
    admin,
}