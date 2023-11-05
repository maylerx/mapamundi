const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const mapController = require('../controllers/mapController')
const checkRoleMiddleware = require('../middlewares/checkRolMiddleware');

//router para las vistas
router.get('/', authController.isAuthenticated, (req, res)=>{    
    res.render('pages/index', {user:req.user, alert:false})
})
router.get('/login', (req, res)=>{
    res.render('pages/login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('pages/register', {alert:false})
})

//router para los métodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/agregarEgresado', mapController.agregarEgresado)
router.get('/logout', authController.logout)
router.get('/coordenadas', checkRoleMiddleware, mapController.coordenadas);

module.exports = router