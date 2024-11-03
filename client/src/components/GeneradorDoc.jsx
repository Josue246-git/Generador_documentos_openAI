import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function DocumentGenerator() {
  const [objetoContratacion, setObjetoContratacion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState([]); // Cada punto será un contenedor con su historial de versiones

  // Generar informe y crear puntos iniciales
  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de llamada a la API y creación de puntos
    setTimeout(() => {
      const generatedPoints = [
        { id: 1, versions: ["Punto 1 generado automáticamente"] },
        { id: 2, versions: ["Punto 2 generado automáticamente"] },
        { id: 3, versions: ["Punto 3 generado automáticamente"] },
      ];
      setPoints(generatedPoints);
      setIsLoading(false);
    }, 2000);
  };

  // Añadir una nueva versión a un punto específico
  const handleCorrectionSubmit = (index, correction) => {
    const updatedPoints = points.map((point, i) => {
      if (i === index) {
        return { ...point, versions: [...point.versions, correction] };
      }
      return point;
    });
    setPoints(updatedPoints);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generador de Informe de Necesidad</h1>

      {/* Sección de Entrada */}
      <form onSubmit={handleGenerateReport} className="space-y-4">
        <label className="block text-sm font-medium text-gray-900">
          Objeto de Contratación:
        </label>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="5"
          placeholder="Ingrese el objeto de contratación considerando el Art. 48 del nuevo Reglamento"
          value={objetoContratacion}
          onChange={(e) => setObjetoContratacion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none"
        >
          Generar Informe
        </button>
      </form>

      {/* Sección de Resultado */}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full" />
        </div>
      ) : (
        <div className="output space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Correcciones</h3>

          {points.map((point, index) => (
            <PointContainer
              key={point.id}
              point={point}
              onCorrectionSubmit={(correction) => handleCorrectionSubmit(index, correction)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para cada punto y su historial de versiones en formato de carrusel
function PointContainer({ point, onCorrectionSubmit }) {
  const [currentVersion, setCurrentVersion] = useState(0);
  const [newCorrection, setNewCorrection] = useState('');

  const handleNext = () => {
    setCurrentVersion((prevIndex) => (prevIndex + 1) % point.versions.length);
  };

  const handlePrevious = () => {
    setCurrentVersion((prevIndex) =>
      prevIndex === 0 ? point.versions.length - 1 : prevIndex - 1
    );
  };

  const handleAddCorrection = () => {
    if (newCorrection.trim()) {
      onCorrectionSubmit(newCorrection);
      setNewCorrection('');
      setCurrentVersion(point.versions.length); // Ir a la última versión
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md space-y-4 border border-gray-300">
      <h3 className="text-lg font-semibold">Punto {point.id}</h3>

      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <FaArrowLeft />
        </button>

        <div className="flex-1 text-center">
          <p>{point.versions[currentVersion]}</p>
          <p className="text-sm text-gray-500">
            Versión {currentVersion + 1} de {point.versions.length}
          </p>
        </div>

        <button
          onClick={handleNext}
          className="p-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Solicitar mejora para este punto:
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="3"
          placeholder="Describe la mejora que deseas para este punto..."
          value={newCorrection}
          onChange={(e) => setNewCorrection(e.target.value)}
        />
        <button
          onClick={handleAddCorrection}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none"
        >
          Añadir corrección
        </button>
      </div>
    </div>
  );
}
