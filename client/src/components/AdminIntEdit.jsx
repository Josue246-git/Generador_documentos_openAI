import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import {  Home } from "lucide-react"; // Añadido el ícono Home


export default function EditAdminInterface() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [context, setContext] = useState('');
  const [sections, setSections] = useState([{ content: '' }]);
  const [headerFields, setHeaderFields] = useState([{ content: '' }]);
  const [footerFields, setFooterFields] = useState([{ content: '' }]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleAddSection = () => {
    setSections([...sections, { content: '' }]);
  };

  const handleSectionChange = (index, newContent) => {
    setSections(
      sections.map((section, i) =>
        i === index ? { ...section, content: newContent } : section
      )
    );
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index, newContent) => {
    setHeaderFields(headerFields.map((field, i) => (i === index ? newContent : field)));
  };

  const handleFooterChange = (index, newContent) => {
    setFooterFields(footerFields.map((field, i) => (i === index ? newContent : field)));
  };


  useEffect(() => {
    // Cargar datos del documento existente
    if (id) {
      fetch(`http://localhost:3000/api/documentos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.documento) {
            setTitle(data.documento.titulo || '');
            setDescripcion(data.documento.descripcion || '');
            setUserPrompt(data.documento.prompt_user || '');
            setContext(data.documento.contexto_base || '');
            setSections(
              Array.isArray(data.documento.puntos) 
                ? data.documento.puntos.map((content) => ({ content })) 
                : [{ content: '' }]
            );
            setHeaderFields( 
              Array.isArray(data.documento.encabezado) 
            ? data.documento.encabezado.map((content) => ({ content })) 
            : [{ content: '' }]
          );

            setFooterFields(
              Array.isArray(data.documento.piepagina) 
              ? data.documento.piepagina.map((content) => ({ content })) 
              : [{ content: '' }]
            );
          } 
          else {
            console.error('Datos inválidos:', data);
            setNotification({ type: 'error', message: 'Error al cargar los datos del documento.' });
          }
        })
        .catch((err) => {
          console.error('Error al cargar datos:', err);
          setNotification({ type: 'error', message: 'Error de conexión al cargar los datos.' });
        });
    }
  }, [id]);
  
 // Manejar el envío del formulario para actualizar el documento existente
 const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      title,
      descripcion,
      userPrompt,
      context,
      sections: sections.map((section) => section.content),
      encabezado:headerFields.map((point) => point.content),
      pie_pagina: footerFields.map((point) => point.content),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/documentos/${id}`, {
        method: 'PUT', // Método PUT para actualizar
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        setNotification({ type: 'success', message: 'Documento actualizado exitosamente' });
        navigate('/main-menu');
      } else {
        setNotification({ type: 'error', message: 'Error al actualizar el documento' });
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setNotification({ type: 'error', message: 'Error al enviar los datos' });
    }
  };

  return (
    <div className="p-10 pr-20 pl-20 bg-gray-100 min-h-screen">
              <Link 
            to="/main-menu" 
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-7 h-7" />
          </Link>
      <h1 className="text-3xl font-bold mb-4">Editar Documento Administrativo</h1>
      <p className="mb-8 text-lg text-gray-700">Modifica los datos de este documento existente según sea necesario.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Título o Tipo de Documento</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ingrese el título del documento"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Descripción rápida del documento</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Ingresa una breve descripción del documento"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Prompt del Usuario</label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Escribe el objeto o el tema el cual el sistema se basará para generar el documento"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Contexto Base</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Especifica el contexto base para el chat de OpenAI"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Puntos del Documento</h3>
          {sections.map((section, index) => (
            <div key={index} className="flex items-start space-x-2 mt-4">
              <textarea
                value={section.content}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="3"
                placeholder={`Punto ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddSection}
              className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              +
            </button>
          </div>
        </div>
        {/* Campos de Encabezado */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Encabezados del Documento</h3>
          {headerFields.map((field, index) => (
            <div key={index} className="flex items-start space-x-2 mt-4">
              <textarea
                value={field.content}
                onChange={(e) => handleHeaderChange(index, { content: e.target.value })}
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="2"
                placeholder={`Encabezado ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => setHeaderFields(headerFields.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setHeaderFields([...headerFields, { content: '' }])}
              className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pies de Página del Documento</h3>
          {footerFields.map((field, index) => (
            <div key={index} className="flex items-start space-x-2 mt-4">
              <textarea
                value={field.content}
                onChange={(e) => handleFooterChange(index, { content: e.target.value })}
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="2"
                placeholder={`Pie de página ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => setFooterFields(footerFields.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setFooterFields([...footerFields, { content: '' }])}
              className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              +
            </button>
          </div>
          
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}