// Función para el login
// queries.js
import pool from './conexion_db.js';
import Fuse from 'fuse.js'; // Asumiendo que estás usando Fuse.js para coincidencias de partidos


export const login = async (cedula, password) => {
    if (!cedula || !password) {
        throw new Error('Cédula o contraseña no pueden estar vacíos');
    }
    const query = 'SELECT * FROM usuarios WHERE cedula = $1 AND password = $2';
    const result = await pool.query(query, [cedula, password]);
    return result.rows.length > 0 ? result.rows[0] : null;
};
