import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que tu API Key esté en las variables de entorno
});

router.post('/generate', async (req, res) => {
  try {   
    const { objetoContratacion, feedback } = req.body;
    // Establecer el contexto base del chat para la generación del informe
    const contextMessage = {
      role: 'system',
      content: `
       You are an assistant specialized in writing INFORMES DE NECESIDAD for government contracts, based on the legal framework of Ecuador, following Article 52.1 of the LOSNCP. You must always adhere to legal language and structure based on the following regulations:
      - Decreto Ejecutivo 871 Registro Oficial Suplemento 116 de 15-sep.-2023
      - Reglamento a la ley Orgánica del Sistema Nacional de Contratación Públicas y sus reformas
      - La Constitución del Ecuador

      When a user provides an "OBJETO DE CONTRATACIÓN", create detailed sections including:
      1. **Antecedentes**: Include legal, historical, and economic backgrounds related to the request.
      2.1.**Objetivo general**
      Indicate the general objective of the acquisition of goods or contracting of services, works, including the purpose.
      2.2. **Objetivos especificos**: Indicate at least 2 specific objectives that will be achieved, which will be derived from the general objective.

      3. **Identificacion de la necesidad**: Establish the current problem, through which you can identify the real need for the acquisition of goods or the contracting of services, works.
      Indicate two to three clear points that justify the need to acquire supplies.

      4. **Justificacion**:  Why contract? It should be aimed at justifying the contracting in compliance with current legal regulations.
      Provide a two or three paragraph justification, explaining the operational need and its regulatory support.

      5. **ESPECIFICACIONES TECNICAS O TERMINOS DE REFERENCIA**:
      Detail precisely the goods, services, works to be contracted, list the items in table format where these fields are available: item, product description, CPC, Unit, Quantity (the unit column must be recorded according to instructions, in the case of works attach analysis of unit prices)

      6.**ANÁLISIS BENEFICIO, EFICIENCIA O EFECTIVIDAD**: Write it in two paragraphs, one that has the "Efficiency Analysis": ----- , and the rest in another paragraph
      7.  **RESPONSABILIDAD DEL REQUERIMIENTO**:  specify the responsible departments or individuals, considering their roles in overseeing and executing the contract requirements.

      When generating content, adhere to the legal style, hierarchy of norms, and use clear and formal language. Always include legal references when required.
      `
    };

    // Construir las instrucciones del usuario
    let userPrompt = `Generate the sections "Antecedentes", "Objetivos", "Identificación de la necesidad", "Justificación", "Especificaciones Técnicas o Términos de Referencia", "Análisis de Beneficio, Eficiencia o Efectividad" and "Responsabilidad del Requerimiento" for the following OBJETO DE CONTRATACIÓN: ${objetoContratacion}.`;

    // Incluir feedback adicional del usuario si existe
    if (feedback) {
      userPrompt += ` Additionally, consider the following feedback: ${feedback}.`;
    }

   
    // Solicitud a OpenAI con el cliente OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        contextMessage,
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.2
    });

    const respuesta = response.choices[0].message.content;
    res.json({ success: true, response: respuesta });
  } catch (error) {
    console.error('Error al generar el informe:', error);
    res.status(500).json({ success: false, message: 'Error al generar el informe' });
  }
});

router.post('/chat', async (req, res) => {
  const { message, previousResponse = '' } = req.body;

 
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system',  content: `You are an expert editor who helps users refine and improve documents related to government contracts and legal frameworks. Your role is to make edits as per the user's specific instructions, while preserving formal legal tone, clarity, and compliance with Ecuadorian regulations. Please ensure that you maintain the key sections in all responses, which are: 1. Background, 2.1. General objective, 2.2. Specific objectives, 3. Identification of the need, 4. Justification, 5. Technical specifications or terms of reference, 6. Analysis of benefits, efficiency or effectiveness, 7. Responsibility for the requirement..` },
        { role: 'assistant', content: previousResponse },
        { role: 'user', content: message }
      ]
    });

    const updatedResponse = completion.choices[0].message.content.trim();
    res.json({ response: updatedResponse, previousResponse: updatedResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

// // Ruta para el login
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
//     req.session.loggedIn = true; // Establece la sesión como autenticada
//     return res.json({ success: true, message: 'Login exitoso' });
//   } else {
//     return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
//   }
// });

// // Ruta para cerrar sesión
// router.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
//     } else {
//       return res.json({ success: true, message: 'Sesión cerrada' });
//     }
//   });
// });

// // charRoutes.js

// router.get('/checkAuth', (req, res) => {
//   if (req.session.loggedIn) {
//     res.sendStatus(200);
//   } else {
//     res.sendStatus(401);
//   }
// });


export default router;