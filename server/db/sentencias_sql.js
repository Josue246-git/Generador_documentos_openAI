// sentencias_sql.js
import pool from './conexion_db.js';

import crypto from 'crypto'; // Para Node.js, `crypto` es un módulo nativo

export async function validarUsuario(cedula, password) {
  try {
    // Encripta la contraseña con MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    // Realiza la consulta para verificar el usuario y la contraseña
    const result = await pool.query(
      'SELECT rol FROM users WHERE cedula = $1 AND password = $2',
      [cedula, hashedPassword]
    );

    // Devuelve el rol si la consulta tiene resultados, o null si no se encuentra
    return result.rows.length > 0 ? result.rows[0].rol : null;
  } catch (error) {
    console.error('Error al validar usuario:', error);
    throw error;
  }
}


// const insertarDocumento = async (titulo, prompt_user, contexto_base, puntos) => {
export async function insertarDocumento(titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina) {
  const query = `
    INSERT INTO estr_documentos (titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const values = [titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina];
  const result = await pool.query(query, values);
  return result.rows[0].id;
};

export async function obtenerDocumentos() {
  try {
    const query = `
      SELECT id, titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina, fecha_creacion
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
      SELECT id, titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina, fecha_creacion
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



export  async function actualizarDocumento(documentoId, titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina) {
  try {
    const query = `
      UPDATE estr_documentos
      SET titulo = $2, descripcion = $3, prompt_user = $4, contexto_base = $5, puntos = $6, encabezado = $7, piepagina = $8
      WHERE id = $1
    `;
    await pool.query(query, [documentoId, titulo, descripcion, prompt_user, contexto_base, puntos, encabezado, piepagina]);
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


export async function ObtenerUsers() {
  try {
    const query = `
      SELECT id, cedula, nombre, apellido, rol, email 
      FROM users
    `;
    const result
    = await pool.query(query);
    return result.rows;
  }
  catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

export async function CrearUser(cedula, email, password, rol, nombre, apellido) {
  try {
    const query = `
      INSERT INTO users (cedula, email, password, rol, nombre, apellido)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [cedula, email, password, rol, nombre, apellido];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}


export async function ActualizarUsers(userId, cedula, email, rol, nombre, apellido) {
  try {
    const query = `
      UPDATE users
      SET cedula = $2, email = $3, rol = $4, nombre = $5, apellido = $6
      WHERE id = $1
    `;
    await pool.query(query, [userId, cedula, email, rol, nombre, apellido]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

export async function EliminarUsers(userId) {
  try {
    const query = 'DELETE from users WHERE id = $1';
    await pool.query(query, [userId]);
  } 
  catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

