const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const { renderizarRespuestaSweetAlert } = require('../controllers/utils')

// Funcion de registro de usuarios (Todos con rol usuario)
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        if (!name || !email || !user || !pass) {
            renderizarRespuestaSweetAlert(res, 'pages/register', "Advertencia", "Ingrese su nombre completo, email, nombre de usuario y contraseña", 'info', true, false, 'register')
        } else {
            conexion.query('INSERT INTO users SET ?', { name: name, email: email, user: user, pass: passHash }, async (error, results) => {
                if (error) {
                    if (error.message.includes("Duplicate entry")) {
                        mensaje = "El nombre de usuario o email ya está en uso";
                    } else {
                        mensaje = "Ha ocurrido un error inesperado: " + error.message + " ";
                    }
                    renderizarRespuestaSweetAlert(res, 'pages/register', "Advertencia", mensaje, 'info', true, false, 'register')
                } else {
                    renderizarRespuestaSweetAlert(res, 'pages/register', "Registro exitoso", "Te has registrado correctamente. ¡Inicia sesión!", 'success', false, 800, '')
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}

// Funcion de login de usuarios
exports.login = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        if (!user || !pass) {
            renderizarRespuestaSweetAlert(res, 'pages/login', "Advertencia", "Ingrese su nombre de usuario y contraseña", 'info', true, false, 'login')
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                // Validacion de usuario con credenciales incorrectas
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    renderizarRespuestaSweetAlert(res, 'pages/login', "Error", "Usuario y/o Password incorrectas", 'error', true, false, 'login')
                } else {
                    // Inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    // Definicion de opciones de la cookie como fecha de expiracion y httpOnly
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    renderizarRespuestaSweetAlert(res, 'pages/login', "Conexión exitosa", "¡LOGIN CORRECTO!", 'success', false, 800, '')
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log("ERROR: " + error + " en la autenticacion")
            res.redirect('login')
        }
    } else {
        res.redirect('login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

exports.existeEgresadoRegistrado = (req, res) => {
    const email = req.body.email
    conexion.query('SELECT * FROM egresados WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error)
        } else {
            if (results.length > 0) {
                res.json({ existe: true })
            } else {
                res.json({ existe: false })
            }
        }
    })
}