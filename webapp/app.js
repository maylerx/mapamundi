import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import router from './routes/router.js'

const app = express()

//seteamos el motor de plantillas
app.set('view engine', 'ejs')

//seteamos la carpeta public para archivos estáticos
app.use(express.static('public'))

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

// //seteamos las variables de entorno
// dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/', router)

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:;");
    next();
});

app.listen(3000, ()=>{
    console.log('SERVER UP running in http://localhost:3000')
})