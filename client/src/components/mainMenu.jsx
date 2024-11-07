import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
  // Lista de tipos de documentos disponibles
  const [documents] = useState([
    { id: 1, name: 'Informe de Necesidad', description: 'Informe detallado basado en requisitos legales.' },
    { id: 2, name: 'Contrato de Servicios', description: 'Documento para formalizar la contratación de servicios.' },
    { id: 3, name: 'Propuesta Técnica', description: 'Formato de propuesta técnica según normativas.' },
    { id: 4, name: 'Plan de Adquisiciones', description: 'Planificación anual para la adquisición de bienes y servicios.' },
    { id: 5, name: 'Informe Financiero', description: 'Informe detallado de la situación financiera.' },
    // Añade más documentos según sea necesario
  ]);

  // Estado para la búsqueda de documentos
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Obtener el rol desde localStorage
  const rol = localStorage.getItem('rol');

  // Filtrar documentos según el término de búsqueda
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Función para redirigir a la interfaz de administrador
    const handleAdminClick = () => {
      navigate('/admin');
    };
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Menú Principal</h1>
        <div className="flex space-x-4">
          {/* Si el usuario es admin, mostrar el botón para ir a la interfaz de administrador */}
          {rol === 'admin' && (
            <button
              onClick={handleAdminClick}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 focus:outline-none"
            >
              + Nuevo Docuemento 
            </button>
          )}
        </div>
      </header>

      {/* Campo de búsqueda */}
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

      {/* Lista de documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-500"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{doc.name}</h2>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <button
                onClick={() => console.log(`Seleccionado: ${doc.name}`)}
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
