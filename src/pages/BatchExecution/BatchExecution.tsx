import React, { useState } from 'react';
import { Play, Clock, Square, AlertCircle, CheckCircle } from 'lucide-react';

const BatchExecution = () => {
  const [selectedTechnique, setSelectedTechnique] = useState('');
  const [executionMode, setExecutionMode] = useState('');
  const [description, setDescription] = useState('');
  
  const techniques = [
    'Anonimización (valores aleatorios)',
    'Encriptación (EncryptByKey)',
    'Hashing (HASHBYTES con SHA2_256)',
    'Pseudonimización',
    'Dynamic Data Masking',
    'Tokenización'
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Ejecución Batch
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Configuración de Ejecución
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Técnica de Protección
              </label>
              <select
                className="input-field"
                value={selectedTechnique}
                onChange={(e) => setSelectedTechnique(e.target.value)}
              >
                <option value="">Seleccionar técnica...</option>
                {techniques.map((technique) => (
                  <option key={technique} value={technique}>
                    {technique}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modo de Ejecución
              </label>
              <select
                className="input-field"
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value)}
              >
                <option value="">Seleccionar modo...</option>
                <option value="immediate">Inmediato</option>
                <option value="scheduled">Programado</option>
                <option value="maintenance">Ventana de Mantenimiento</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la Ejecución
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los detalles de esta ejecución..."
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button className="btn-primary flex items-center gap-2">
                <Play className="w-4 h-4" />
                Ejecutar
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Programar
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Estado de Ejecuciones
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-800 text-sm">
                  Próxima ejecución programada: 2024-01-16 02:00 AM
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 text-sm">
                  Última ejecución completada: 125,000 registros procesados
                </span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Ejecuciones Recientes</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Anonimización Cliente A</span>
                  <span className="status-badge status-active">Completado</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Encriptación BD Financiera</span>
                  <span className="status-badge status-pending">En Proceso</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Hashing Datos Personales</span>
                  <span className="status-badge status-active">Completado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchExecution;