import React from 'react';
import {
  CheckCircle,
  Clock,
} from 'lucide-react';
import { SystemMetrics, ActivitySummary } from '../../components/monitoring/Dashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Panel de Control - Anonimización de Datos
        </h1>
        <p className="text-gray-600">Monitoreo y gestión del cumplimiento normativo</p>
      </div>
      
      {/* Alertas de Cumplimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-3" size={24} />
            <div>
              <h3 className="font-semibold text-green-800">Cumplimiento Normativo</h3>
              <p className="text-green-700 text-sm">Ley 19.628 y 21.719: Sistema operativo y conforme</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="text-blue-600 mr-3" size={24} />
            <div>
              <h3 className="font-semibold text-blue-800">Próxima Auditoría</h3>
              <p className="text-blue-700 text-sm">Programada para el 15 de Febrero 2024</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Métricas del Sistema - Componente SystemMetrics */}
      <SystemMetrics />
      
      {/* Resumen de Estados y Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Universos */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado de Universos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Anonimizados</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pendientes</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">En Proceso</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">3</span>
            </div>
          </div>
        </div>
        
        {/* Componente ActivitySummary reemplaza la sección manual */}
        <ActivitySummary />
      </div>
    </div>
  );
};

export default Dashboard;