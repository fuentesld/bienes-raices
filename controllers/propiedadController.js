
const admin = (req, res) => { 
    res.render(
        'propiedades/admin',
        {
            pagina:'MisPropiedades'
        }
    )
}

export {
    admin,
}