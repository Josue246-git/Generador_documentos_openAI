import React, { useState, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, Packer } from 'docx';
import { Loader2, Home } from "lucide-react"; // Añadido el ícono Home

export default function DocumentGenerator() {
  
  const location = useLocation();
  const document = location.state?.document || {};
  const [objDoc, setObjDoc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [points, setPoints] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [correctionHistory, setCorrectionHistory] = useState({});// Nuevo estado para manejar el historial de correcciones
  const [headerFields, setHeaderFields] = useState([]);
  const [footerFields, setFooterFields] = useState([]);
  const [headerInputs, setHeaderInputs] = useState({});
  const [footerInputs, setFooterInputs] = useState({});

  function processJSONData(data) {
    // Asegurarse de que los datos son un objeto
    if (!data || typeof data !== 'object') {
      console.error("Error: la estructura de datos no es válida.");
      return [];
    }
  
    const points = [];
  
    // Función recursiva para procesar arrays en cualquier nivel
    function processArray(arr) {
      arr.forEach((section) => {
        const id = section.id || "Sin ID";
        const title = section.title || "Sin título";
  
        // Concatenar todos los campos de contenido (`content`, `content2`, `content3`, etc.)
        let concatenatedContent = "";
        let contentFields = Object.keys(section).filter((field) => field.startsWith("content"));
        contentFields.forEach((field) => {
          concatenatedContent += section[field] ? section[field] + " " : "";
        });
        concatenatedContent = concatenatedContent.trim();
  
        // Detectar si el contenido concatenado es una tabla o un array de cadenas
        let isTable = false;
        let tableHeaders = [];
        let tableRows = [];
  
        if (Array.isArray(section.content) && section.content.every(item => typeof item === 'object')) {
          isTable = true;
          tableHeaders = Object.keys(section.content[0]);
          tableRows = section.content.map(row => Object.values(row));
        } else if (Array.isArray(section.content) && section.content.every(item => typeof item === 'string')) {
          concatenatedContent = section.content.join(" ");
        }
  
        points.push({
          id,
          title,
          content: isTable ? { type: "table", headers: tableHeaders, rows: tableRows } : concatenatedContent,
        });
      });
    }
  
    // Recorrer cada clave del objeto data para encontrar arrays
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (Array.isArray(value)) {
        processArray(value); // Procesar si es un array
      }
    });
  
    // Si no se encuentran puntos, loguear el error
    if (points.length === 0) {
      console.error("Error: no se encontraron arrays en los datos.");
      return [];
    }
  
    return points;
  }
  

  const handleChangeContent = (index, newContent) => {
    setPoints((prevPoints) =>
      prevPoints.map((point, i) =>
        i === index ? { ...point, content: newContent } : point
      )
    );
  };

  
  const handleEditCorrectionHistory = (index, versionIndex, newContent) => {
    setCorrectionHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory };
      updatedHistory[index] = [...updatedHistory[index]];
      updatedHistory[index][versionIndex] = newContent;
      return updatedHistory;
    });
  };

  const handleUserInputChange = (pointId, value) => {
    setUserInputs((prevInputs) => ({ ...prevInputs, [pointId]: value }));
  };


  const handleTableCellChange = (pointIndex, rowIndex, cellIndex, newValue) => {
    setPoints((prevPoints) => {
      const updatedPoints = [...prevPoints];
      updatedPoints[pointIndex].content.rows[rowIndex][cellIndex] = newValue;
      return updatedPoints;
    });
  };

  //Cargar datos de encaabezado y pie de pagina
  useEffect(() => {
    console.log('Id del documento:', document.id);  
    if (!document.id) return;
    fetch(`http://localhost:3000/api/documentos/${document.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos de encabezado y pie de página:', data.documento.encabezado, data.documento.piepagina);
        setHeaderFields(data.documento.encabezado || []);
        setFooterFields(data.documento.piepagina || []);
      })
      .catch((error) => {
        console.error('Error al cargar datos de encabezado y pie de página:', error);
      }
    );
  }, [document.id]); 

  // Manejar cambios en inputs del encabezado
  const handleHeaderInputChange = (field, value) => {
    setHeaderInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en inputs del pie de página
  const handleFooterInputChange = (field, value) => {
    setFooterInputs((prev) => ({ ...prev, [field]: value }));
  };


// generar el informe
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const documentId = document.id;

    const requestData = { documentoId: documentId, objDoc };

    try {
      const response = await fetch('http://localhost:3000/api/generateDoc', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json(); 
        // Parsear el campo `response` dentro de `data`
      const parsedResponse = JSON.parse(data.response);
      console.log('parsedResponse:', parsedResponse); 

      const processedPoints = processJSONData(parsedResponse);
      // const processedPoints = processJSONData(simalaData);
      console.log('processedPoints:', processedPoints);
      setPoints(processedPoints);
      
      // CAMBIO IMPORTANTE: Mantener los valores actuales de los inputs
      const currentHeaderFields = parsedResponse.header || headerFields;
      const currentFooterFields = parsedResponse.footer || footerFields;
      
      setHeaderFields(currentHeaderFields);
      setFooterFields(currentFooterFields);

      // Preservar los valores actuales de los inputs
      const preservedHeaderInputs = {};
      const preservedFooterInputs = {};

      currentHeaderFields.forEach(field => {
        preservedHeaderInputs[field] = headerInputs[field] || '';
      });

      currentFooterFields.forEach(field => {
        preservedFooterInputs[field] = footerInputs[field] || '';
      });

      setHeaderInputs(preservedHeaderInputs);
      setFooterInputs(preservedFooterInputs);

    } 
    catch (error) {
      console.error('Error generating report:', error);
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleRequestChange = async (index) => {
    const userRequest = userInputs[index];
    if (!userRequest) return;
  
    setLoadingIndex(index);
  
    try {
      const response = await fetch("http://localhost:3000/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentoId: document.id,
          titulo: points[index].title,
          contenido: points[index].content,
          solicitud: userRequest,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Update points with new content
        setPoints((prev) =>
          prev.map((point, i) =>
            i === index ? { ...point, content: data.correctedContent } : point
          )
        );
  
        // Update correction history - now adding new versions at the end
        setCorrectionHistory((prev) => ({
          ...prev,
          [index]: [...(prev[index] || []), points[index].content],
        }));
  
        setUserInputs((prev) => ({ ...prev, [index]: "" }));
      } else {
        console.error("Error en la respuesta:", data.message);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de cambio:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

// Generar el documento de Word

const handleGenerateWordDocument = async () => {
  setIsGeneratingWord(true);

  try {
    const doc = new Document({
      creator: "Tu Aplicación",
      title: "Documento Generado",
      description: "Documento generado automáticamente",
      sections: []
    });

    if (!points || points.length === 0) {
      throw new Error('No hay puntos para generar el documento');
    }

    const sections = [];

    // Generar encabezado con los inputs del usuario
    headerFields.forEach((headerField, index) => {
      const headerValue = headerInputs[headerField] || '';
      if (headerValue.trim()) {
        // Añadir el nombre del campo como título
        sections.push(
          new Paragraph({
            text: headerField,
            heading: HeadingLevel.HEADING_2,
          })
        );
        // Añadir el valor del input
        sections.push(
          new Paragraph({
            text: headerValue,
          })
        );
      }
    });

    // Generar puntos
    points.forEach((point, index) => {
      sections.push(
        new Paragraph({
          text: `${point.id}. ${point.title}`,
          heading: HeadingLevel.HEADING_2,
        })
      );

      if (point.content?.type === "table" && Array.isArray(point.content.rows)) {
        const table = new Table({
          rows: [
            new TableRow({
              children: (point.content.headers || []).map(
                (header) =>
                  new TableCell({
                    children: [new Paragraph({ text: header || '', bold: true })],
                  })
              ),
            }),
            ...(point.content.rows || []).map((row) =>
              new TableRow({
                children: row.map(
                  (cell) =>
                    new TableCell({
                      children: [new Paragraph({ text: cell || '' })],
                    })
                ),
              })
            ),
          ],
        });
        sections.push(table);
      } else {
        sections.push(
          new Paragraph({
            text: typeof point.content === 'string' ? point.content : '',
            spacing: { after: 200 },
          })
        );
      }
    });

    // Generar pie de página con los inputs del usuario
    footerFields.forEach((footerField, index) => {
      const footerValue = footerInputs[footerField] || '';
      if (footerValue.trim()) {
        // Añadir el nombre del campo como título
        sections.push(
          new Paragraph({
            text: footerField,
            heading: HeadingLevel.HEADING_2,
          })
        );
        // Añadir el valor del input
        sections.push(
          new Paragraph({
            text: footerValue,
          })
        );
      }
    });

    doc.addSection({
      properties: {},
      children: sections,
    });

    const blob = await Packer.toBlob(doc);
    const docBlob = new Blob([blob], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const link = window.document.createElement("a"); 
    link.href = URL.createObjectURL(docBlob);
    link.download = "documento_generado.docx";
    link.click();
    
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);

  } catch (error) {
    console.error('Error al generar el documento:', error);
  } finally {
    setIsGeneratingWord(false);
  }
};


return (
  <div className="p-8 bg-gray-100 min-h-screen ">
    <div className="max-w-6xl mx-auto space-y-8"> {/* Añadir este div contenedor */}
    <div className="flex justify-between items-center mb-8">
          <Link 
            to="/main-menu" 
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-7 h-7" />
          </Link>
          <h1 className="text-3xl font-bold text-center">
            Generador de: {document.titulo}
          </h1>
    </div>

    <form onSubmit={handleGenerateReport} className="space-y-4">
      <label className="block text-m font-medium text-gray-900">
        {document.prompt_user}:
      </label>
      <textarea
        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="5"
        placeholder={document.prompt_user || "Ingrese los detalles..."}
        value={objDoc}
        onChange={(e) => setObjDoc(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar Informe'
        )}
      </button>
    </form>

    <div className="output space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Resultados de Puntos Generados:</h3>
      
      {points.map((point, pointIndex) => (
        <div key={pointIndex} className="bg-white p-4 rounded-md shadow-md space-y-4 border border-gray-300">
          <h3 className="text-lg font-semibold">{point.id}. {point.title}</h3>
          
          {/* Original Content */}
          <div className="space-y-2">
            <p className="text-md font-semibold">Respuesta actualizada:</p>
            {point.content.type === "table" ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {point.content.headers.map((header, headerIndex) => (
                      <th key={headerIndex} className="px-4 py-2 border border-gray-300 bg-gray-200 font-semibold text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {point.content.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 border border-gray-300">
                          <textarea
                            value={cell}
                            onChange={(e) => handleTableCellChange(pointIndex, rowIndex, cellIndex, e.target.value)}
                            className="w-full p-2 border-gray-300 rounded-md resize-none"
                            rows="3"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="5"
                value={point.content}
                onChange={(e) => handleChangeContent(pointIndex, e.target.value)}
              />
            )}
          </div>

          {/* Correction History - Now showing in chronological order */}
          {/* {correctionHistory[pointIndex] && correctionHistory[pointIndex].map((versionContent, versionIndex) => (
            <div key={versionIndex} className="space-y-2">
              <p className="text-md font-semibold">
                Versión {versionIndex + 2}:
              </p>
              <textarea
                value={versionContent}
                onChange={(e) => handleEditCorrectionHistory(pointIndex, versionIndex, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="5"
              />
            </div>
          ))} */}

          {/* New Change Request Section */}
          <div className="mt-4 space-y-2">
            <textarea
              value={userInputs[pointIndex] || ''}
              onChange={(e) => handleUserInputChange(pointIndex, e.target.value)}
              className="w-full p-2 border border-purple-700 rounded-md"
              placeholder="Escriba su solicitud de cambio aquí..."
              rows="3"
              required
            />
            <button
              onClick={() => handleRequestChange(pointIndex)}
              disabled={loadingIndex === pointIndex || correctionHistory[pointIndex]?.length >= 7}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loadingIndex === pointIndex ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : correctionHistory[pointIndex]?.length >= 7 ? (
                "Máximo de 7 correcciones alcanzado"
              ) : (
                "Reescribir"
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
    
{/* Sección de Encabezado */}
      <div  className="bg-white p-4 rounded-md shadow-md space-y-4 border border-gray-300">
        
      <div className="mb-8 mt-4"> 
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Encabezado</h2>
          <p className="text-gray-600 mb-4">
            Por favor, complete los siguientes campos para el encabezado del documento.
          </p>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {headerFields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={`header-${field}`}
                className="mb-2 text-sm font-medium text-gray-700"
              >
                {field}
              </label>
              <textarea
                    id={`header-${field}`}
                    value={headerInputs[field] || ""}
                    onChange={(e) => handleHeaderInputChange(field, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[50px]"
                    rows="1"
              />
            </div>
          ))}
        </div>
      </div>

          {/* Sección de Pie de Página */}
        <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pie de Página</h2>
        <p className="text-gray-600 mb-4">
          Por favor, complete los siguientes campos para el pie de página del documento.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {footerFields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={`footer-${field}`}
                className="mb-2 text-sm font-medium text-gray-700"
              >
                {field}
              </label>
              <textarea
                    id={`footer-${field}`}
                    value={footerInputs[field] || ""}
                    onChange={(e) => handleFooterInputChange(field, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[50px]"
                    rows="1"
              />
            </div>
          ))}
        </div>
      </div>
      </div>
    <button
      onClick={handleGenerateWordDocument}
      disabled={isGeneratingWord || points.length === 0}
      className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isGeneratingWord ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generando documento...
        </>
      ) : (
        'Generar Documento de Word'
      )}
    </button>
  </div>
  </div>
);

}

