import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Lock
} from 'lucide-react';

interface ComplianceMetric {
  id: string;
  name: string;
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending';
  percentage: number;
  lastCheck: string;
  nextCheck: string;
  description: string;
  law: string;
}

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface ComplianceStatusProps {
  refreshInterval?: number;
  showDetails?: boolean;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  refreshInterval = 300000, // 5 minutos
  showDetails = true
}) => {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Datos mock para desarrollo
  const mockMetrics: ComplianceMetric[] = [
    {
      id: '1',
      name: 'Protección de Datos Personales',
      status: 'compliant',
      percentage: 98,
      lastCheck: '2024-01-15 14:30',
      nextCheck: '2024-02-15 14:30',
      description: 'Cumplimiento de medidas de protección según Ley 19.628',
      law: 'Ley 19.628'
    },
    {
      id: '2',
      name: 'Protección de Datos Sensibles',
      status: 'compliant',
      percentage: 95,
      lastCheck: '2024-01-15 14:30',
      nextCheck: '2024-02-15 14:30',
      description: 'Cumplimiento de protección de datos sensibles según Ley 21.719',
      law: 'Ley 21.719'
    },
    {
      id: '3',
      name: 'Anonimización de Datos',
      status: 'warning',
      percentage: 87,
      lastCheck: '2024-01-15 14:30',
      nextCheck: '2024-02-15 14:30',
      description: 'Procesos de anonimización requieren revisión',
      law: 'Ley 21.719'
    },
    {
      id: '4',
      name: 'Auditoría y Trazabilidad',
      status: 'compliant',
      percentage: 100,
      lastCheck: '2024-01-15 14:30',
      nextCheck: '2024-02-15 14:30',
      description: 'Registros de auditoría completos y actualizados',
      law: 'Ley 19.628 / 21.719'
    }
  ];

  const mockAlerts: ComplianceAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Revisión de Técnicas de Anonimización',
      description: 'Algunas técnicas requieren actualización para cumplir con nuevos estándares',
      dueDate: '2024-02-01',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'info',
      title: 'Próxima Auditoría Programada',
      description: 'Auditoría trimestral de cumplimiento normativo',
      dueDate: '2024-02-15',
      priority: 'high'
    }
  ];

  useEffect(() => {
    const loadComplianceData = async () => {
      setLoading(true);
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMetrics(mockMetrics);
        setAlerts(mockAlerts);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading compliance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComplianceData();

    // Configurar actualización automática
    const interval = setInterval(loadComplianceData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusIcon = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'non-compliant':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-gray-600" size={20} />;
      default:
        return <Shield className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-compliant':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: ComplianceAlert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-600" size={16} />;
      case 'info':
        return <FileText className="text-blue-600" size={16} />;
      default:
        return <FileText className="text-gray-600" size={16} />;
    }
  };

  const getAlertColor = (type: ComplianceAlert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const overallCompliance = metrics.length > 0 
    ? Math.round(metrics.reduce((acc, metric) => acc + metric.percentage, 0) / metrics.length)
    : 0;

  const getOverallStatus = () => {
    if (overallCompliance >= 95) return { status: 'compliant', text: 'Excelente' };
    if (overallCompliance >= 85) return { status: 'warning', text: 'Bueno' };
    return { status: 'non-compliant', text: 'Requiere Atención' };
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="text-blue-600 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Estado de Cumplimiento</h3>
            <p className="text-sm text-gray-600">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            getStatusColor(getOverallStatus().status as ComplianceMetric['status'])
          }`}>
            {getStatusIcon(getOverallStatus().status as ComplianceMetric['status'])}
            <span className="ml-2">{overallCompliance}% - {getOverallStatus().text}</span>
          </div>
        </div>
      </div>

      {/* Métricas de Cumplimiento */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-800 flex items-center">
          <TrendingUp className="mr-2" size={16} />
          Métricas de Cumplimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
              } ${getStatusColor(metric.status)}`}
              onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getStatusIcon(metric.status)}
                  <span className="ml-2 font-medium text-sm">{metric.name}</span>
                </div>
                <span className="text-lg font-bold">{metric.percentage}%</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">{metric.law}</div>
              {selectedMetric === metric.id && showDetails && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                  <p className="text-xs mb-2">{metric.description}</p>
                  <div className="flex justify-between text-xs">
                    <span>Última verificación: {metric.lastCheck}</span>
                    <span>Próxima: {metric.nextCheck}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alertas de Cumplimiento */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 flex items-center">
            <AlertTriangle className="mr-2" size={16} />
            Alertas y Recordatorios
          </h4>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">{alert.title}</h5>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="mr-1" size={12} />
                        {alert.dueDate}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones Rápidas */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
            <Eye className="mr-1" size={12} />
            Ver Detalles
          </button>
          <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
            <FileText className="mr-1" size={12} />
            Generar Reporte
          </button>
          <button className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors">
            <Lock className="mr-1" size={12} />
            Configurar Alertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatus;