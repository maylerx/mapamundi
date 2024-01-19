const conexion = require('../database/db')
const uploadImage = require('./cloudinaryController');
const axios = require('axios');
const { enviarRespuestaSweetAlert } = require('../controllers/utils')

// Funcion para agregar un nuevo egresado a la base de datos
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
            enviarRespuestaSweetAlert(res, "Advertencia", "Ingrese todos los campos obligatorios (*)", 'info', true, false, '');
        } else {

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
                datos_publicos: datos_publicos === 'checked' ? 1 : 0,
                cargo_actual: cargo_actual,
                empresa_url: empresa_url,
            }, async (error) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        enviarRespuestaSweetAlert(res, "Advertencia", "Ya hay un graduado registrado con el correo electrónico o número de telefono ingresados", 'info', true, false, '');
                    } else {
                        console.log(error);
                        enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
                    }
                } else {
                    // Subir imagen a Cloudinary después de que el query sea exitoso
                    const tempFilePath = req.files.imagen.tempFilePath;
                    try {
                        const result = await uploadImage(tempFilePath);
                        const rutaWebImagen = result.url;

                        // Actualizar la fila en la base de datos con la URL de la imagen
                        conexion.query('UPDATE egresados SET imagen_url = ? WHERE email = ?', [rutaWebImagen, email], (updateError) => {
                            if (updateError) {
                                console.log(updateError);
                                enviarRespuestaSweetAlert(res, "Error en la base de datos", updateError.message, 'error', true, false, '');
                            } else {
                                console.log("SE HA REGISTRADO UN GRADUADO NUEVO CON IMAGEN");
                                enviarRespuestaSweetAlert(res, "Proceso exitoso", "Los datos del graduado se han registrado correctamente", 'success', false, 800, '#');
                            }
                        });
                    } catch (uploadError) {
                        console.log(uploadError);
                        enviarRespuestaSweetAlert(res, "Error al subir la imagen", uploadError.message, 'error', true, false, '');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al insertar los datos en el servidor:', error);
        if (error.message == "Cannot read properties of null (reading 'imagen')") {
            enviarRespuestaSweetAlert(res, "Advertencia", "La imagen de perfil es obligatoria", 'info', true, false, '');
        } else {
            enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
        }
    }
}

// Funcion para agregar un nuevo egresado a la base de datos
exports.editarEgresado = async (req, res) => {
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
            empresa_url,
            email_original,
            numero_telefono_original
        } = req.body;

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
            || !portafolio_url) {
            console.log("ADVERTENCIA: NO SE INGRESARON TODOS LOS CAMPOS OBLIGATORIOS");
            enviarRespuestaSweetAlert(res, "Advertencia", "Ingrese todos los campos obligatorios (*)", 'info', true, false, '');
        } else {
            var pais_name = await obtenerNombreUbicacionPorId('pais', pais_residencia);
            var departamento_name = await obtenerNombreUbicacionPorId('departamento', departamento_residencia);
            var ciudad_name = await obtenerNombreUbicacionPorId('ciudad', ciudad_residencia);
            var coord_x = coordenadas.split(", ")[0];
            var coord_y = coordenadas.split(", ")[1];

            conexion.query('UPDATE egresados SET ? WHERE email = ?', [{
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
                coord_x: coord_x,
                coord_y: coord_y,
                numero_telefono: numero_telefono,
                portafolio_url: portafolio_url,
                datos_publicos: datos_publicos === 'checked' ? 1 : 0,
                cargo_actual: cargo_actual,
                empresa_url: empresa_url,
            }, email_original], async (error) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY' && email_original != email && numero_telefono_original != numero_telefono) {
                        enviarRespuestaSweetAlert(res, "Advertencia", "Ya hay un graduado registrado con el correo electrónico o número de telefono ingresados", 'info', true, false, '');
                    } else {
                        console.log(error);
                        enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
                    }
                } else {
                    if (req.files !== null) {
                        // Subir imagen a Cloudinary después de que el query sea exitoso
                        const tempFilePath = req.files.imagen.tempFilePath;
                        try {
                            const result = await uploadImage(tempFilePath);
                            const rutaWebImagen = result.url;

                            // Actualizar la fila en la base de datos con la URL de la imagen
                            conexion.query('UPDATE egresados SET imagen_url = ? WHERE email = ?', [rutaWebImagen, email], (updateError) => {
                                if (updateError) {
                                    console.log(updateError);
                                    enviarRespuestaSweetAlert(res, "Error en la base de datos", updateError.message, 'error', true, false, '');
                                    return;
                                }

                                console.log("SE HAN ACTUALIZADO LOS DATOS DEL GRADUADO CORRECTAMENTE");
                                enviarRespuestaSweetAlert(res, "Proceso exitoso", "Los datos del graduado se han actualizado correctamente", 'success', false, 800, '#');
                            });
                        } catch (uploadError) {
                            console.log(uploadError);
                            enviarRespuestaSweetAlert(res, "Error al subir la imagen", uploadError.message, 'error', true, false, '');
                        }
                    } else {
                        console.log("SE HAN ACTUALIZADO LOS DATOS DEL GRADUADO CORRECTAMENTE");
                        enviarRespuestaSweetAlert(res, "Proceso exitoso", "Los datos del graduado se han actualizado correctamente", 'success', false, 800, '#');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al insertar los datos en el servidor:', error);
        if (error.message == "Cannot read properties of null (reading 'imagen')") {
            enviarRespuestaSweetAlert(res, "Advertencia", "La imagen de perfil es obligatoria", 'info', true, false, '');
        } else {
            enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
        }
    }
}

// Funcion auxiliar para obtener el nombre de una ubicacion por su ID
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

// Funcion para eliminar un egresado de la base de datos dado el email
exports.eliminarEgresado = async (req, res) => {
    try {
        const { email } = req.body;

        conexion.query('DELETE FROM egresados WHERE email = ?', [email], (error) => {
            if (error) {
                console.log(error);
                enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
            } else {
                console.log("SE HA ELIMINADO UN GRADUADO CORRECTAMENTE");
                enviarRespuestaSweetAlert(res, "Proceso exitoso", "Los datos del graduado se han eliminado correctamente", 'success', false, 800, '#');
            }
        });
    } catch (error) {
        console.error('Error al eliminar los datos en el servidor:', error);
        enviarRespuestaSweetAlert(res, "Error en la base de datos", error.message, 'error', true, false, '');
    }
}