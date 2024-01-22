import conexion from '../database/db.js'

export async function datosEgresados(req, res) {
    try {
        const query = `
            SELECT 
                e.email,
                e.nombres,
                e.apellidos,
                e.calle_carrera,
                e.numero_casa,
                e.numero_torre,
                e.barrio_vereda,
                e.codigo_postal,
                e.detalles_direccion,
                e.ciudad_residencia,
                e.departamento_residencia,
                e.pais_residencia,
                e.year_graduacion,
                e.imagen_url,
                e.coord_x,
                e.coord_y,
                e.numero_telefono,
                e.portafolio_url,
                e.datos_publicos, 
                e.cargo_actual,
                e.empresa_url
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

export default { datosEgresados };