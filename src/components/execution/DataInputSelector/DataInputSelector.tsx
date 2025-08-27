import React, { useState } from 'react';
import { Database, Globe, FileText, Activity, Plus, Edit, Trash2, TestTube } from 'lucide-react';
import type { OnlineSession, DataSchema } from '../../../types/online.types';

interface DataInputSelectorProps {
  session: OnlineSession;
  onSessionUpdate: (session: OnlineSession) => void;
}

const DataInputSelector: React.FC<DataInputSelectorProps> = ({ session, onSessionUpdate }) => {
  const [editingSource, setEditingSource] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);

  const sourceTypes = [
    { value: 'api', label: 'API REST', icon: Globe, description: 'Conexión a API externa' },
    { value: 'stream', label: 'Stream', icon: Activity, description: 'Kafka, RabbitMQ, etc.' },
    { value: 'database', label: 'Base de Datos', icon: Database, description: 'SQL Server, PostgreSQL, etc.' },
    { value: 'file', label: 'Archivo', icon: FileText, description: 'CSV, JSON, XML' }
  ];

  const dataTypes = [
    { value: 'string', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Fecha' },
    { value: 'boolean', label: 'Booleano' },
    { value: 'object', label: 'Objeto' }
  ];

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    
    // Simular prueba de conexión
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.3 ? 'success' : 'error');
      setTestingConnection(false);
    }, 2000);
  };

  const handleAddField = () => {
    const newField: DataSchema = {
      fieldName: '',
      dataType: 'string',
      isSensitive: false,
      required: false
    };
    
    const updatedSession = {
      ...session,
      inputSource: {
        ...session.inputSource,
        schema: [...session.inputSource.schema, newField]
      }
    };
    
    onSessionUpdate(updatedSession);
  };

  const handleRemoveField = (index: number) => {
    const updatedSession = {
      ...session,
      inputSource: {
        ...session.inputSource,
        schema: session.inputSource.schema.filter((_, i) => i !== index)
      }
    };
    
    onSessionUpdate(updatedSession);
  };

  const handleFieldUpdate = (index: number, field: Partial<DataSchema>) => {
    const updatedSchema = session.inputSource.schema.map((item, i) => 
      i === index ? { ...item, ...field } : item
    );
    
    const updatedSession = {
      ...session,
      inputSource: {
        ...session.inputSource,
        schema: updatedSchema
      }
    };
    
    onSessionUpdate(updatedSession);
  };

  const getSourceIcon = (type: string) => {
    const sourceType = sourceTypes.find(s => s.value === type);
    return sourceType ? sourceType.icon : Database;
  };

  const SourceIcon = getSourceIcon(session.inputSource.type);

  return (
    <div className="space-y-6">
      {/* Source Configuration */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Fuente de Datos</h3>
          <button
            onClick={() => setEditingSource(!editingSource)}
            className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            {editingSource ? 'Guardar' : 'Editar'}
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <SourceIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-gray-900">{session.inputSource.name}</h4>
              <p className="text-sm text-gray-600">
                {sourceTypes.find(s => s.value === session.inputSource.type)?.description}
              </p>
            </div>
          </div>

          {editingSource && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Fuente
                </label>
                <input
                  type="text"
                  value={session.inputSource.name}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre descriptivo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Fuente
                </label>
                <select
                  value={session.inputSource.type}
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sourceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {session.inputSource.type === 'api' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={session.inputSource.configuration.endpoint || ''}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://api.ejemplo.com/datos"
                    />
                  </div>
                  <div>
                    <label className="block  text-sm font-medium text-gray-700 mb-1">
                      Intervalo de Consulta (ms)
                    </label>
                    <input
                      type="number"
                      value={session.inputSource.configuration.pollInterval || 5000}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>
                </>
              )}

              {session.inputSource.type === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cadena de Conexión
                    </label>
                    <input
                      type="text"
                      value={session.inputSource.configuration.connectionString || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Server=localhost;Database=MyDB;"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tabla
                    </label>
                    <input
                      type="text"
                      value={session.inputSource.configuration.tableName || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="nombre_tabla"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Test Connection */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {testingConnection ? 'Probando...' : 'Probar Conexión'}
            </button>
            
            {connectionStatus && (
              <div className={`flex items-center gap-2 text-sm ${
                connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`} />
                {connectionStatus === 'success' ? 'Conexión exitosa' : 'Error de conexión'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Schema */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Esquema de Datos</h3>
          <button
            onClick={handleAddField}
            className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Agregar Campo
          </button>
        </div>

        <div className="space-y-3">
          {session.inputSource.schema.map((field, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre del Campo
                  </label>
                  <input
                    type="text"
                    value={field.fieldName}
                    onChange={(e) => handleFieldUpdate(index, { fieldName: e.target.value })}
                    className="w-full px-2 py-1 text-gray-700 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="nombre_campo"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipo de Dato
                  </label>
                  <select
                    value={field.dataType}
                    onChange={(e) => handleFieldUpdate(index, { dataType: e.target.value as any })}
                    className="w-full px-2 py-1 text-sm border text-gray-700 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    {dataTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.isSensitive}
                      onChange={(e) => handleFieldUpdate(index, { isSensitive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Sensible</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldUpdate(index, { required: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Requerido</span>
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {field.isSensitive && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Técnica de Anonimización
                  </label>
                  <select
                    value={field.anonymizationTechnique || ''}
                    onChange={(e) => handleFieldUpdate(index, { anonymizationTechnique: e.target.value })}
                    className="w-full md:w-1/3 px-2 py-1 text-sm border text-gray-700 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar técnica</option>
                    <option value="hashing">Hashing</option>
                    <option value="masking">Masking</option>
                    <option value="tokenization">Tokenización</option>
                    <option value="encryption">Encriptación</option>
                    <option value="generalization">Generalización</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Resumen de Configuración</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Fuente:</span>
            <p className="text-blue-800">{session.inputSource.name}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Tipo:</span>
            <p className="text-blue-800">{sourceTypes.find(s => s.value === session.inputSource.type)?.label}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Campos:</span>
            <p className="text-blue-800">{session.inputSource.schema.length}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Sensibles:</span>
            <p className="text-blue-800">{session.inputSource.schema.filter(f => f.isSensitive).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputSelector;