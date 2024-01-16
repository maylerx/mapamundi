const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')

// Funcion de registro de usuarios (Todos con rol usuario)
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        if (!name || !email || !user || !pass) {
            res.render('pages/register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese su nombre completo, email, nombre de usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            })
        } else {
            conexion.query('INSERT INTO users SET ?', { name: name, email: email, user: user, pass: passHash }, async (error, results) => {
                if (error) {
                    if (error.sqlMessage.includes("Duplicate entry")) {
                        mensaje = "El nombre de usuario o email ya está en uso";
                    } else {
                        mensaje = "Ha ocurrido un error inesperado: " + error.sqlMessage + " ";
                    }
                    res.render('pages/register', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: mensaje,
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    });
                } else {
                    res.render('pages/register', {
                        alert: true,
                        alertTitle: "Registro exitoso",
                        alertMessage: "Te has registrado correctamente. ¡Inicia sesión!",
                        showConfirmButton: false,
                        ruta: ''
                    });
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
            res.render('pages/login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese su nombre de usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                // Validacion de usuario con credenciales incorrectas
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('pages/login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else {
                    // Inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    console.log("TOKEN: " + token + " para el USUARIO : " + user)

                    // Definicion de opciones de la cookie como fecha de expiracion y httpOnly
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)

                    res.render('pages/login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
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