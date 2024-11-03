// src/services/openaiService.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const openaiInstance = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});

const getChatCompletion = async (prompt) => {
  try {
    const response = await openaiInstance.post('/completions', {
      model: 'gpt-4o-mini',
      prompt: prompt,
      max_tokens: 500
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener respuesta del modelo de OpenAI');
  }
};

module.exports = {
  getChatCompletion,
};
