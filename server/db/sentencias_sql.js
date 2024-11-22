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


// const insertarDocumento = async (titulo, prompt_user, contexto_base, puntos) => {
export async function insertarDocumento(titulo, descripcion, prompt_user, contexto_base, puntos) {
  const query = `
    INSERT INTO estr_documentos (titulo, descripcion, prompt_user, contexto_base, puntos)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const values = [titulo, descripcion, prompt_user, contexto_base, puntos];
  const result = await pool.query(query, values);
  return result.rows[0].id;
};

export async function obtenerDocumentos() {
  try {
    const query = `
      SELECT id, titulo, descripcion, prompt_user, contexto_base, puntos, fecha_creacion
      FROM estr_documentos
      ORDER BY fecha_creacion DESC
    `; 
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
} 

export async function obtenerDocumentoPorId(documentoId) {
  try {
    const query = `
      SELECT id, titulo, descripcion, prompt_user, contexto_base, puntos
      FROM estr_documentos
      WHERE id = $1
    `;
    const result = await pool.query(query, [documentoId]);
    return result.rows[0];


  } catch (error) {
    console.error('Error al obtener el documento por ID:', error);
    throw error;
  }
}



export  async function actualizarDocumento(documentoId, titulo, descripcion, prompt_user, contexto_base, puntos) {
  try {
    const query = `
      UPDATE estr_documentos
      SET titulo = $2, descripcion = $3, prompt_user = $4, contexto_base = $5, puntos = $6
      WHERE id = $1
    `;
    await pool.query(query, [documentoId, titulo, descripcion, prompt_user, contexto_base, puntos]);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    throw error;
  }
}


export async function eliminarDocumento(documentoId) {
  try {
    const query = 'DELETE FROM estr_documentos WHERE id = $1';
    await pool.query(query, [documentoId]);
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
}
