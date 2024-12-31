import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db/conexion_db.js';
import { authMiddleware } from '../middleware/auth.js';
import { insertarDocumento, obtenerDocumentos, obtenerDocumentoPorId, actualizarDocumento, eliminarDocumento, ObtenerUsers, CrearUser, ActualizarUsers, EliminarUsers  } from '../db/sentencias_sql.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que tu API Key esté en las variables de entorno
});


export const generarEstDocumento = async (req, res) => {
  const { title, descripcion, userPrompt, context, sections,headerPoints, footerPoints } = req.body;

  console.log( title, userPrompt, context, sections, headerPoints, footerPoints);
  try {
    // Almacenar los datos en la base de datos
    const documentId = await insertarDocumento(title, descripcion, userPrompt, context, sections, headerPoints, footerPoints);

    // Devolver confirmación de éxito al cliente
    res.status(200).json({
      success: true,
      message: 'Documento almacenado exitosamente en la base de datos',
      documentId,
    });
  } catch (error) {
    console.error('Error al almacenar el documento:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};


// En el controlador `documentController.js`
export const obtenerDocumentosCon = async (req, res) => { 
  try {
    const documentos = await obtenerDocumentos();


    res.status(200).json({ success: true, documentos });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ success: false, error: 'Error al obtener documentos' });
  }
};

export const obtenerDocumentoConId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Obtener documento con id:', id);
    const documento = await obtenerDocumentoPorId(id);

    // console.log('Documento:', documento);

    res.status(200).json({ success: true, documento });
  } catch (error) {
    console.error('Error al obtener el documento:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el documento' });
  }
};


export const generarDocumento = async (req, res) => {
  try {
    // Obtener el tipo de documento e ID del documento desde el body o query params
    const { documentoId, objDoc } = req.body;
    console.log('documentoId:', documentoId);
    console.log('objDoc:', objDoc);

    // Obtener el documento de la base de datos según el ID
    const documento = await obtenerDocumentoPorId(documentoId);
    
    if (!documento) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    // Extraer los datos necesarios del documento
    const { titulo, prompt_user, contexto_base, puntos } = documento;
    console.log('titulo:', titulo);

    // Configurar el mensaje de contexto y el prompt del usuario
    const contextMessage = {
      role: 'system',
      content: `${contexto_base} ${puntos}. Por favor, responde como el siguiente ejemplo de formato JSON : 
                [
                  {
                    "id": "1",
                    "title": "Antecedentes",
                    "content": "Descripción del contenido correspondiente al punto."
                  },
                  ...
                ]
                Genera solo los puntos señalados en el documento`
    };
    const userPrompt = `${prompt_user} ${objDoc}`; 

    // Realizar la solicitud a OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        contextMessage,
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.2,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        "type": "json_object"
      },
    });

    // Obtener la respuesta de OpenAI
    const respuesta = response.choices[0].message.content;
    console.log('Respuesta:', respuesta);
    res.json({ success: true, response: respuesta });
  } 
  catch (error) {
    console.error('Error al generar el informe:', error);
    res.status(500).json({ success: false, message: 'Error al generar el informe' });
  }
};



//Generar informes generalizados
// router.post('/generate', async (req, res) => {
//   try {   
//     const { objetoContratacion, feedback } = req.body;
//     // Establecer el contexto base del chat para la generación del informe
//     const contextMessage = {
//       role: 'system',
//       content: `
//        You are an assistant specialized in writing INFORMES DE NECESIDAD for government contracts, based on the legal framework of Ecuador, following Article 52.1 of the LOSNCP. You must always adhere to legal language and structure based on the following regulations:
//       - Decreto Ejecutivo 871 Registro Oficial Suplemento 116 de 15-sep.-2023
//       - Reglamento a la ley Orgánica del Sistema Nacional de Contratación Públicas y sus reformas
//       - La Constitución del Ecuador

//       When a user provides an "OBJETO DE CONTRATACIÓN", create detailed sections including:
//       1. **Antecedentes**: Include legal, historical, and economic backgrounds related to the request.
//       2.1.**Objetivo general**
//       Indicate the general objective of the acquisition of goods or contracting of services, works, including the purpose.
//       2.2. **Objetivos especificos**: Indicate at least 2 specific objectives that will be achieved, which will be derived from the general objective.

//       3. **Identificacion de la necesidad**: Establish the current problem, through which you can identify the real need for the acquisition of goods or the contracting of services, works.
//       Indicate two to three clear points that justify the need to acquire supplies.

//       4. **Justificacion**:  Why contract? It should be aimed at justifying the contracting in compliance with current legal regulations.
//       Provide a two or three paragraph justification, explaining the operational need and its regulatory support.

//       5. **ESPECIFICACIONES TECNICAS O TERMINOS DE REFERENCIA**:
//       Detail precisely the goods, services, works to be contracted, list the items in table format where these fields are available: item, product description, CPC, Unit, Quantity (the unit column must be recorded according to instructions, in the case of works attach analysis of unit prices)

//       6.**ANÁLISIS BENEFICIO, EFICIENCIA O EFECTIVIDAD**: Write it in two paragraphs, one that has the "Efficiency Analysis": ----- , and the rest in another paragraph
//       7.  **RESPONSABILIDAD DEL REQUERIMIENTO**:  specify the responsible departments or individuals, considering their roles in overseeing and executing the contract requirements.

//       When generating content, adhere to the legal style, hierarchy of norms, and use clear and formal language. Always include legal references when required.
//       `
//     };

//     // Construir las instrucciones del usuario
//     let userPrompt = `Generate the sections "Antecedentes", "Objetivos", "Identificación de la necesidad", "Justificación", "Especificaciones Técnicas o Términos de Referencia", "Análisis de Beneficio, Eficiencia o Efectividad" and "Responsabilidad del Requerimiento" for the following OBJETO DE CONTRATACIÓN: ${objetoContratacion}.`;

//     // Incluir feedback adicional del usuario si existe
//     if (feedback) {
//       userPrompt += ` Additionally, consider the following feedback: ${feedback}.`;
//     }

   
//     // Solicitud a OpenAI con el cliente OpenAI
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         contextMessage,
//         { role: 'user', content: userPrompt }
//       ],
//       max_tokens: 2000,
//       temperature: 0.2
//     });

//     const respuesta = response.choices[0].message.content;
//     res.json({ success: true, response: respuesta });
//   } catch (error) {
//     console.error('Error al generar el informe:', error);
//     res.status(500).json({ success: false, message: 'Error al generar el informe' });
//   }
// });


export const corregirDocumento = async (req, res) => {
  try {
    const { documentoId, titulo, contenido, solicitud } = req.body; // Datos recibidos del frontend
    console.log('documentId:', documentoId);
    console.log('titulo:', titulo);
    console.log('contenido:', contenido);
    console.log('solicitud:', solicitud);

    // Obtener el documento de la base de datos según el ID
    const documento = await obtenerDocumentoPorId(documentoId);
    
    if (!documento) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    // Extraer los datos necesarios del documento
    const {contexto_base} = documento;

    // Configurar el mensaje de contexto
    const contextMessage = {
      role: 'system',
      content: `En base al contexto base: "${contexto_base}", corrige solo y unicamente el punto: "${titulo}": "${contenido}" .`
    };

    // Realizar la solicitud a OpenAI para procesar la corrección
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        contextMessage,
        { role: 'user', content: solicitud }
      ],
      max_tokens: 700,
      temperature: 0.2,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Obtener la respuesta de OpenAI y procesarla
    const correctedContent = response.choices[0].message.content;

    // Enviar la respuesta con el contenido corregido
    res.status(200).json({ success: true, correctedContent });
  } catch (error) {
    console.error("Error al corregir el documento:", error);
    res.status(500).json({ success: false, message: "Error al procesar el cambio" });
  }
};



export const updateEstDocument = async (req, res) => { 

  try {
    const { id } = req.params;
    const { title, descripcion, userPrompt, context, sections,encabezado,pie_pagina } = req.body;
    console.log('id:', id);
    console.log('titulo:', title);
    console.log('descripcion:', descripcion);
    console.log('prompt_user:', userPrompt);
    console.log('contexto_base:', context);
    console.log('puntos:', sections); 
    console.log('encabezado:', encabezado);
    console.log('pie_pagina:', pie_pagina);

    await actualizarDocumento(id, title, descripcion, userPrompt, context, sections, encabezado, pie_pagina);

    res.status(200).json({ success: true, message: 'Documento actualizado exitosamente' });
  } 
  catch (error) {
    console.error('Error al actualizar el documento:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el documento' });
  }
}


export const deleteEstDocument = async (req, res) => { 
  try {
    const { id } = req.params;
    console.log('Deleted estructuraDocuemtno con id:', id);

    await eliminarDocumento(id);

    res.status(200).json({ success: true, message: 'Documento eliminado exitosamente' });
  } 
  catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar documento' });
  }
}



//Gestion users

export const ObtenerUsuarios = async (req, res) => {
  try {
    const users = await ObtenerUsers();
    // Usar MD5 para desencriptar la contraseña

    console.log('Userios obtenidos');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const InsertarUsuarios = async (req, res) => {
  const { cedula, nombre, apellido, email, password, rol} = req.body;
  try {
    // Usar MD5 para encriptar la contraseña
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex'); 
    console.log('Contraseña original:', password );
    console.log('Contraseña hasheada:', hashedPassword);
    
    // Llamar a la función para crear el usuario con la contraseña hasheada
    const userid = await CrearUser(cedula, email, hashedPassword, rol, nombre, apellido);
    console.log('Usuario creado con id:', userid);
    res.json({ userid });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};



export const ActualizarUsuarios = async (req, res) => {
  const { id } = req.params;
  const { cedula, email,  rol, nombre, apellido } = req.body;
  try {
    await ActualizarUsers(id, cedula, email, rol, nombre, apellido);
    console.log('Usuario actualizado, id:', id);
    res.json({ message: 'Usuario actualizado' });
   }
  catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
}

export const EliminarUsuarios = async (req, res) => {
  const { id } = req.params;
  try {
    await EliminarUsers(id);
    console.log('Usuario eliminado, id:', id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
}
