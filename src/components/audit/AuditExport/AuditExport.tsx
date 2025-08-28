import React, { useState, useCallback } from 'react';
import type { 
  AuditExportConfig, 
  AuditFilters, 
  AuditLog, 

} from '../../../types/audit.types';
import { 
  Download, 
  FileText, 

  FileSpreadsheet, 
  Settings, 

  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  AlertCircle,

} from 'lucide-react';

interface AuditExportProps {
  filters: AuditFilters;
  totalRecords: number;
  onExport: (config: AuditExportConfig) => Promise<void>;
  isExporting?: boolean;
}

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV', icon: FileText, description: 'Archivo de valores separados por comas' },
  { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Libro de trabajo de Microsoft Excel' },
  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Documento PDF con formato' },
  { value: 'json', label: 'JSON', icon: FileText, description: 'Formato de intercambio de datos JSON' }
] as const;

const EXPORT_FIELDS: Array<{ key: keyof AuditLog; label: string; category: string }> = [
  { key: 'timestamp', label: 'Fecha y Hora', category: 'Básico' },
  { key: 'userId', label: 'ID Usuario', category: 'Usuario' },
  { key: 'userName', label: 'Nombre Usuario', category: 'Usuario' },
  { key: 'userRole', label: 'Rol Usuario', category: 'Usuario' },
  { key: 'action', label: 'Acción', category: 'Básico' },
  { key: 'module', label: 'Módulo', category: 'Básico' },
  { key: 'resourceType', label: 'Tipo Recurso', category: 'Recurso' },
  { key: 'resourceId', label: 'ID Recurso', category: 'Recurso' },
  { key: 'resourceName', label: 'Nombre Recurso', category: 'Recurso' },
  { key: 'details', label: 'Detalles', category: 'Básico' },
  { key: 'ipAddress', label: 'Dirección IP', category: 'Técnico' },
  { key: 'userAgent', label: 'User Agent', category: 'Técnico' },
  { key: 'sessionId', label: 'ID Sesión', category: 'Técnico' },
  { key: 'severity', label: 'Severidad', category: 'Básico' },
  { key: 'status', label: 'Estado', category: 'Básico' },
  { key: 'duration', label: 'Duración', category: 'Técnico' }
];

const DATE_FORMATS = [
  { value: 'ISO', label: 'ISO 8601 (2024-01-15T10:30:00Z)' },
  { value: 'DD/MM/YYYY HH:mm:ss', label: 'DD/MM/YYYY HH:mm:ss' },
  { value: 'MM/DD/YYYY HH:mm:ss', label: 'MM/DD/YYYY HH:mm:ss' },
  { value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' }
];

const TIMEZONES = [
  { value: 'America/Santiago', label: 'Chile (CLT)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Nueva York (EST)' },
  { value: 'Europe/London', label: 'Londres (GMT)' }
];

export const AuditExport: React.FC<AuditExportProps> = ({
  filters,
  totalRecords,
  onExport,
  isExporting = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState<AuditExportConfig>({
    format: 'csv',
    filters,
    includeFields: ['timestamp', 'userName', 'action', 'module', 'details', 'status'],
    includeMetadata: false,
    includeChanges: false,
    dateFormat: 'DD/MM/YYYY HH:mm:ss',
    timezone: 'America/Santiago'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(EXPORT_FIELDS.map(field => field.category)))];
  const filteredFields = selectedCategory === 'all' 
    ? EXPORT_FIELDS 
    : EXPORT_FIELDS.filter(field => field.category === selectedCategory);

  const handleFormatChange = useCallback((format: AuditExportConfig['format']) => {
    setExportConfig(prev => ({ ...prev, format }));
  }, []);

  const handleFieldToggle = useCallback((fieldKey: keyof AuditLog) => {
    setExportConfig(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(fieldKey)
        ? prev.includeFields.filter(f => f !== fieldKey)
        : [...prev.includeFields, fieldKey]
    }));
  }, []);

  const handleSelectAllFields = useCallback(() => {
    const fieldsToSelect = selectedCategory === 'all' 
      ? EXPORT_FIELDS.map(f => f.key)
      : EXPORT_FIELDS.filter(f => f.category === selectedCategory).map(f => f.key);
    
    setExportConfig(prev => ({
      ...prev,
      includeFields: Array.from(new Set([...prev.includeFields, ...fieldsToSelect]))
    }));
  }, [selectedCategory]);

  const handleDeselectAllFields = useCallback(() => {
    const fieldsToDeselect = selectedCategory === 'all' 
      ? EXPORT_FIELDS.map(f => f.key)
      : EXPORT_FIELDS.filter(f => f.category === selectedCategory).map(f => f.key);
    
    setExportConfig(prev => ({
      ...prev,
      includeFields: prev.includeFields.filter(f => !fieldsToDeselect.includes(f))
    }));
  }, [selectedCategory]);

  const handleExport = useCallback(async () => {
    try {
      await onExport(exportConfig);
      setIsOpen(false);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  }, [exportConfig, onExport]);

  const getFormatIcon = (format: string) => {
    const formatConfig = EXPORT_FORMATS.find(f => f.value === format);
    return formatConfig?.icon || FileText;
  };

  const FormatIcon = getFormatIcon(exportConfig.format);

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || totalRecords === 0}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exportando...' : 'Exportar'}
        {totalRecords > 0 && (
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
            {totalRecords.toLocaleString()}
          </span>
        )}
      </button>

      {/* Modal de configuración */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Exportar Registros de Auditoría</h2>
                  <p className="text-sm text-gray-500">
                    {totalRecords.toLocaleString()} registros seleccionados
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Cerrar</span>
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Formato de exportación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Formato de Exportación
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {EXPORT_FORMATS.map((format) => {
                      const Icon = format.icon;
                      return (
                        <button
                          key={format.value}
                          onClick={() => handleFormatChange(format.value)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            exportConfig.format === format.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {format.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Campos a incluir */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Campos a Incluir ({exportConfig.includeFields.length} seleccionados)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="all">Todas las categorías</option>
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleSelectAllFields}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Seleccionar todo
                      </button>
                      <button
                        onClick={handleDeselectAllFields}
                        className="text-xs text-gray-600 hover:text-gray-700"
                      >
                        Deseleccionar todo
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {filteredFields.map((field) => {
                      const isSelected = exportConfig.includeFields.includes(field.key);
                      return (
                        <label
                          key={field.key}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleFieldToggle(field.key)}
                            className="sr-only"
                          />
                          <span className="text-sm text-gray-700">{field.label}</span>
                          <span className="text-xs text-gray-400">({field.category})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Configuración avanzada */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración Avanzada
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      {/* Opciones adicionales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportConfig.includeMetadata}
                            onChange={(e) => setExportConfig(prev => ({
                              ...prev,
                              includeMetadata: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Incluir metadatos</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportConfig.includeChanges}
                            onChange={(e) => setExportConfig(prev => ({
                              ...prev,
                              includeChanges: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Incluir detalles de cambios</span>
                        </label>
                      </div>

                      {/* Formato de fecha */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formato de Fecha
                          </label>
                          <select
                            value={exportConfig.dateFormat}
                            onChange={(e) => setExportConfig(prev => ({
                              ...prev,
                              dateFormat: e.target.value
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            {DATE_FORMATS.map(format => (
                              <option key={format.value} value={format.value}>
                                {format.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zona Horaria
                          </label>
                          <select
                            value={exportConfig.timezone}
                            onChange={(e) => setExportConfig(prev => ({
                              ...prev,
                              timezone: e.target.value
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            {TIMEZONES.map(tz => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Nombre de archivo personalizado */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de Archivo (opcional)
                        </label>
                        <input
                          type="text"
                          value={exportConfig.fileName || ''}
                          onChange={(e) => setExportConfig(prev => ({
                            ...prev,
                            fileName: e.target.value || undefined
                          }))}
                          placeholder={`audit_export_${new Date().toISOString().split('T')[0]}`}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumen */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Resumen de Exportación</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <div>• Formato: {EXPORT_FORMATS.find(f => f.value === exportConfig.format)?.label}</div>
                        <div>• Registros: {totalRecords.toLocaleString()}</div>
                        <div>• Campos: {exportConfig.includeFields.length}</div>
                        {exportConfig.includeMetadata && <div>• Incluye metadatos</div>}
                        {exportConfig.includeChanges && <div>• Incluye detalles de cambios</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || exportConfig.includeFields.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FormatIcon className="w-4 h-4" />
                {isExporting ? 'Exportando...' : `Exportar ${exportConfig.format.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditExport;