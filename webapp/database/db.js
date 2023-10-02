const mysql = require('mysql2')

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "egresadosdb",
})

conexion.connect( (error)=> {
    if(error){
        console.log('El error de conexión es: '+error)
        return
    }
    console.log('¡Conectado a la base de datos MySQL!')
})

module.exports = conexion