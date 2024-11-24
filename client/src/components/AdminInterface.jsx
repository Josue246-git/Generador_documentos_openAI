import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import {  Home } from "lucide-react"; // Añadido el ícono Home

export default function AdminInterface() {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [context, setContext] = useState('');
  const [sections, setSections] = useState([{ content: '' }]);
  const [headerPoints, setHeaderPoints] = useState([{ content: '' }]);
  const [footerPoints, setFooterPoints] = useState([{ content: '' }]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // const handleAddSection = () => {
  //   setSections([...sections, { content: '' }]);
  // };

  // const handleSectionChange = (index, newContent) => {
  //   setSections(
  //     sections.map((section, i) => 
  //       i === index ? { ...section, content: newContent } : section
  //     )
  //   );
  // };
  
  // const handleRemoveSection = (index) => {
  //   setSections(sections.filter((_, i) => i !== index));
  // };

    // Handlers generales para añadir, editar y eliminar secciones
   
    const handleAdd = (setFunc, array) => setFunc([...array, { content: '' }]);

    const handleChange = (index, newContent, setFunc, array) => {
      setFunc(array.map((item, i) => (i === index ? { ...item, content: newContent } : item)));
    };
  
    const handleRemove = (index, setFunc, array) => {
      setFunc(array.filter((_, i) => i !== index));
    };

  useEffect(() => {
    if (id) {
      // Si hay un ID, cargar datos del servidor
      fetch(`http://localhost:3000/api/document/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDescripcion(data.descripcion);
          setUserPrompt(data.userPrompt);
          setContext(data.context);
          setSections(data.sections.map((content) => ({ content })));
          setHeaderPoints(data.headerPoints.map((content) => ({ content })));
          setFooterPoints(data.footerPoints.map((content) => ({ content })));
        })
        .catch((err) => console.error('Error al cargar datos:', err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      title,
      descripcion,
      userPrompt,
      context,
      sections: sections.map((section) => section.content),
      headerPoints: headerPoints.map((point) => point.content),
      footerPoints: footerPoints.map((point) => point.content),
    };

    try {
      const response = await fetch('http://localhost:3000/api/generateEst', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();

      if (result.success) {
        setNotification({ type: 'success', message: 'Documento almacenado exitosamente en la base de datos' });
        navigate('/main-menu');
      } else {
        setNotification({ type: 'error', message: 'Error al almacenar el documento' });
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setNotification({ type: 'error', message: 'Error al enviar los datos' });
    }
  };

  const renderSection = (title, points, setPoints) => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {points.map((point, index) => (
        <div key={index} className="flex items-start space-x-2 mt-4">
          <textarea
            value={point.content}
            onChange={(e) => handleChange(index, e.target.value, setPoints, points)}
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
            placeholder={`Punto ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => handleRemove(index, setPoints, points)}
            className="text-red-600 hover:text-red-800 focus:outline-none"
          >
            <FaTrash /> {/* Icono de eliminación */}
          </button>
        </div>
      ))}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={() => handleAdd(setPoints, points)}
          className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          +
        </button>
      </div>
    </div>
  );


  return (
    <div className="p-10 pr-20 pl-20 bg-gray-100 min-h-screen">
       <Link 
            to="/main-menu" 
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-7 h-7" />
      </Link>
      <h1 className="text-3xl font-bold mb-4">Generador de Documentos Administrativos</h1>
      <p className="mb-8 text-lg text-gray-700">¡Bienvenido! Personaliza los datos para generar informes y documentos específicos.</p>
      {/* instrucciones */}
      <p className="text-lg font-semibold text-gray-800 mb-4">Instrucciones</p>
      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>Ingresa el título o tipo de documento que deseas generar.</li>
        <li>Describe el objeto o tema del documento en el campo: Prompt del Usuario.</li>
        <li>Proporciona un contexto base para el chat de OpenAI.</li>
        <li>Ingresa los puntos principales del documento en el campo Puntos del Documento.</li>
        <li>Presiona el botón Generar Documento para obtener el texto generado.</li>
      </ul>
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
          <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
            Prompt del Usuario
            <span className="ml-2 text-gray-500 cursor-pointer relative group">
              <span className="text-xl">?</span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-gray-700 text-white text-xs rounded-lg p-2 shadow-lg">
                Escribe el objeto el tema el cual el sistema se basará para generar el documento, ejem: Objeto de contratacion
              </div> 
            </span>
          </label>
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
          <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
            Contexto Base
            <span className="ml-2 text-gray-500 cursor-pointer relative group">
              <span className="text-xl">?</span>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 bg-gray-700 text-white text-xs rounded-lg p-2 shadow-lg">
                Especifica el contexto base para el chat de OpenAI. Ejemplo: You are an assistant specialized in writing informes de necesidad...
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

        {/* Puntos del Documento */}
        {renderSection('Puntos del Documento', sections, setSections)}

        {/* Puntos del Encabezado */}
        {renderSection('Puntos del Encabezado (Opcional)', headerPoints, setHeaderPoints)}

        {/* Puntos del Pie de Página */}
        {renderSection('Puntos del Pie de Página (Opcional)', footerPoints, setFooterPoints)}

        
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