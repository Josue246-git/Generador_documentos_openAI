import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import routes from './routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Obtiene el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
app.use('/api', routes);



// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 