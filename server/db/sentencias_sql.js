// sentencias_sql.js
import pool from './conexion_db.js';

export async function validarUsuario(cedula, password) {
  try {
    const result = await pool.query(
      'SELECT rol FROM users WHERE cedula = $1 AND password = $2',
      [cedula, password]
    );
    return result.rows.length > 0 ? result.rows[0].rol : null;
  } catch (error) {
    console.error('Error al validar usuario:', error);
    throw error;
  }
}
