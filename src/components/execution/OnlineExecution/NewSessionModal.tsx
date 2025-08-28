import React, { useState } from 'react';
import { X, Database, Globe, FileText, Activity, Plus, Trash2 } from 'lucide-react';
import type { OnlineSession, DataInputSource, DataOutputTarget, DataSchema } from '../../../types/online.types';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: OnlineSession) => void;
}

const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  onCreateSession
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technique: 'hashing'
  });

  const [inputSource, setInputSource] = useState<DataInputSource>({
    type: 'api',
    name: '',
    configuration: {
      endpoint: '',
      headers: {},
      pollInterval: 5000
    },
    schema: []
  });

  const [outputTarget, setOutputTarget] = useState<DataOutputTarget>({
    type: 'database',
    name: '',
    configuration: {
      connectionString: '',
      tableName: ''
    }
  });

  const [parameters, setParameters] = useState<Record<string, any>>({
    saltKey: '',
    preserveFormat: true
  });

  const techniques = [
    { value: 'hashing', label: 'Hashing' },
    { value: 'masking', label: 'Masking' },
    { value: 'tokenization', label: 'Tokenización' },
    { value: 'encryption', label: 'Encriptación' },
    { value: 'generalization', label: 'Generalización' }
  ];

  const inputTypes = [
    { value: 'api', label: 'API REST', icon: Globe },
    { value: 'stream', label: 'Stream/Kafka', icon: Activity },
    { value: 'database', label: 'Base de Datos', icon: Database },
    { value: 'file', label: 'Archivo', icon: FileText }
  ];

  const outputTypes = [
    { value: 'api', label: 'API REST', icon: Globe },
    { value: 'stream', label: 'Stream/Kafka', icon: Activity },
    { value: 'database', label: 'Base de Datos', icon: Database },
    { value: 'file', label: 'Archivo', icon: FileText }
  ];

  const addSchemaField = () => {
    const newField: DataSchema = {
      fieldName: '',
      dataType: 'string',
      isSensitive: false,
      required: false
    };
    setInputSource(prev => ({
      ...prev,
      schema: [...prev.schema, newField]
    }));
  };

  const removeSchemaField = (index: number) => {
    setInputSource(prev => ({
      ...prev,
      schema: prev.schema.filter((_, i) => i !== index)
    }));
  };

  const updateSchemaField = (index: number, field: Partial<DataSchema>) => {
    setInputSource(prev => ({
      ...prev,
      schema: prev.schema.map((item, i) => 
        i === index ? { ...item, ...field } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: OnlineSession = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      technique: formData.technique,
      inputSource,
      outputTarget,
      status: 'idle',
      recordsProcessed: 0,
      recordsPerSecond: 0,
      errorCount: 0,
      createdBy: 'admin', // En producción, obtener del contexto de autenticación
      parameters,
      isActive: false
    };

    onCreateSession(newSession);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Sesión Online</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Sesión *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: API Clientes - Anonimización RUT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Técnica de Anonimización *
                </label>
                <select
                  required
                  value={formData.technique}
                  onChange={(e) => setFormData(prev => ({ ...prev, technique: e.target.value }))}
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {techniques.map(tech => (
                    <option key={tech.value} value={tech.value}>{tech.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Descripción del procesamiento en tiempo real..."
              />
            </div>
          </div>

          {/* Fuente de Datos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Fuente de Datos</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-700">
              {inputTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setInputSource(prev => ({ ...prev, type: type.value as any }))}
                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      inputSource.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Fuente *
                </label>
                <input
                  type="text"
                  required
                  value={inputSource.name}
                  onChange={(e) => setInputSource(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre descriptivo"
                />
              </div>
              
              {inputSource.type === 'api' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endpoint *
                  </label>
                  <input
                    type="url"
                    required
                    value={inputSource.configuration.endpoint || ''}
                    onChange={(e) => setInputSource(prev => ({
                      ...prev,
                      configuration: { ...prev.configuration, endpoint: e.target.value }
                    }))}
                    className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://api.ejemplo.com/datos"
                  />
                </div>
              )}
              
              {inputSource.type === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cadena de Conexión *
                    </label>
                    <input
                      type="text"
                      required
                      value={inputSource.configuration.connectionString || ''}
                      onChange={(e) => setInputSource(prev => ({
                        ...prev,
                        configuration: { ...prev.configuration, connectionString: e.target.value }
                      }))}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Server=localhost;Database=MyDB;"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tabla *
                    </label>
                    <input
                      type="text"
                      required
                      value={inputSource.configuration.tableName || ''}
                      onChange={(e) => setInputSource(prev => ({
                        ...prev,
                        configuration: { ...prev.configuration, tableName: e.target.value }
                      }))}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="nombre_tabla"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Esquema de Datos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Esquema de Datos</h3>
              <button
                type="button"
                onClick={addSchemaField}
                className="px-3 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Campo
              </button>
            </div>
            
            <div className="space-y-3">
              {inputSource.schema.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nombre del Campo
                    </label>
                    <input
                      type="text"
                      value={field.fieldName}
                      onChange={(e) => updateSchemaField(index, { fieldName: e.target.value })}
                      className="w-full px-2 text-gray-700 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="campo"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={field.dataType}
                      onChange={(e) => updateSchemaField(index, { dataType: e.target.value as any })}
                      className="w-full px-2 text-gray-700 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Técnica
                    </label>
                    <select
                      value={field.anonymizationTechnique || ''}
                      onChange={(e) => updateSchemaField(index, { anonymizationTechnique: e.target.value })}
                      className="w-full px-2 text-gray-700 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!field.isSensitive}
                    >
                      <option value="">Ninguna</option>
                      {techniques.map(tech => (
                        <option key={tech.value} value={tech.value}>{tech.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-2 flex gap-2">
                    <label className="flex items-center text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.isSensitive}
                        onChange={(e) => updateSchemaField(index, { isSensitive: e.target.checked })}
                        className="mr-1"
                        style={{
                          backgroundColor: 'red'
                        }}
                      />
                      Sensible
                    </label>
                    <label className="flex items-center text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateSchemaField(index, { required: e.target.checked })}
                        className="mr-1"
                      />
                      Requerido
                    </label>
                  </div>
                  
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeSchemaField(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destino de Salida */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Destino de Salida</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-700">
              {outputTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setOutputTarget(prev => ({ ...prev, type: type.value as any }))}
                    className={`p-4 border  rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      outputTarget.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Destino *
                </label>
                <input
                  type="text"
                  required
                  value={outputTarget.name}
                  onChange={(e) => setOutputTarget(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre descriptivo"
                />
              </div>
              
              {outputTarget.type === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cadena de Conexión *
                    </label>
                    <input
                      type="text"
                      required
                      value={outputTarget.configuration.connectionString || ''}
                      onChange={(e) => setOutputTarget(prev => ({
                        ...prev,
                        configuration: { ...prev.configuration, connectionString: e.target.value }
                      }))}
                      className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Server=localhost;Database=OutputDB;"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tabla de Destino *
                    </label>
                    <input
                      type="text"
                      required
                      value={outputTarget.configuration.tableName || ''}
                      onChange={(e) => setOutputTarget(prev => ({
                        ...prev,
                        configuration: { ...prev.configuration, tableName: e.target.value }
                      }))}
                      className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="tabla_anonimizada"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Parámetros Adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Parámetros de Configuración</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clave Salt (para Hashing)
                </label>
                <input
                  type="text"
                  value={parameters.saltKey || ''}
                  onChange={(e) => setParameters(prev => ({ ...prev, saltKey: e.target.value }))}
                  className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="clave_secreta_123"
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={parameters.preserveFormat || false}
                    onChange={(e) => setParameters(prev => ({ ...prev, preserveFormat: e.target.checked }))}
                    className="mr-2"
                  />
                  Preservar Formato Original
                </label>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSessionModal;