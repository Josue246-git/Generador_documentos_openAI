import express from 'express';
import path from 'path'; 
import session from 'express-session';
import routes from './routes/charRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//app.use(express.static('public')); // Sirve archivos estáticos de la carpeta 'public'
app.use(express.static(path.resolve('client/public'))); // Sirve archivos estáticos de la carpeta 'public' en client

// // Middleware 
// function checkAuthenticated(req, res, next) {
//     if (req.session.loggedIn) {
//       return next();
//     } else {
//       res.redirect('api/login'); // Redirige al usuario a la página de login si no está autenticado
//     }
//   }

// // Rutas
// app.use(session({
//     secret: 'secreto_para_sesion_segura', // Cambia esto a una cadena secreta fuerte
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false } // Cambiar a true si usas HTTPS
//   }));

app.use('/api', routes); 

app.get('/admin', (req, res) => {
    res.sendFile(path.resolve('client/public/admin.html'));
  });

// app.use('/api/protected', checkAuthenticated, routes); // Aplica el middleware `checkAuthenticated`

// Iniciar el servidor

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

