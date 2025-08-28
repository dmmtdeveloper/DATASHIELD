import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Clock, User, Shield, FileText } from 'lucide-react';

import AuditLogsTable from '../../components/audit/AuditLogsTable';
import { mockAuditLogs, mockStatistics } from '../../data/mockAuditData';
import type { AuditLog, AuditFilters, AuditSearchResult, AuditStatistics } from '../../types/audit.types';
import AuditLogDetailModal from '../../components/audit/AuditLogDetailModal/AuditLogDetailModal';

const AuditTrail: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchResult, setSearchResult] = useState<AuditSearchResult | null>(null);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({
    limit: 50,
    offset: 0,
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuditLogs(mockAuditLogs);
    setStatistics(mockStatistics);
    setSearchResult({
      logs: mockAuditLogs,
      total: mockAuditLogs.length,
      page: 1,
      pageSize: 50,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false
    });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      const filteredLogs = mockAuditLogs.filter(log => 
        !searchText || 
        log.details.toLowerCase().includes(searchText.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        log.action.toLowerCase().includes(searchText.toLowerCase())
      );
      
      setSearchResult({
        logs: filteredLogs,
        total: filteredLogs.length,
        page: 1,
        pageSize: 50,
        totalPages: Math.ceil(filteredLogs.length / 50),
        hasNext: filteredLogs.length > 50,
        hasPrevious: false
      });
      setLoading(false);
    }, 500);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) {
      return <User className="w-4 h-4" />;
    }
    if (action.includes('batch') || action.includes('online')) {
      return <Shield className="w-4 h-4" />;
    }
    if (action.includes('data')) {
      return <Search className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failure':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (severity) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Auditoría y Trazabilidad
          </h1>
          <p className="text-gray-600">
            Registro completo de actividades y eventos del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalLogs.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.logsToday}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.statusBreakdown.failure}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.topUsers.length}</p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar en registros de auditoría..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <select className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos los usuarios</option>
                  <option value="admin">Administrador Sistema</option>
                  <option value="operator1">Juan Pérez</option>
                  <option value="analyst1">María González</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
                <select className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos los módulos</option>
                  <option value="authentication">Autenticación</option>
                  <option value="batch_execution">Ejecución Batch</option>
                  <option value="online_execution">Ejecución Online</option>
                  <option value="data_discovery">Descubrimiento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                <select className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <AuditLogsTable 
        searchResult={searchResult}
        onLogSelect={setSelectedLog}
        loading={loading}
      />


      {/* Log Detail Modal */}
       <AuditLogDetailModal 
        log={selectedLog}
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AuditTrail;