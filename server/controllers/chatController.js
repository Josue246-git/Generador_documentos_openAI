// src/controllers/chatController.js
import getChatCompletion from '../services/openaiServices.js';

const chatHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await getChatCompletion(prompt);
    res.status(200).json({ success: true, message: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

module.exports = {
  chatHandler,
};
