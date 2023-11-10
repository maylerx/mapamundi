const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const conexion = require('../database/db');

// Metodo para exportar a CSV
exports.exportar = (req, res) => {
    try {
        conexion.query('SELECT * FROM egresados', (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error interno del servidor');
                return;
            }

            const csvWriter = createCsvWriter({
                path: 'downloads/egresadosdata.csv',
                header: fields.map(field => ({ id: field.name, title: field.name }))
            });

            csvWriter.writeRecords(results)
                .then(() => {
                    res.download('downloads/egresadosdata.csv');
                })
                .catch(error => {
                    console.error('Error al escribir en el archivo CSV:', error);
                    res.status(500).send('Error interno del servidor');
                });
        });
    } catch (error) {
        console.error('Error al exportar a CSV:', error);
        res.status(500).send('Error interno del servidor');
    }
}
