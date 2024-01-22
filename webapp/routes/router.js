import express from 'express'
const router = express.Router()

import authController from '../controllers/authController.js'
import mapController from '../controllers/mapController.js'
import egresadoController from '../controllers/egresadoController.js'
import excelController from '../controllers/excelController.js'
import checkRoleMiddleware from '../middlewares/checkRolMiddleware.js'

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
router.post('/agregarEgresado', egresadoController.agregarEgresado)
router.put('/editarEgresado', egresadoController.editarEgresado)
router.delete('/eliminarEgresado', egresadoController.eliminarEgresado)
router.get('/logout', authController.logout)
router.get('/datosEgresados', checkRoleMiddleware, mapController.datosEgresados);
router.get('/exportarExcel', excelController.exportarExcel);
router.post('/importarExcel', excelController.importarExcel);

export default router
