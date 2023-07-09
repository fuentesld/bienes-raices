import express from 'express'
import usuarioRoutes from './routes/usuarioRoute.js'
import db from './config/db.js'

// DB conection
try {
    await db.authenticate()
    db.sync()
    console.log(`Conexión correcta a DB ${process.env.DB_NAME}`);
} catch (error) {
    console.log(error);
}

const app = express()

// Habilitar lectura de formularios
app.use(express.urlencoded({extended:true}))


// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta publica
app.use(express.static('public'))

// Routing
app.use('/auth', usuarioRoutes)

const PORT = process.env.BACKEND_PORT || 3000
app.listen(
    PORT, 
    () => {
        console.log(`El servidor esta corriendo en URL ${process.env.BACKEND_URL}:${PORT}`)
    }
)
