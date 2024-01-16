const ExcelJS = require('exceljs');
const conexion = require('../database/db');
const fs = require('fs');

// Controlador para la exportación de datos a Excel
exports.exportarExcel = (req, res) => {
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

// Controlador para la importacion de los datos de Excel al servidor
exports.importarExcel = async (req, res) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No se seleccionó ningún archivo.' });
    }
    
    const archivoExcel = req.files.archivoExcel;
    const rutaArchivoExcel = archivoExcel.tempFilePath;

    if (archivoExcel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        
        // Eliminamos el archivo temporal
        if (fs.existsSync(rutaArchivoExcel)) {
            fs.unlinkSync(rutaArchivoExcel);
            console.log("Se eliminó el archivo temporal");
        } else {
            console.log("El archivo temporal no existe");
        }
        
        return res.status(400).json({ error: 'El archivo seleccionado no es un archivo Excel.' });
    }

    try {
        // Crear una instancia de ExcelJS y leer el archivo sin validación de tipo
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(rutaArchivoExcel);

        const graduadosImportados = [];

        // Lógica para procesar el archivo Excel
        workbook.eachSheet((worksheet) => {

            worksheet.eachRow((row, rowNumber) => {
                if(rowNumber > 1){
                    // Procesar los datos de cada fila aquí
                    const rowData = {};
                    row.values.forEach((value, index) => {
                        // Se asume que los encabezados están en la primera fila
                        const header = worksheet.getRow(1).getCell(index).value;
                        rowData[header] = value;
                    });
        
                    graduadosImportados.push(rowData);
                }
            });
        });  

        // Imprimir el nombre del segundo graduado importado
        //console.log('Nombre del segundo graduado importado:', datosImportados[1].nombres);

        // Insertar los datos importados en la base de datos
        for (const graduado of graduadosImportados) {
            console.log(graduado);

            conexion.query('INSERT INTO egresados SET ?', graduado, (error) => {
                if (error) {
                    // No importa si en el excel hay datos que ya se han agregado a la base de datos
                    if(error.code != 'ER_DUP_ENTRY'){
                        console.error('Error al insertar los datos:', error);
                        throw error;
                    }else{
                        console.log("El registro ya existe en la base de datos");
                    }
                }
            });
        }

        // Enviamos la respuesta al cliente
        res.json({
            alert: true,
            alertTitle: "Proceso exitoso",
            alertMessage: "Archivo Excel importado correctamente.",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 1000,
            ruta: '#'
        });

    } catch (error) {
        console.error('Error al leer el archivo Excel:', error);
        res.json({
            alert: true,
            alertTitle: "Error al insertar los datos en la base de datos.",
            alertMessage: error.message,
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: '#'
        });
    } finally {
        // Eliminamos el archivo temporal
        if (fs.existsSync(rutaArchivoExcel)) {
            fs.unlinkSync(rutaArchivoExcel);
            console.log("Se eliminó el archivo temporal");
        } else {
            console.log("El archivo temporal no existe");
        }  
    }
};
