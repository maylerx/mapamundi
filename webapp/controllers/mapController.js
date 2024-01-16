const conexion = require('../database/db')
const uploadImage = require('./cloudinaryController');
const axios = require('axios');
const fs = require('fs');

exports.datosEgresados = async (req, res) => {
    try {
        const query = `
            SELECT e.nombres, e.apellidos,
                e.calle_carrera, e.numero_casa, e.barrio_vereda, e.pais_residencia,
                e.departamento_residencia, e.ciudad_residencia,
                e.email, e.numero_telefono, e.year_graduacion,
                e.cargo_actual, e.empresa_url,
                e.imagen_url, e.portafolio_url, e.coord_x, e.coord_y
            FROM egresados e
        `;

        const results = await new Promise((resolve, reject) => {
            conexion.query(query, (error, results) => {
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

function obtenerNombreUbicacionPorId(tipo, id) {
    return axios.get(`http://api.geonames.org/getJSON?geonameId=${id}&username=sebasbp`)
        .then(response => {
            const data = response.data;
            if (data) {
                switch (tipo) {
                    case 'pais':
                        return data.countryName;
                    case 'departamento':
                        return data.name;
                    case 'ciudad':
                        return data.name;
                    default:
                        console.log('Tipo no reconocido');
                        return null;
                }
            } else {
                console.log(`No se encontraron datos para el ID ${id}`);
                return null;
            }
        })
        .catch(error => {
            console.error(`Error al obtener los datos: ${error}`);
            return null;
        });
}

exports.agregarEgresado = async (req, res) => {
    try {
        const { nombres,
                apellidos,
                calle_carrera, 
                numero_casa, 
                numero_torre, 
                barrio_vereda,
                codigo_postal, 
                pais_residencia, 
                departamento_residencia,
                detalles_direccion,
                ciudad_residencia, 
                email, 
                numero_telefono, 
                year_graduacion, 
                coordenadas,
                portafolio_url,
                datos_publicos, 
                cargo_actual, 
                empresa_url } = req.body;
        
        // Verificacion de datos obligatorios
        if (!nombres
            || !apellidos
            || !calle_carrera
            || !numero_casa
            || !barrio_vereda
            || !codigo_postal
            || !pais_residencia
            || !departamento_residencia
            || !ciudad_residencia
            || !email
            || !numero_telefono 
            || !year_graduacion
            || !coordenadas
            || !portafolio_url 
            || req.files.imagen === null) {
            console.log("ADVERTENCIA: NO SE INGRESARON TODOS LOS CAMPOS OBLIGATORIOS");
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos obligatorios (*)",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            // Subir imagen a Cloudinary
            const tempFilePath = req.files.imagen.tempFilePath;
            const result = await uploadImage(tempFilePath);
            const rutaWebImagen = result.url;

            var pais_name = await obtenerNombreUbicacionPorId('pais', pais_residencia);
            var departamento_name = await obtenerNombreUbicacionPorId('departamento', departamento_residencia);
            var ciudad_name = await obtenerNombreUbicacionPorId('ciudad', ciudad_residencia);
            var coord_x = coordenadas.split(", ")[0];
            var coord_y = coordenadas.split(", ")[1];

            conexion.query('INSERT INTO egresados SET ?', {
                email: email,
                nombres: nombres,
                apellidos: apellidos,
                calle_carrera: calle_carrera,
                numero_casa: numero_casa,
                numero_torre: numero_torre,
                barrio_vereda: barrio_vereda,
                codigo_postal: codigo_postal,
                detalles_direccion: detalles_direccion,
                ciudad_residencia: ciudad_name,
                departamento_residencia: departamento_name,
                pais_residencia: pais_name,
                year_graduacion: year_graduacion,
                imagen_url: rutaWebImagen,
                coord_x: coord_x,
                coord_y: coord_y,
                numero_telefono: numero_telefono,
                portafolio_url: portafolio_url,
                datos_publicos: datos_publicos === 'on' ? 1 : 0,
                cargo_actual: cargo_actual,
                empresa_url: empresa_url,
            }, (error) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY'){
                        res.json({
                            alert: true,
                            alertTitle: "Advertencia",
                            alertMessage: "Ya hay un graduado registrado con el correo electrónico o número de telefono ingresados",
                            alertIcon: 'info',
                            showConfirmButton: true,
                            timer: false,
                            ruta: ''
                        });
                    }else{
                        console.log(error);
                        res.json({
                            alert: true,
                            alertTitle: "Error en la base de datos",
                            alertMessage: error.message,
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: ''
                        });
                    }
                } else {
                    console.log("SE HA REGISTRADO UN GRADUADO NUEVO");
                    res.json({
                        alert: true,
                        alertTitle: "Proceso exitoso",
                        alertMessage: "Los datos del graduado se han registrado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: '#'
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error al insertar los datos en el servidor:', error);
        if (error.message == "Cannot read properties of null (reading 'imagen')"){
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "La imagen de perfil es obligatoria",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            res.json({
                alert: true,
                alertTitle: "Error en la base de datos",
                alertMessage: error.message,
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }
    }
}