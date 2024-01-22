import mysql from 'mysql2'

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

conexion.connect( (error)=> {
    if(error){
        console.log('El error de conexión es: '+error);
        return;
    }
    console.log('¡Conectado a la base de datos MySQL!');
})

export default conexion