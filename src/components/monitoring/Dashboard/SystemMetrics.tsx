import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  description: string;
  lastUpdated: Date;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  storage: number;
  throughput: number;
}

const SystemMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemMetrics();
    loadPerformanceHistory();
    
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(() => {
      loadSystemMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
      // Simular carga de métricas del sistema
      const mockMetrics: SystemMetric[] = [
        {
          id: 'cpu_usage',
          name: 'Uso de CPU',
          value: 45,
          unit: '%',
          status: 'healthy',
          trend: 'stable',
          icon: Cpu,
          description: 'Utilización promedio del procesador',
          lastUpdated: new Date()
        },
        {
          id: 'memory_usage',
          name: 'Uso de Memoria',
          value: 68,
          unit: '%',
          status: 'warning',
          trend: 'up',
          icon: Server,
          description: 'Memoria RAM utilizada',
          lastUpdated: new Date()
        },
        {
          id: 'storage_usage',
          name: 'Almacenamiento',
          value: 34,
          unit: '%',
          status: 'healthy',
          trend: 'stable',
          icon: HardDrive,
          description: 'Espacio en disco utilizado',
          lastUpdated: new Date()
        },
        {
          id: 'database_connections',
          name: 'Conexiones BD',
          value: 23,
          unit: 'activas',
          status: 'healthy',
          trend: 'stable',
          icon: Database,
          description: 'Conexiones activas a la base de datos',
          lastUpdated: new Date()
        },
        {
          id: 'active_users',
          name: 'Usuarios Activos',
          value: 12,
          unit: 'usuarios',
          status: 'healthy',
          trend: 'up',
          icon: Users,
          description: 'Usuarios conectados actualmente',
          lastUpdated: new Date()
        },
        {
          id: 'response_time',
          name: 'Tiempo de Respuesta',
          value: 245,
          unit: 'ms',
          status: 'healthy',
          trend: 'down',
          icon: Clock,
          description: 'Tiempo promedio de respuesta del sistema',
          lastUpdated: new Date()
        },
        {
          id: 'throughput',
          name: 'Rendimiento',
          value: '1.2K',
          unit: 'req/min',
          status: 'healthy',
          trend: 'up',
          icon: Activity,
          description: 'Solicitudes procesadas por minuto',
          lastUpdated: new Date()
        },
        {
          id: 'error_rate',
          name: 'Tasa de Errores',
          value: 0.3,
          unit: '%',
          status: 'healthy',
          trend: 'down',
          icon: AlertTriangle,
          description: 'Porcentaje de errores en las últimas 24 horas',
          lastUpdated: new Date()
        }
      ];

      setMetrics(mockMetrics);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading system metrics:', error);
      setIsLoading(false);
    }
  };

  const loadPerformanceHistory = async () => {
    try {
      // Simular datos históricos de rendimiento
      const history: PerformanceData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        history.push({
          timestamp: timestamp.toISOString(),
          cpu: Math.random() * 30 + 30, // 30-60%
          memory: Math.random() * 20 + 50, // 50-70%
          storage: Math.random() * 5 + 30, // 30-35%
          throughput: Math.random() * 500 + 800 // 800-1300 req/min
        });
      }
      
      setPerformanceHistory(history);
    } catch (error) {
      console.error('Error loading performance history:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Métricas del Sistema</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Métricas del Sistema</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Actualizado hace {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Métricas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className={`bg-white rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                getStatusColor(metric.status)
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                {getStatusIcon(metric.status)}
              </div>

              {/* Valor principal */}
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-2xl font-bold">
                    {typeof metric.value === 'number' && metric.value < 1 
                      ? metric.value.toFixed(1)
                      : metric.value
                    }
                  </span>
                  {metric.unit && (
                    <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                  )}
                </div>
                {getTrendIcon(metric.trend)}
              </div>

              {/* Descripción */}
              <p className="text-xs text-gray-600 mb-2">{metric.description}</p>

              {/* Última actualización */}
              <div className="text-xs text-gray-400">
                Actualizado: {metric.lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de Estado del Sistema */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado General del Sistema</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estado de Salud */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Sistema Saludable</h4>
            <p className="text-sm text-gray-600">Todos los servicios operando normalmente</p>
          </div>

          {/* Uptime */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">99.9% Uptime</h4>
            <p className="text-sm text-gray-600">Disponibilidad en los últimos 30 días</p>
          </div>

          {/* Rendimiento */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Rendimiento Óptimo</h4>
            <p className="text-sm text-gray-600">Procesamiento dentro de parámetros normales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;