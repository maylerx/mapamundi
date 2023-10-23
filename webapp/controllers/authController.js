const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')

// Funcion de registro de usuarios (Todos con rol usuario)
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        if (!user || !name || !pass) {
            res.render('register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese su nombre de usuario, nombre completo y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            })
        } else {
            conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash }, async (error, results) => {
                if (error) {
                        res.render('register', {
                            alert: true,
                            alertTitle: "Advertencia",
                            alertMessage: "Ya existe un usuario con ese nombre de usuario",
                            alertIcon: 'info',
                            showConfirmButton: true,
                            timer: false,
                            ruta: ''
                        });
                    } else {
                        res.render('register', {
                            alert: true,
                            alertTitle: "Registro exitoso",
                            alertMessage: "¡REGISTRO CORRECTO!",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
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
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                // Validacion de usuario con credenciales incorrectas
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
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
                    const token = jwt.sign({ id: id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    console.log("TOKEN: " + token + " para el USUARIO : " + user)

                    // Definicion de opciones de la cookie como fecha de expiracion y httpOnly
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)

                    res.render('login', {
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
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}