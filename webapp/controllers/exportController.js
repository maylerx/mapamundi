const ExcelJS = require('exceljs');
const path = require('path');
const conexion = require('../database/db');
const fs = require('fs');

exports.exportar = (req, res) => {
    const nombreArchivoExcel = 'downloads/graduados.xlsx';

    try {
        conexion.query('SELECT * FROM egresados', (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                return res.status(500).send('Error interno del servidor');
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Egresados');

            const columnas = fields.map(field => field.name);
            worksheet.addRow(columnas);

            results.forEach(row => {
                worksheet.addRow(Object.values(row));
            });

            workbook.xlsx.writeFile(nombreArchivoExcel)
                .then(() => {
                    console.log(`Archivo Excel '${nombreArchivoExcel}' creado con éxito.`);

                    // Configurar el encabezado manualmente
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', 'attachment; filename=graduados.xlsx');

                    // Crear un flujo de lectura para el archivo y enviarlo como respuesta
                    const fileStream = fs.createReadStream(nombreArchivoExcel);
                    fileStream.pipe(res);

                    // Eliminar el archivo después de enviarlo (opcional)
                    fileStream.on('close', () => {
                        fs.unlinkSync(nombreArchivoExcel);
                    });
                })
                .catch(error => {
                    console.error('Error al guardar el archivo Excel:', error);
                    res.status(500).json({ error: 'Error al guardar el archivo Excel' });
                });
        });
    } catch (error) {
        console.error('Error al exportar a XLSX:', error);
        res.status(500).send('Error interno del servidor');
    }
};