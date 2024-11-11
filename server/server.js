import express from 'express';
import cors from 'cors';
// import routes from './routes/chatRoutes.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { validarUsuario, insertarDocumento } from './db/sentencias_sql.js';
import docEstRouter from './routes/doc_routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
// Ruta de login
app.post('/api/login', async (req, res) => {
  const { cedula, password } = req.body;

  try {
    const rol = await validarUsuario(cedula, password);

    if (rol) {
      res.json({ rol });
    } else {
      res.status(401).json({ message: 'Cédula o contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});




app.use(docEstRouter);


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});