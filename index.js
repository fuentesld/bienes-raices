import express from 'express'
import usuarioRoutes from './routes/usuarioRoute.js'

const app = express()
const port = 3000

// Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta publica
app.use(express.static('public'))

// Routing
app.use('/auth', usuarioRoutes)

app.listen(
    port, 
    () => {
        console.log(`El servidor esta corriendo en el puerto ${port}`)
    }
)
