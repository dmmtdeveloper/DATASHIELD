import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Calendar, 
  User, 
  Activity, 
  X, 
  RotateCcw,
  Search,
  ChevronDown,
  Tag,
  Settings
} from 'lucide-react';
import type { AuditFilters as AuditFiltersType, AuditLog } from '../../../types/audit.types';

interface AuditFiltersProps {
  filters: AuditFiltersType;
  onFiltersChange: (filters: AuditFiltersType) => void;
  availableLogs?: AuditLog[];
  onReset?: () => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onFiltersChange,
  availableLogs = [],
  onReset,
  className = '',
  collapsed = false,
  onToggleCollapse
}) => {
  const [localFilters, setLocalFilters] = useState<AuditFiltersType>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sincronizar filtros locales con props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Obtener valores únicos de los logs disponibles
  const uniqueUsers = Array.from(new Set(availableLogs.map(log => log.userAgent))).sort();
  const uniqueActions = Array.from(new Set(availableLogs.map(log => log.action))).sort();
  const uniqueModules = Array.from(new Set(availableLogs.map(log => log.module))).sort();
  const uniqueStatuses = Array.from(new Set(availableLogs.map(log => log.status))).sort();

  // Manejar cambios en filtros
  const handleFilterChange = (key: keyof AuditFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Resetear filtros
  const handleReset = () => {
    const resetFilters: AuditFiltersType = {
      startDate: undefined,
      endDate: undefined,
      userId: '',
      actions: [],
      modules: [],
      severity: [],
      status: [],
      searchText: '',
      ipAddress: '',
      resourceId: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset?.();
  };

  // Contar filtros activos
  const activeFiltersCount = Object.entries(localFilters).reduce((count, [key, value]) => {
    if (key === 'startDate' || key === 'endDate') {
      return value ? count + 1 : count;
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? count + 1 : count;
    }
    if (typeof value === 'string') {
      return value.trim() !== '' ? count + 1 : count;
    }
    return count;
  }, 0);

  // Formatear fecha para input
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Parsear fecha desde input
  const parseDateFromInput = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };

  if (collapsed) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Auditoría</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Básico' : 'Avanzado'}
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar
              </button>
            )}
            
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="p-4 space-y-4">
        {/* Búsqueda de texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Búsqueda general
          </label>
          <input
            type="text"
            placeholder="Buscar en acciones, usuarios, módulos..."
            value={localFilters.searchText || ''}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Rango de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha inicio
            </label>
            <input
              type="date"
              value={formatDateForInput(localFilters.startDate)}
              onChange={(e) => handleFilterChange('startDate', parseDateFromInput(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha fin
            </label>
            <input
              type="date"
              value={formatDateForInput(localFilters.endDate)}
              onChange={(e) => handleFilterChange('endDate', parseDateFromInput(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros por categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Usuarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Usuarios
            </label>
            <select
              multiple
              value={localFilters.users || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('users', values);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          {/* Acciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              Acciones
            </label>
            <select
              multiple
              value={localFilters.actions || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('actions', values);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Módulos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Módulos
            </label>
            <select
              multiple
              value={localFilters.modules || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange('modules', values);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de severidad y estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severidades
            </label>
            <div className="space-y-2">
              {['high', 'medium', 'low'].map(severity => (
                <label key={severity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(localFilters.severities || []).includes(severity)}
                    onChange={(e) => {
                      const currentSeverities = localFilters.severities || [];
                      const newSeverities = e.target.checked
                        ? [...currentSeverities, severity]
                        : currentSeverities.filter(s => s !== severity);
                      handleFilterChange('severities', newSeverities);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {severity === 'high' ? 'Alta' : severity === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Estados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estados
            </label>
            <div className="space-y-2">
              {uniqueStatuses.map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(localFilters.statuses || []).includes(status)}
                    onChange={(e) => {
                      const currentStatuses = localFilters.statuses || [];
                      const newStatuses = e.target.checked
                        ? [...currentStatuses, status]
                        : currentStatuses.filter(s => s !== status);
                      handleFilterChange('statuses', newStatuses);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Filtros Avanzados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dirección IP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección IP
                </label>
                <input
                  type="text"
                  placeholder="ej: 192.168.1.1"
                  value={localFilters.ipAddress || ''}
                  onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* ID de recurso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Recurso
                </label>
                <input
                  type="text"
                  placeholder="ej: user_123, job_456"
                  value={localFilters.resourceId || ''}
                  onChange={(e) => handleFilterChange('resourceId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con resumen */}
      {activeFiltersCount > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditFilters;