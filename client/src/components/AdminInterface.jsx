import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function AdminInterface() {
  const [title, setTitle] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [context, setContext] = useState('');
  const [sections, setSections] = useState([{ content: '' }]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);

  const handleAddSection = () => {
    setSections([...sections, { content: '' }]);
  };

  const handleSectionChange = (id, newContent) => {
    setSections(
      sections.map((section) => (section.id === id ? { ...section, content: newContent } : section))
    );
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      title,
      context,
      sections: sections.map((section) => section.content),
      temperature,
      maxTokens,
    };
    console.log("Request Data: ", requestData);
    // Aquí puedes hacer la llamada a la API de OpenAI
  }; 

  return (
    <div className="p-10 pr-20 pl-20 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Generador de Documentos Administrativos</h1>
      <p className="mb-8 text-lg text-gray-700">¡Bienvenido! Personaliza los datos para generar informes y documentos específicos.</p>
      
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
          <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
            Prompt del Usuario
            <span className="ml-2 text-gray-500 cursor-pointer relative group">
              <span className="text-xl">?</span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-gray-700 text-white text-xs rounded-lg p-2 shadow-lg">
                Escribe el objeto o punto el cual el sistema se basará para generar el documento, ejem: "Objeto de contratacion"
              </div> 
            </span>
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)} 
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            placeholder="Escribe el objeto o punto el cual el sistema se basará para generar el documento"
            required
          />
        </div> 


        <div>
          <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
            Contexto Base
            <span className="ml-2 text-gray-500 cursor-pointer relative group">
              <span className="text-xl">?</span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-gray-700 text-white text-xs rounded-lg p-2 shadow-lg">
                Especifica el contexto base para el chat de OpenAI. Ejemplo: "You are an assistant specialized in writing informes de necesidad..."
              </div>
            </span>
          </label>
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
                <FaTrash /> {/* Icono de eliminación */}
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

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Configuración de la API de OpenAI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Max Tokens</label>
              <input
                type="number"
                min="1"
                max="4000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generar Documento
          </button>
        </div>
      </form>
    </div>
  );
}