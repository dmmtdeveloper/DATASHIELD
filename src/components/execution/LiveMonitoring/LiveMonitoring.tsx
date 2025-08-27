import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import type { OnlineSession, OnlineProcessingMetrics, RealTimeAlert } from '../../../types/online.types';

interface LiveMonitoringProps {
  session: OnlineSession;
}

const LiveMonitoring: React.FC<LiveMonitoringProps> = ({ session }) => {
  const [metrics, setMetrics] = useState<OnlineProcessingMetrics[]>([]);
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h'>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simular datos de métricas en tiempo real
  useEffect(() => {
    const generateMetric = (): OnlineProcessingMetrics => ({
      sessionId: session.id,
      timestamp: new Date(),
      recordsProcessed: Math.floor(Math.random() * 100) + 50,
      recordsPerSecond: Math.floor(Math.random() * 30) + 40,
      errorCount: Math.floor(Math.random() * 5),
      memoryUsage: Math.floor(Math.random() * 30) + 60,
      cpuUsage: Math.floor(Math.random() * 40) + 30,
      latency: Math.floor(Math.random() * 20) + 35,
      throughput: Math.floor(Math.random() * 1000) + 2000
    });

    const generateAlert = (): RealTimeAlert => {
      const alertTypes = [
        { type: 'warning' as const, message: 'Latencia alta detectada', severity: 'medium' as const },
        { type: 'error' as const, message: 'Error de conexión con fuente de datos', severity: 'high' as const },
        { type: 'info' as const, message: 'Procesamiento completado exitosamente', severity: 'low' as const },
        { type: 'error' as const, message: 'Fallo en anonimización de campo sensible', severity: 'critical' as const }
      ];
      
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      return {
        id: Date.now().toString(),
        sessionId: session.id,
        type: alert.type,
        message: alert.message,
        timestamp: new Date(),
        severity: alert.severity,
        acknowledged: false
      };
    };

    // Generar métricas iniciales
    const initialMetrics = Array.from({ length: 20 }, (_, i) => ({
      ...generateMetric(),
      timestamp: new Date(Date.now() - (19 - i) * 60000) // Últimos 20 minutos
    }));
    setMetrics(initialMetrics);

    // Generar alertas iniciales
    const initialAlerts = Array.from({ length: 5 }, generateAlert);
    setAlerts(initialAlerts);

    if (!autoRefresh || session.status !== 'running') return;

    const interval = setInterval(() => {
      // Agregar nueva métrica
      setMetrics(prev => {
        const newMetrics = [...prev.slice(-19), generateMetric()];
        return newMetrics;
      });

      // Ocasionalmente agregar nueva alerta
      if (Math.random() < 0.1) {
        setAlerts(prev => [generateAlert(), ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [session.id, session.status, autoRefresh]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getAlertIcon = (type: RealTimeAlert['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertBadge = (severity: RealTimeAlert['severity']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (severity) {
      case 'critical': return `${baseClasses} bg-red-100 text-red-800`;
      case 'high': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-blue-100 text-blue-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const currentMetrics = metrics[metrics.length - 1] || {
    recordsPerSecond: 0,
    errorCount: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    latency: 0,
    throughput: 0
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Monitoreo en Tiempo Real</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              session.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm text-gray-600">
              {session.status === 'running' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-1 text-sm border text-gray-700 border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Última hora</option>
            <option value="6h">Últimas 6 horas</option>
            <option value="24h">Últimas 24 horas</option>
          </select>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Throughput</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.recordsPerSecond}/s</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">+5.2%</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Latencia</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.latency}ms</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600">-2.1%</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Errores</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.errorCount}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">Último minuto</span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">CPU</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.cpuUsage}%</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-green-600 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${currentMetrics.cpuUsage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Memoria</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.memoryUsage}%</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${currentMetrics.memoryUsage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Total</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{currentMetrics.throughput.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">Registros</span>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Alertas Recientes</h4>
          {unacknowledgedAlerts.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {unacknowledgedAlerts.length} sin revisar
            </span>
          )}
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p>No hay alertas recientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-3 ${
                  alert.acknowledged ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        alert.acknowledged ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={getAlertBadge(alert.severity)}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded"
                    >
                      Revisar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Rendimiento</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <p>Gráfico de métricas en tiempo real</p>
            <p className="text-sm">(Implementación de gráfico pendiente)</p>
          </div>
        </div>
      </div>

      {/* Session Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Resumen de Sesión</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Inicio:</span>
            <p className="text-blue-800">
              {session.startTime ? session.startTime.toLocaleString() : 'No iniciado'}
            </p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Duración:</span>
            <p className="text-blue-800">
              {session.startTime ? 
                Math.floor((Date.now() - session.startTime.getTime()) / 60000) + ' min' : 
                '0 min'
              }
            </p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Total Procesado:</span>
            <p className="text-blue-800">{session.recordsProcessed.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Errores Totales:</span>
            <p className="text-blue-800">{session.errorCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;