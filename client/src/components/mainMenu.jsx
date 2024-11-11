import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MainMenu() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  // Función para obtener los documentos desde el servidor
  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/documentos');
      if (response.data.success) {
        setDocuments(response.data.documentos);
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  // useEffect para cargar documentos al montar el componente
  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para redirigir a la interfaz de administrador
  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleSelectDocument = (doc) => {
    navigate('/generate', { state: { document: doc } });
  };


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Menú Principal</h1>
        {rol === 'admin' && (
          <button
            onClick={handleAdminClick}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 focus:outline-none"
          >
            + Nuevo Documento
          </button>
        )}
      </header>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Documento</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Escribe el nombre del documento que buscas..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-500"
            >
              {/* Poner un punto azul si es el documento más reciente */}
              {index === 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full" title="Documento reciente"></span>
              )}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{doc.titulo}</h2>
              <p className="text-gray-600 mb-4">{doc.descripcion}</p>
              <button
              onClick={() => handleSelectDocument(doc)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none"
              >
                Seleccionar Documento
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-600 text-center">No se encontraron documentos con el término especificado.</p>
        )}
      </div>
    </div>
  );
}
