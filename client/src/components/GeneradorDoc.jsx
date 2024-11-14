import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Document, Packer, Paragraph, TextRun } from 'docx';


export default function DocumentGenerator() {
  const simalaData = {
    "informe_necesidad": [
      {
        "id": "1",
        "title": "Antecedentes",
        "content": "El Gobierno Autónomo Descentralizado de Chimborazo, en cumplimiento de sus funciones y competencias establecidas en la Constitución de la República del Ecuador y la Ley Orgánica de Gestión de Riesgos, requiere garantizar el adecuado funcionamiento de sus equipos de computación y periféricos. Históricamente, la falta de mantenimiento preventivo y correctivo ha generado interrupciones en los servicios administrativos, afectando la eficiencia operativa. Económicamente, la inversión en mantenimiento es más rentable que la adquisición de nuevos equipos, lo que justifica la necesidad de este servicio."
      },
      {
        "id": "2",
        "title": "Objetivo general",
        "content": "El objetivo general de la contratación del servicio de mantenimiento y reparación de equipos de computación y periféricos es asegurar la operatividad continua y eficiente de los recursos tecnológicos del Gobierno Autónomo Descentralizado de Chimborazo, contribuyendo así a la mejora de la gestión pública."
      },
      {
        "id": "3",
        "title": "Objetivos específicos",
        "content": [
          "1. Realizar mantenimiento preventivo y correctivo de los equipos de computación y periféricos para minimizar el tiempo de inactividad y prolongar la vida útil de los mismos.",
          "2. Garantizar la disponibilidad de soporte técnico especializado para resolver incidencias de manera oportuna, mejorando la eficiencia en la atención de los procesos administrativos."
        ]
      },
      {
        "id": "4",
        "title": "Identificación de la necesidad",
        "content": "La identificación de la necesidad se fundamenta en los siguientes puntos: 1. La frecuencia de fallas en los equipos de computación ha incrementado, lo que afecta la continuidad de las actividades administrativas. 2. La falta de un plan de mantenimiento ha llevado a un aumento en los costos de reparación y reemplazo de equipos. 3. La dependencia de la tecnología en la gestión pública requiere un servicio de mantenimiento que asegure la operatividad y eficiencia en el uso de los recursos."
      },
      {
        "id": "5",
        "title": "Justificación",
        "content": "La contratación del servicio de mantenimiento y reparación de equipos de computación y periféricos se justifica en virtud de la necesidad de garantizar la continuidad operativa de las actividades del Gobierno Autónomo Descentralizado de Chimborazo. De acuerdo con el Art. 48 del Reglamento a la Ley Orgánica del Sistema Nacional de Contratación Públicas, es imperativo asegurar que los bienes y servicios adquiridos cumplan con los estándares de calidad y eficiencia requeridos para el adecuado funcionamiento de la administración pública. Además, el cumplimiento de esta contratación permitirá optimizar los recursos económicos, evitando gastos innecesarios por fallas técnicas y garantizando un servicio público eficiente y eficaz."
      },
      {
        "id": "6",
        "title": "Especificaciones técnicas o términos de referencia",
        "content": [
          {
            "article": "1",
            "description": "Mantenimiento preventivo de equipos de computación.",        
            "CPC": "123456",
            "unit": "Servicio",
            "quantity": "12"
          },
          {
            "article": "2",
            "description": "Reparación de periféricos (impresoras, escáneres, etc.).",   
            "CPC": "123457",
            "unit": "Servicio",
            "quantity": "10"
          },
          {
            "article": "3",
            "description": "Soporte técnico especializado.",
            "CPC": "123458",
            "unit": "Servicio",
            "quantity": "1"
          }
        ]
      },
      {
        "id": "7",
        "title": "Análisis beneficio, eficiencia o efectividad",
        "content": "El análisis de eficiencia indica que la contratación de un servicio especializado en mantenimiento y reparación permitirá reducir los costos operativos a largo plazo, al evitar la compra de nuevos equipos y disminuir el tiempo de inactividad. La implementación de un plan de mantenimiento preventivo y correctivo se traduce en una mejora en la productividad del personal, al asegurar que los equipos estén siempre en condiciones óptimas para su uso. Esto, a su vez, impactará positivamente en la calidad del servicio que se brinda a la ciudadanía, cumpliendo con los principios de eficiencia y eficacia establecidos en la normativa vigente.\n\nAdicionalmente, la efectividad de esta contratación se verá reflejada en la capacidad del Gobierno Autónomo Descentralizado de Chimborazo para responder de manera ágil y eficiente a las demandas de la población, garantizando que los procesos administrativos se desarrollen sin contratiempos. La inversión en mantenimiento no solo es una medida correctiva, sino también preventiva, que asegura la sostenibilidad de los recursos tecnológicos y, por ende, la mejora continua de la gestión pública."
      },
      {
        "id": "8",
        "title": "Responsabilidad del requerimiento",
        "content": "La responsabilidad del requerimiento recae en la Dirección de Tecnología de la Información y Comunicación del Gobierno Autónomo Descentralizado de Chimborazo, que será la encargada de supervisar la ejecución del contrato, asegurando que se cumplan los términos establecidos y que los servicios prestados respondan a las necesidades operativas de la institución. Asimismo, se contará con el apoyo del Departamento de Finanzas para la gestión presupuestaria y la adecuada asignación de recursos para la contratación."
      }
    ]
  }

  const location = useLocation();
  const document = location.state?.document || {};
  const [objDoc, setObjDoc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState([]);
  const [userInputs, setUserInputs] = useState({});

// Función para procesar el JSON
// Función para procesar el JSON y detectar tablas
  function processJSONData(data) {
  if (!data || typeof data !== 'object') {
    console.error("Error: la estructura de datos no es válida.");
    return [];
  }

  const points = [];

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (Array.isArray(value)) {
      value.forEach((section) => {
        const id = section.id || "Sin ID";
        const title = section.title || "Sin título";
        const content = section.content || "Sin contenido";

        // Detecta si `content` es un array de objetos (posible tabla)
        let isTable = false;
        let tableHeaders = [];
        let tableRows = [];

        if (Array.isArray(content) && content.every(item => typeof item === 'object')) {
          isTable = true;
          // Obtén los encabezados de la tabla (las claves del primer objeto)
          tableHeaders = Object.keys(content[0]);
          // Obtén las filas de la tabla
          tableRows = content.map(row => Object.values(row));
        }

        points.push({
          id,
          title,
          content: isTable ? { type: "table", headers: tableHeaders, rows: tableRows } : content,
        });
      });
    }
  });

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

  const handleRequestChange = async (index) => {
    const userRequest = userInputs[index];
    if (!userRequest) return;
  

    const requestData = {documentoId: document.id, titulo: points[index].title, contenido: points[index].content, solicitud: userRequest};
  
    try {
      const response = await fetch('http://localhost:3000/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log('cambio:', data);
  
      if (data.success) {
        handleChangeContent(index, data.correctedContent); // Actualizar el contenido con la respuesta
        setUserInputs((prev) => ({ ...prev, [index]: '' })); // Limpiar el campo de entrada
      } else {
        console.error("Error en la respuesta:", data.message);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de cambio:", error);
    }
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



  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const documentId = document.id;

    const requestData = { documentoId: documentId, objDoc };

    try {
      // const response = await fetch('http://localhost:3000/api/generateDoc', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });
      // const data = await response.json(); 

      // console.log('data sin procesar:', data);
      //const processedPoints = processJSONData(data);

      const processedPoints = processJSONData(simalaData);
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



// Generar el documento de Word
  const generateWordDocument = () => {
    const doc = new Document();

    points.forEach((point) => {
      doc.addParagraph(new Paragraph({
        children: [
          new TextRun({ text: point.title, bold: true, size: 24 }),
          new TextRun({ text: '\n' }),
          Array.isArray(point.content) ? (
            point.content.map((paragraph, index) => (
              new Paragraph({
                children: [
                  new TextRun(paragraph),
                ]
              })
            ))
          ) : (
            new Paragraph({
              children: [
                new TextRun(point.content),
              ]
            })
          ),
        ]
      }));

      // Si es una tabla, agregamos cada fila de la tabla
      if (point.content.type === "table") {
        point.content.rows.forEach(row => {
          const rowParagraphs = row.map(cell => new TextRun(cell));
          doc.addParagraph(new Paragraph({ children: rowParagraphs }));
        });
      }
    });

    Packer.toBlob(doc).then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'documento_generado.docx';
      link.click();
    });
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

            {/* Input para la solicitud de cambio */}
              <textarea
                value={userInputs[pointIndex] || ''}
                onChange={(e) => handleUserInputChange(pointIndex, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Escriba su solicitud de cambio aquí..."
                rows="3"
              />
              <button
                onClick={() => handleRequestChange(pointIndex)}
                className="py-1 px-3 bg-blue-500 text-white rounded-md mt-2"
              >
                Enviar cambio a la IA
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