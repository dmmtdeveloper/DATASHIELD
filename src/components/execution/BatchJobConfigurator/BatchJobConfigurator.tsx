import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  Columns,
  Settings,
  Calendar,
  Clock,
  Play,
  Save,
  Eye,
  Filter,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';

interface DatabaseTable {
  name: string;
  schema: string;
  rowCount: number;
  columns: TableColumn[];
}

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isSensitive: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  sampleValues?: string[];
}

interface ColumnMapping {
  sourceColumn: string;
  technique: string;
  parameters: Record<string, any>;
  targetColumn?: string;
  preserveNull: boolean;
}

interface BatchJobConfig {
  name: string;
  description: string;
  sourceTable: string;
  targetTable: string;
  columnMappings: ColumnMapping[];
  filters: string[];
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    datetime?: string;
    cronExpression?: string;
    timezone: string;
  };
  performance: {
    batchSize: number;
    parallelThreads: number;
    memoryLimit: number;
  };
  validation: {
    enablePreview: boolean;
    sampleSize: number;
    validateIntegrity: boolean;
  };
  notifications: {
    onStart: boolean;
    onComplete: boolean;
    onError: boolean;
    recipients: string[];
  };
}

const BatchJobConfigurator: React.FC<{ onSave: (config: BatchJobConfig) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<BatchJobConfig>({
    name: '',
    description: '',
    sourceTable: '',
    targetTable: '',
    columnMappings: [],
    filters: [],
    schedule: {
      type: 'immediate',
      timezone: 'America/Santiago'
    },
    performance: {
      batchSize: 10000,
      parallelThreads: 4,
      memoryLimit: 2048
    },
    validation: {
      enablePreview: true,
      sampleSize: 100,
      validateIntegrity: true
    },
    notifications: {
      onStart: true,
      onComplete: true,
      onError: true,
      recipients: []
    }
  });

  const [availableTables] = useState<DatabaseTable[]>([
    {
      name: 'customers',
      schema: 'public',
      rowCount: 1250000,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isSensitive: false, dataClassification: 'public' },
        { name: 'rut', type: 'VARCHAR(12)', nullable: false, isPrimaryKey: false, isSensitive: true, dataClassification: 'restricted', sampleValues: ['12345678-9', '98765432-1'] },
        { name: 'nombre', type: 'VARCHAR(100)', nullable: false, isPrimaryKey: false, isSensitive: true, dataClassification: 'confidential', sampleValues: ['Juan Pérez', 'María González'] },
        { name: 'email', type: 'VARCHAR(255)', nullable: true, isPrimaryKey: false, isSensitive: true, dataClassification: 'confidential', sampleValues: ['juan@email.com', 'maria@email.com'] },
        { name: 'telefono', type: 'VARCHAR(15)', nullable: true, isPrimaryKey: false, isSensitive: true, dataClassification: 'confidential', sampleValues: ['+56912345678', '+56987654321'] },
        { name: 'fecha_nacimiento', type: 'DATE', nullable: true, isPrimaryKey: false, isSensitive: true, dataClassification: 'restricted', sampleValues: ['1985-03-15', '1990-07-22'] },
        { name: 'direccion', type: 'TEXT', nullable: true, isPrimaryKey: false, isSensitive: true, dataClassification: 'confidential', sampleValues: ['Av. Providencia 123', 'Las Condes 456'] },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, isPrimaryKey: false, isSensitive: false, dataClassification: 'internal' }
      ]
    },
    {
      name: 'transactions',
      schema: 'financial',
      rowCount: 5000000,
      columns: [
        { name: 'id', type: 'BIGINT', nullable: false, isPrimaryKey: true, isSensitive: false, dataClassification: 'public' },
        { name: 'customer_id', type: 'INTEGER', nullable: false, isPrimaryKey: false, isSensitive: false, dataClassification: 'internal' },
        { name: 'card_number', type: 'VARCHAR(19)', nullable: false, isPrimaryKey: false, isSensitive: true, dataClassification: 'restricted', sampleValues: ['4532-1234-5678-9012', '5555-4444-3333-2222'] },
        { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, isPrimaryKey: false, isSensitive: true, dataClassification: 'confidential', sampleValues: ['150.50', '2500.00'] },
        { name: 'merchant', type: 'VARCHAR(100)', nullable: false, isPrimaryKey: false, isSensitive: false, dataClassification: 'internal' },
        { name: 'transaction_date', type: 'TIMESTAMP', nullable: false, isPrimaryKey: false, isSensitive: false, dataClassification: 'internal' }
      ]
    }
  ]);

  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const techniques = [
    { id: 'hash_sha256', name: 'Hash SHA-256', category: 'Hashing', reversible: false },
    { id: 'hash_sha1', name: 'Hash SHA-1', category: 'Hashing', reversible: false },
    { id: 'hash_md5', name: 'Hash MD5', category: 'Hashing', reversible: false },
    { id: 'tokenization', name: 'Tokenización', category: 'Tokenization', reversible: true },
    { id: 'mask_partial', name: 'Masking Parcial', category: 'Masking', reversible: false },
    { id: 'mask_full', name: 'Masking Completo', category: 'Masking', reversible: false },
    { id: 'pseudonymization', name: 'Pseudonimización', category: 'Pseudonymization', reversible: true },
    { id: 'date_shifting', name: 'Date Shifting', category: 'Date', reversible: false },
    { id: 'geographic_masking', name: 'Geographic Masking', category: 'Geographic', reversible: false },
    { id: 'synthetic_data', name: 'Datos Sintéticos', category: 'Synthetic', reversible: false }
  ];

  const steps = [
    { id: 1, title: 'Información Básica', description: 'Nombre y descripción del trabajo' },
    { id: 2, title: 'Selección de Datos', description: 'Tablas y columnas a procesar' },
    { id: 3, title: 'Configuración de Técnicas', description: 'Mapeo de columnas y técnicas' },
    { id: 4, title: 'Filtros y Condiciones', description: 'Criterios de selección de datos' },
    { id: 5, title: 'Programación', description: 'Configuración de ejecución' },
    { id: 6, title: 'Rendimiento', description: 'Optimización y recursos' },
    { id: 7, title: 'Validación', description: 'Preview y verificación' }
  ];

  const getClassificationColor = (classification: string) => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      internal: 'bg-blue-100 text-blue-800',
      confidential: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-red-100 text-red-800'
    };
    return colors[classification as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTechniqueParameters = (techniqueId: string) => {
    const parameterSets = {
      hash_sha256: [
        { name: 'salt', type: 'text', label: 'Salt (opcional)', placeholder: 'Valor de salt personalizado' },
        { name: 'encoding', type: 'select', label: 'Codificación', options: ['hex', 'base64'], default: 'hex' }
      ],
      tokenization: [
        { name: 'format', type: 'select', label: 'Formato', options: ['alphanumeric', 'numeric', 'uuid'], default: 'alphanumeric' },
        { name: 'length', type: 'number', label: 'Longitud', min: 4, max: 32, default: 8 },
        { name: 'preserveFormat', type: 'checkbox', label: 'Preservar formato original', default: true }
      ],
      mask_partial: [
        { name: 'maskChar', type: 'text', label: 'Carácter de máscara', maxLength: 1, default: '*' },
        { name: 'visibleStart', type: 'number', label: 'Caracteres visibles al inicio', min: 0, max: 10, default: 2 },
        { name: 'visibleEnd', type: 'number', label: 'Caracteres visibles al final', min: 0, max: 10, default: 2 }
      ],
      date_shifting: [
        { name: 'minDays', type: 'number', label: 'Días mínimos de desplazamiento', default: -365 },
        { name: 'maxDays', type: 'number', label: 'Días máximos de desplazamiento', default: 365 },
        { name: 'preserveWeekday', type: 'checkbox', label: 'Preservar día de la semana', default: true }
      ]
    };
    return parameterSets[techniqueId as keyof typeof parameterSets] || [];
  };

  const addColumnMapping = () => {
    if (selectedTable) {
      setConfig({
        ...config,
        columnMappings: [
          ...config.columnMappings,
          {
            sourceColumn: '',
            technique: '',
            parameters: {},
            preserveNull: true
          }
        ]
      });
    }
  };

  const removeColumnMapping = (index: number) => {
    setConfig({
      ...config,
      columnMappings: config.columnMappings.filter((_, i) => i !== index)
    });
  };

  const updateColumnMapping = (index: number, field: string, value: any) => {
    const updatedMappings = [...config.columnMappings];
    updatedMappings[index] = { ...updatedMappings[index], [field]: value };
    setConfig({ ...config, columnMappings: updatedMappings });
  };

  const generatePreview = () => {
    // Simular datos de preview
    const sampleData = selectedTable?.columns.slice(0, 5).map((col, index) => {
      const mapping = config.columnMappings.find(m => m.sourceColumn === col.name);
      return {
        column: col.name,
        original: col.sampleValues?.[0] || `sample_${index}`,
        anonymized: mapping ? `[${mapping.technique}] ***` : col.sampleValues?.[0] || `sample_${index}`,
        technique: mapping?.technique || 'Sin técnica'
      };
    }) || [];
    
    setPreviewData(sampleData);
    setShowPreview(true);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return config.name.trim() !== '' && config.description.trim() !== '';
      case 2:
        return config.sourceTable !== '' && config.targetTable !== '';
      case 3:
        return config.columnMappings.length > 0 && config.columnMappings.every(m => m.sourceColumn && m.technique);
      case 5:
        return config.schedule.type === 'immediate' || (config.schedule.datetime !== undefined && config.schedule.datetime !== '');
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Trabajo *
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Ej: Anonimización Clientes Q1 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                rows={4}
                placeholder="Describe el propósito y alcance de este trabajo de anonimización..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tabla de Origen *
                </label>
                <select
                  value={config.sourceTable}
                  onChange={(e) => {
                    setConfig({ ...config, sourceTable: e.target.value });
                    const table = availableTables.find(t => t.name === e.target.value);
                    setSelectedTable(table || null);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">Seleccionar tabla...</option>
                  {availableTables.map(table => (
                    <option key={table.name} value={table.name}>
                      {table.schema}.{table.name} ({new Intl.NumberFormat('es-CL').format(table.rowCount)} registros)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tabla de Destino *
                </label>
                <input
                  type="text"
                  value={config.targetTable}
                  onChange={(e) => setConfig({ ...config, targetTable: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Ej: customers_anonymized"
                />
              </div>
            </div>

            {selectedTable && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Columnas Disponibles</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedTable.columns.map(column => (
                      <div key={column.name} className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{column.name}</span>
                          {column.isSensitive && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{column.type}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(column.dataClassification)}`}>
                          {column.dataClassification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Mapeo de Columnas y Técnicas</h3>
              <button
                onClick={addColumnMapping}
                className="btn-primary flex items-center gap-2"
                disabled={!selectedTable}
              >
                <Plus className="w-4 h-4" />
                Agregar Mapeo
              </button>
            </div>

            {config.columnMappings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay mapeos configurados. Agrega al menos uno para continuar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {config.columnMappings.map((mapping, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Mapeo #{index + 1}</h4>
                      <button
                        onClick={() => removeColumnMapping(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Columna Origen
                        </label>
                        <select
                          value={mapping.sourceColumn}
                          onChange={(e) => updateColumnMapping(index, 'sourceColumn', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                        >
                          <option value="">Seleccionar columna...</option>
                          {selectedTable?.columns.map(col => (
                            <option key={col.name} value={col.name}>
                              {col.name} ({col.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Técnica de Anonimización
                        </label>
                        <select
                          value={mapping.technique}
                          onChange={(e) => updateColumnMapping(index, 'technique', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                        >
                          <option value="">Seleccionar técnica...</option>
                          {techniques.map(tech => (
                            <option key={tech.id} value={tech.id}>
                              {tech.name} ({tech.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Columna Destino (Opcional)
                        </label>
                        <input
                          type="text"
                          value={mapping.targetColumn || ''}
                          onChange={(e) => updateColumnMapping(index, 'targetColumn', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                          placeholder="Mismo nombre si vacío"
                        />
                      </div>
                    </div>

                    {mapping.technique && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Parámetros de la Técnica</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getTechniqueParameters(mapping.technique).map(param => (
                            <div key={param.name}>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                {param.label}
                              </label>
                              {param.type === 'select' ? (
                                <select
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-800"
                                  defaultValue={param.default as string | number}
                                >
                                  {(param as { options?: string[] }).options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : param.type === 'checkbox' ? (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    defaultChecked={param.default as boolean}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activar</span>
                                </label>
                              ) : (
                                <input
                                  type={param.type}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-800"
                                  placeholder={(param as any).placeholder || ''}
                                  min={(param as { min?: number }).min}
                                  max={(param as any).max}
                                  maxLength={param.type === 'text' && 'maxLength' in param ? param.maxLength : undefined}
                                  defaultValue={param.default as string | number}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mapping.preserveNull}
                          onChange={(e) => updateColumnMapping(index, 'preserveNull', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">Preservar valores NULL</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros y Condiciones</h3>
              <p className="text-gray-600 mb-4">
                Define condiciones SQL para filtrar los datos que serán procesados.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condiciones WHERE (Opcional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                rows={4}
                placeholder="Ej: created_at >= '2024-01-01' AND status = 'active'"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Consejos para Filtros</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Usa índices en las columnas de filtro para mejor rendimiento</li>
                    <li>• Evita funciones en las condiciones WHERE cuando sea posible</li>
                    <li>• Considera el impacto en el tiempo de ejecución</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Programación de Ejecución</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Ejecución
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="immediate"
                    checked={config.schedule.type === 'immediate'}
                    onChange={(e) => setConfig({
                      ...config,
                      schedule: { ...config.schedule, type: e.target.value as any }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Ejecución Inmediata</span>
                    <p className="text-sm text-gray-600">El trabajo se ejecutará tan pronto como sea creado</p>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="scheduled"
                    checked={config.schedule.type === 'scheduled'}
                    onChange={(e) => setConfig({
                      ...config,
                      schedule: { ...config.schedule, type: e.target.value as any }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Ejecución Programada</span>
                    <p className="text-sm text-gray-600">Programa el trabajo para una fecha y hora específica</p>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="recurring"
                    checked={config.schedule.type === 'recurring'}
                    onChange={(e) => setConfig({
                      ...config,
                      schedule: { ...config.schedule, type: e.target.value as any }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Ejecución Recurrente</span>
                    <p className="text-sm text-gray-600">Configura un trabajo que se ejecute periódicamente</p>
                  </div>
                </label>
              </div>
            </div>

            {config.schedule.type === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora de Ejecución
                </label>
                <input
                  type="datetime-local"
                  value={config.schedule.datetime || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    schedule: { ...config.schedule, datetime: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}

            {config.schedule.type === 'recurring' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expresión Cron
                </label>
                <input
                  type="text"
                  value={config.schedule.cronExpression || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    schedule: { ...config.schedule, cronExpression: e.target.value }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 font-mono"
                  placeholder="0 2 * * * (Diario a las 2:00 AM)"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Formato: minuto hora día mes día_semana
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona Horaria
              </label>
              <select
                value={config.schedule.timezone}
                onChange={(e) => setConfig({
                  ...config,
                  schedule: { ...config.schedule, timezone: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option value="America/Santiago">America/Santiago (Chile)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Rendimiento</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de Lote
                </label>
                <input
                  type="number"
                  value={config.performance.batchSize}
                  onChange={(e) => setConfig({
                    ...config,
                    performance: { ...config.performance, batchSize: parseInt(e.target.value) }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  min="1000"
                  max="100000"
                  step="1000"
                />
                <p className="text-xs text-gray-600 mt-1">Registros por lote (1,000 - 100,000)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hilos Paralelos
                </label>
                <input
                  type="number"
                  value={config.performance.parallelThreads}
                  onChange={(e) => setConfig({
                    ...config,
                    performance: { ...config.performance, parallelThreads: parseInt(e.target.value) }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  min="1"
                  max="16"
                />
                <p className="text-xs text-gray-600 mt-1">Número de hilos (1 - 16)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite de Memoria (MB)
                </label>
                <input
                  type="number"
                  value={config.performance.memoryLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    performance: { ...config.performance, memoryLimit: parseInt(e.target.value) }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  min="512"
                  max="8192"
                  step="256"
                />
                <p className="text-xs text-gray-600 mt-1">Memoria máxima (512 - 8,192 MB)</p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Notificaciones</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notifications.onStart}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, onStart: e.target.checked }
                    })}
                    className="mr-3"
                  />
                  <span>Notificar al iniciar el trabajo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notifications.onComplete}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, onComplete: e.target.checked }
                    })}
                    className="mr-3"
                  />
                  <span>Notificar al completar el trabajo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notifications.onError}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, onError: e.target.checked }
                    })}
                    className="mr-3"
                  />
                  <span>Notificar en caso de error</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Validación y Preview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={config.validation.enablePreview}
                    onChange={(e) => setConfig({
                      ...config,
                      validation: { ...config.validation, enablePreview: e.target.checked }
                    })}
                    className="mr-3"
                  />
                  <span className="font-medium">Habilitar Preview de Datos</span>
                </label>

                {config.validation.enablePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño de Muestra
                    </label>
                    <input
                      type="number"
                      value={config.validation.sampleSize}
                      onChange={(e) => setConfig({
                        ...config,
                        validation: { ...config.validation, sampleSize: parseInt(e.target.value) }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                      min="10"
                      max="1000"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={config.validation.validateIntegrity}
                    onChange={(e) => setConfig({
                      ...config,
                      validation: { ...config.validation, validateIntegrity: e.target.checked }
                    })}
                    className="mr-3"
                  />
                  <span className="font-medium">Validar Integridad de Datos</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generatePreview}
                className="btn-outline flex items-center gap-2"
                disabled={config.columnMappings.length === 0}
              >
                <Eye className="w-4 h-4" />
                Generar Preview
              </button>
            </div>

            {showPreview && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Preview de Transformaciones</h4>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Columna</th>
                        <th className="text-left py-2">Valor Original</th>
                        <th className="text-left py-2">Valor Anonimizado</th>
                        <th className="text-left py-2">Técnica</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{row.column}</td>
                          <td className="py-2 font-mono text-gray-600">{row.original}</td>
                          <td className="py-2 font-mono text-blue-600">{row.anonymized}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {row.technique}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-1">Configuración Lista</h4>
                  <p className="text-sm text-green-700">
                    Tu trabajo batch está configurado y listo para ser creado. Revisa todos los pasos antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configurador de Trabajo Batch</h2>
            <p className="text-gray-600 mt-1">Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id ? 'bg-green-500 text-white' :
                  currentStep === step.id ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {steps[currentStep - 1]?.description}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step content goes here - you'll need to add all the step components */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica del Trabajo</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Trabajo *
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: Anonimización Clientes Q1 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig({...config, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                    rows={3}
                    placeholder="Descripción detallada del trabajo de anonimización..."
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Add other steps here */}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            {currentStep === steps.length ? (
              <button
                onClick={() => onSave(config)}
                disabled={!config.name || !config.sourceTable}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Guardar Trabajo
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="btn-primary"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchJobConfigurator;