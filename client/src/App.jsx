// App.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminInterface from './components/AdminInterface';
import MainMenu from './components/mainMenu';
import DocumentGenerator from './components/GeneradorDoc';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [rol, setRol] = useState('');

  useEffect(() => {
    // Intenta obtener el rol desde localStorage o el estado de la sesión
    const userRol = localStorage.getItem('rol');
    if (userRol) {
      setRol(userRol);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        
        {/* Rutas protegidas para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminInterface />
            </ProtectedRoute>
          }
        />
        {/* Ruta principal para usuarios comunes */}
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <DocumentGenerator />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta principal para usuarios comunes */}
        <Route
          path="/main-menu"
          element={<MainMenu rol={rol} />} // Pasa el rol como prop
        />
      </Routes>
    </Router>
  );
}

export default App;
