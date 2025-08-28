import React, { useState, useEffect } from 'react';
import { Clock, User, Database, Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'batch' | 'online' | 'audit' | 'discovery' | 'admin';
  action: string;
  user: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning' | 'info';
  details?: string;
  module: string;
}

interface ActivitySummaryProps {
  className?: string;
  maxItems?: number;
  refreshInterval?: number;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  className = '',
  maxItems = 10,
  refreshInterval = 30000
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Simulación de datos de actividades recientes
  const generateMockActivities = (): ActivityItem[] => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'batch',
        action: 'Trabajo de anonimización completado',
        user: 'admin@zurich.com',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'success',
        details: 'Procesados 10,000 registros de clientes',
        module: 'Ejecución Batch'
      },
      {
        id: '2',
        type: 'online',
        action: 'Sesión de procesamiento iniciada',
        user: 'operator@zurich.com',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        status: 'info',
        details: 'Procesamiento en tiempo real activo',
        module: 'Ejecución Online'
      },
      {
        id: '3',
        type: 'discovery',
        action: 'Escaneo de datos sensibles',
        user: 'analyst@zurich.com',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        status: 'warning',
        details: 'Encontrados 15 campos con datos sensibles',
        module: 'Descubrimiento'
      },
      {
        id: '4',
        type: 'audit',
        action: 'Exportación de reporte de auditoría',
        user: 'auditor@zurich.com',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: 'success',
        details: 'Reporte mensual generado',
        module: 'Auditoría'
      },
      {
        id: '5',
        type: 'admin',
        action: 'Nuevo universo creado',
        user: 'admin@zurich.com',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        status: 'success',
        details: 'Universo "Clientes Corporativos" configurado',
        module: 'Administración'
      },
      {
        id: '6',
        type: 'batch',
        action: 'Error en trabajo de anonimización',
        user: 'operator@zurich.com',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'error',
        details: 'Fallo en conexión a base de datos',
        module: 'Ejecución Batch'
      },
      {
        id: '7',
        type: 'discovery',
        action: 'Clasificación automática completada',
        user: 'system',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'success',
        details: 'Clasificados 500 atributos según Ley 21.719',
        module: 'Descubrimiento'
      },
      {
        id: '8',
        type: 'online',
        action: 'Sesión de procesamiento finalizada',
        user: 'operator@zurich.com',
        timestamp: new Date(Date.now() - 75 * 60 * 1000),
        status: 'success',
        details: 'Procesados 2,500 registros en tiempo real',
        module: 'Ejecución Online'
      }
    ];

    return mockActivities.slice(0, maxItems);
  };

  useEffect(() => {
    const loadActivities = () => {
      setLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        setActivities(generateMockActivities());
        setLoading(false);
      }, 500);
    };

    loadActivities();

    // Configurar actualización automática
    const interval = setInterval(loadActivities, refreshInterval);

    return () => clearInterval(interval);
  }, [maxItems, refreshInterval]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'batch':
        return <Database className="w-4 h-4" />;
      case 'online':
        return <Activity className="w-4 h-4" />;
      case 'audit':
        return <Shield className="w-4 h-4" />;
      case 'discovery':
        return <AlertTriangle className="w-4 h-4" />;
      case 'admin':
        return <User className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const activityTypes = [
    { value: 'all', label: 'Todas', count: activities.length },
    { value: 'batch', label: 'Batch', count: activities.filter(a => a.type === 'batch').length },
    { value: 'online', label: 'Online', count: activities.filter(a => a.type === 'online').length },
    { value: 'audit', label: 'Auditoría', count: activities.filter(a => a.type === 'audit').length },
    { value: 'discovery', label: 'Descubrimiento', count: activities.filter(a => a.type === 'discovery').length },
    { value: 'admin', label: 'Admin', count: activities.filter(a => a.type === 'admin').length }
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Actualizado hace un momento</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === type.value
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No hay actividades recientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`border-l-4 pl-4 py-3 rounded-r-lg transition-all hover:shadow-sm ${getStatusColor(activity.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{activity.user}</span>
                        </span>
                        <span>{activity.module}</span>
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      {activity.details && (
                        <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredActivities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Ver todas las actividades
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySummary;