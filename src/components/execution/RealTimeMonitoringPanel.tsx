import React from 'react';
import { 
  Activity, 
  Clock, 
  Zap, 
  Server, 
  TrendingUp,
  Bell,
  X,
  Play,
  Square
} from 'lucide-react';

interface MonitoringMetrics {
  totalThroughput: number;
  averageJobDuration: number;
  systemLoad: number;
  queueLength: number;
  activeJobs: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  jobId?: string;
}

interface RealTimeMonitoringPanelProps {
  isMonitoring: boolean;
  metrics: MonitoringMetrics;
  notifications: Notification[];
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  onClearNotifications: () => void;
}

const RealTimeMonitoringPanel: React.FC<RealTimeMonitoringPanelProps> = ({
  isMonitoring,
  metrics,
  notifications,
  onStartMonitoring,
  onStopMonitoring,
  onClearNotifications
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header del Panel */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className={`w-6 h-6 ${isMonitoring ? 'text-green-500' : 'text-gray-400'}`} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Monitoreo en Tiempo Real
            </h2>
            <p className="text-sm text-gray-600">
              Estado: {isMonitoring ? 
                <span className="text-green-600 font-medium">Activo</span> : 
                <span className="text-gray-500">Inactivo</span>
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isMonitoring ? (
            <button
              onClick={onStopMonitoring}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4" />
              Detener
            </button>
          ) : (
            <button
              onClick={onStartMonitoring}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
          )}
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Throughput Total</p>
              <p className="text-2xl font-bold">{metrics.totalThroughput.toLocaleString()}</p>
              <p className="text-blue-200 text-xs">registros/min</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Duración Promedio</p>
              <p className="text-2xl font-bold">{Math.round(metrics.averageJobDuration)}</p>
              <p className="text-purple-200 text-xs">minutos</p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Carga del Sistema</p>
              <p className="text-2xl font-bold">{Math.round(metrics.systemLoad)}%</p>
              <p className="text-orange-200 text-xs">utilización</p>
            </div>
            <Server className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Cola de Trabajos</p>
              <p className="text-2xl font-bold">{metrics.queueLength}</p>
              <p className="text-teal-200 text-xs">pendientes</p>
            </div>
            {/* <Queue className="w-8 h-8 text-teal-200" /> */}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Trabajos Activos</p>
              <p className="text-2xl font-bold">{metrics.activeJobs}</p>
              <p className="text-green-200 text-xs">ejecutando</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Panel de Notificaciones */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Notificaciones en Tiempo Real
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay notificaciones</p>
              <p className="text-sm">Las notificaciones aparecerán aquí cuando ocurran eventos</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-3 rounded-r-lg ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.timestamp.toLocaleTimeString('es-CL')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoringPanel;