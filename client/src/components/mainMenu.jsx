import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
  const [documents, setDocuments] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);;
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null); 
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

    // Función para cerrar sesión
    const handleLogout = () => {
      localStorage.removeItem('rol');
      navigate('/'); // Redirige a la interfaz de inicio de sesión
    };


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

  // const filteredDocuments = documents.filter((doc) =>
  //   doc.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  // );


  // Función para redirigir a la interfaz de administrador
  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleSelectDocument = (doc) => {
    navigate('/generate', { state: { document: doc } });
  };


const handleDelete = async (documentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documentos/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el documento');
      setDocuments(documents.filter((doc) => doc.id !== documentId));
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = (doc) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (documentId) => {
    navigate(`/admin/edit/${documentId}`); // Redirige a AdminInterfaceEdit
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-6xl mx-auto space-y-8"> {/* Añadir este div contenedor */}
      <header className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold text-gray-800">Menú Principal</h1>

        {rol === 'admin' && (
           <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rol:</span>
              <span className="inline-flex items-center px-5 py-1 rounded-full text-m font-medium bg-indigo-100 text-indigo-800">
                {rol.charAt(0).toUpperCase() + rol.slice(1)}
              </span>
            <button
              onClick={handleAdminClick}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500 focus:outline-none"
            >
              + Nuevo Documento
            </button>

           </div>
        )}
              <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-400 focus:outline-none"
            >
              Cerrar Sesión
            </button>
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
          {documents
            .filter((doc) => doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-indigo-500"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{doc.titulo}</h2>
                <p className="text-gray-600 mb-4">{doc.descripcion}</p>
                <button
                  onClick={() => handleSelectDocument(doc)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none"
                  >
                  Seleccionar Documento
              </button>
                {rol === 'admin' && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(doc.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(doc)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
                
              </div>
            ))}
      </div>

        {/* Dialogo de confirmación */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">¿Estás seguro?</h3>
              <p className="text-gray-600 mb-4">
                Esta acción eliminará permanentemente el documento{' '}
                <strong>{documentToDelete?.titulo}</strong>. No se puede deshacer.
              </p>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(documentToDelete?.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  </div>
  );
}
