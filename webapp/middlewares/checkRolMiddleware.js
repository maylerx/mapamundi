import conexion from '../database/db.js'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

const checkRoleMiddleware = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);

            const results = await promisify(conexion.query).bind(conexion)('SELECT * FROM users WHERE id = ?', [decodificada.id]);

            if (results.length > 0) {
                req.rol_id = results[0].rol_id;
            }
        }
    } catch (error) {
        console.log(error);
        return res.json(error);
    }

    next();
}

export default checkRoleMiddleware;
