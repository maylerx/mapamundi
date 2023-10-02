const conexion = require('../database/db')
const uploadImage = require('./cloudinaryController');

exports.coordenadas = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            conexion.query('SELECT nombres, apellidos, imagen_url, coord_x, coord_y FROM egresados', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        return res.json(results);
    } catch (error) {
        return res.json(error);
    }
}

exports.agregarEgresado = async (req, res) => {
    try {
        const { nombres, apellidos, coord_x, coord_y } = req.body;
        if (!nombres || !apellidos || !coord_x || !coord_y) {
            res.render('index', {
                user: req.user,
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            })
        } else {
            const tempFilePath = req.files.imagen.tempFilePath;
            const result = await uploadImage(tempFilePath);
            const rutaWebImagen = result.url
            console.log("RUTA DE LA IMAGEN: ", rutaWebImagen);
            conexion.query('INSERT INTO egresados SET ?', {
                nombres: nombres,
                apellidos: apellidos,
                imagen_url: rutaWebImagen,
                coord_x: coord_x,
                coord_y: coord_y
            }, (error) => {
                if (error) {
                    res.render('index', {
                        user: req.user,
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Ha ocurrido un error al agregar el egresado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    })
                } else {
                    res.render('index', {
                        user: req.user,
                        alert: true,
                        alertTitle: "Proceso exitoso",
                        alertMessage: "El egresado se ha agregado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
                }
            });
        }
    } catch (error) {
        res.render('index', {
            user: req.user,
            alert: true,
            alertTitle: "Error",
            alertMessage: error,
            alertIcon: 'info',
            showConfirmButton: true,
            timer: false,
            ruta: ''
        })
    }
}
