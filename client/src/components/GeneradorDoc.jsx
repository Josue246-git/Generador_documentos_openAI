import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, Packer } from 'docx';
import { Loader2 } from "lucide-react"; // Using lucide-react for spinner

export default function DocumentGenerator() {
  
  const location = useLocation();
  const document = location.state?.document || {};
  const [objDoc, setObjDoc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [points, setPoints] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  // const [requestCount, setRequestCount] = useState({});
  const [correctionHistory, setCorrectionHistory] = useState({}); // Nuevo estado para manejar el historial de correcciones



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
        setPoints((prev) =>
          prev.map((point, i) =>
            i === index ? { ...point, content: data.correctedContent } : point
          )
        );
  
        setCorrectionHistory((prev) => ({
          ...prev,
          [index]: [points[index].content, ...(prev[index] || [])],
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
const generateWordDocument = () => {
  // Crear el documento con metadatos necesarios
  const doc = new Document({
    creator: "Tu Aplicación",
    title: "Documento Generado",
    description: "Documento generado automáticamente",
    sections: []
  });

  // Verificar si points existe y tiene elementos
  if (!points || points.length === 0) {
    console.error('No hay puntos para generar el documento');
    return;
  }

  // Crear contenido consolidado en una sección
  const children = points.flatMap((point, index) => {
    const sections = [];

    // Añadir título del punto
    sections.push(
      new Paragraph({
        text: `${point.id}. ${point.title}`,
        heading: HeadingLevel.HEADING_2,
      })
    );

    // Procesar contenido según su tipo
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

    // Incluir historial de correcciones si existe
    if (correctionHistory[index]) {
      correctionHistory[index].forEach((versionContent, versionIndex) => {
        sections.push(
          new Paragraph({
            text: `Corrección ${versionIndex + 1}:`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: versionContent || '',
            spacing: { after: 200 },
          })
        );
      });
    }

    return sections;
  });

  // Añadir una sección al documento con todos los elementos
  doc.addSection({
    properties: {},
    children: children.flat()
  });

  try {
    // Descargar el documento Word con manejo mejorado del Blob
    Packer.toBlob(doc).then((blob) => {
      // Crear un nuevo blob con el tipo MIME correcto
      const docBlob = new Blob([blob], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      // Usar window.document en lugar de document
      const link = window.document.createElement("a");
      link.href = URL.createObjectURL(docBlob);
      link.download = "documento_generado.docx";
      link.click();
      
      // Limpiar el objeto URL después de la descarga
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    }).catch(error => {
      console.error('Error al generar el blob:', error);
    });
  } catch (error) {
    console.error('Error al generar el documento:', error);
  }
};


  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generador de: {document.titulo}</h1>
  
      <form onSubmit={handleGenerateReport} className="space-y-4">
        <label className="block text-sm font-medium text-gray-900">
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
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none"
        >
          Generar Informe
        </button>
      </form>
  
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full" />
        </div>
      ) : (
        <div className="output space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Resultados</h3>
          
          {points.map((point, pointIndex) => (
            <div key={pointIndex} className="bg-white p-4 rounded-md shadow-md space-y-4 border border-gray-300">
              <h3 className="text-lg font-semibold">{point.id}. {point.title}</h3>
              <p className="text-md font-semibold">Versión 1: </p> 
  
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
                            onChange={(e) =>
                              handleTableCellChange(pointIndex, rowIndex, cellIndex, e.target.value)
                            }
                            className="w-full p-2  border-gray-300 rounded-md resize-none"
                            rows="3" // Puedes ajustar este valor dependiendo del tamaño de la celda
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
              )
            }

            {/* Historial de correcciones */}
            {correctionHistory[pointIndex] && correctionHistory[pointIndex].map((versionContent, versionIndex) => (
              <div key={versionIndex} className="space-y-4">
                <h3 className="text-md font-semibold">Versión {versionIndex + 2}: </h3>
                <textarea 
                  value={versionContent}
                  onChange={(e) => handleEditCorrectionHistory(pointIndex, versionIndex, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="5"
                />
              </div>
            ))} 

            {/* Solicitud de nuevo cambio */}
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
              className="py-1 px-3 bg-blue-500 text-white rounded-md mt-2"
              disabled={correctionHistory[pointIndex]?.length >= 7} // Deshabilita el botón si hay 7 correcciones
            >
              {
               correctionHistory[pointIndex]?.length >= 7 ? "Máximo de 7 correcciones alcanzado" : "Enviar cambio a la IA"
              }
              {loadingIndex === pointIndex && (
                <div className="spinner-border animate-spin ml-2 w-5 h-5 border-2 border-t-transparent border-white rounded-full" />
              )}
              
            </button>

            </div> 
          ))}
        </div>
      )}
      
      <button
        onClick={generateWordDocument}
        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 focus:outline-none"
      >
        Generar Documento de Word
      </button>
    </div>
  )
}

