import ExcelJS from 'exceljs'
import conexion from '../database/db.js'
import fs from 'fs'
import { enviarRespuestaSweetAlert } from '../controllers/utils.js'

// Controlador para la exportación de datos a Excel
export async function exportarExcel(req, res) {
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
export async function importarExcel(req, res) {
    try {
        // Verificar que se haya seleccionado un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No se seleccionó ningún archivo.' });
        }
        
        const archivoExcel = req.files.archivoExcel;
        const rutaArchivoExcel = archivoExcel.tempFilePath;
    
        // Verificar que el archivo sea de tipo Excel
        if (archivoExcel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            eliminarArchivo(rutaArchivoExcel);
            return res.status(400).json({ error: 'El archivo seleccionado no es un archivo Excel.' });
        }

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

        enviarRespuestaSweetAlert(res, "Proceso exitoso", "Archivo Excel importado correctamente.", 'success', false, 1000, '#');

    } catch (error) {
        console.error('Error al leer el archivo Excel:', error);
        enviarRespuestaSweetAlert(res, "Error al insertar los datos en el servidor", error.message, 'error', true, false, '');
    } finally {
        eliminarArchivo(req.files.archivoExcel.tempFilePath);
    }
};

// Función para eliminar un archivo
function eliminarArchivo(rutaArchivo) {
    fs.unlink(rutaArchivo, (error) => {
        if (error) {
            console.error('Error al eliminar el archivo:', error);
        } else {
            console.log('Archivo eliminado correctamente.');
        }
    });
}

export default { exportarExcel, importarExcel }