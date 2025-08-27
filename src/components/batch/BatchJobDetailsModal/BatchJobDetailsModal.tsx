import React from 'react';
import { X, Play, Pause, Square, RotateCcw, Trash2, Clock, Database, Settings, User, Calendar } from 'lucide-react';
import type { BatchJob } from '../../../types/batch.types';
import Button from '../../ui/Button/Button';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';

interface BatchJobDetailsModalProps {
  job: BatchJob;
  onClose: () => void;
  onJobAction: (jobId: string, action: string) => void;
}

const BatchJobDetailsModal: React.FC<BatchJobDetailsModalProps> = ({
  job,
  onClose,
  onJobAction
}) => {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'No definido';
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAvailableActions = () => {
    const actions = [];
    
    switch (job.status) {
      case 'pending':
      case 'scheduled':
        actions.push(
          { label: 'Iniciar', action: 'start', icon: Play, variant: 'primary' as const },
          { label: 'Eliminar', action: 'delete', icon: Trash2, variant: 'danger' as const }
        );
        break;
      case 'running':
        actions.push(
          { label: 'Pausar', action: 'pause', icon: Pause, variant: 'secondary' as const },
          { label: 'Detener', action: 'stop', icon: Square, variant: 'danger' as const }
        );
        break;
      case 'paused':
        actions.push(
          { label: 'Reanudar', action: 'resume', icon: Play, variant: 'primary' as const },
          { label: 'Detener', action: 'stop', icon: Square, variant: 'danger' as const }
        );
        break;
      case 'failed':
        actions.push(
          { label: 'Reintentar', action: 'retry', icon: RotateCcw, variant: 'primary' as const },
          { label: 'Eliminar', action: 'delete', icon: Trash2, variant: 'danger' as const }
        );
        break;
      case 'completed':
        actions.push(
          { label: 'Eliminar', action: 'delete', icon: Trash2, variant: 'danger' as const }
        );
        break;
    }
    
    return actions;
  };

  const handleAction = (action: string) => {
    if (action === 'delete') {
      if (window.confirm('¿Estás seguro de que deseas eliminar este trabajo?')) {
        onJobAction(job.id, action);
        onClose();
      }
    } else {
      onJobAction(job.id, action);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{job.name}</h2>
            <StatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Información General
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-gray-900">{job.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Técnica</label>
                  <p className="text-gray-900">{job.technique}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Creado por:</span>
                  <span className="text-gray-900">{job.createdBy}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Datos
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tabla Origen</label>
                  <p className="text-gray-900 font-mono text-sm">{job.sourceTable}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tabla Destino</label>
                  <p className="text-gray-900 font-mono text-sm">{job.targetTable}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total de Registros</label>
                  <p className="text-gray-900">{formatNumber(job.recordsTotal)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Progreso</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del Trabajo</span>
                <span className="text-sm font-medium text-gray-900">{job.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>{formatNumber(job.recordsProcessed)} / {formatNumber(job.recordsTotal)} registros</span>
                {job.estimatedTimeRemaining && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(job.estimatedTimeRemaining)} restante
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timing Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Inicio</span>
              </div>
              <p className="text-gray-900">{formatDate(job.startTime)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Fin</span>
              </div>
              <p className="text-gray-900">{formatDate(job.endTime)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Duración Estimada</span>
              </div>
              <p className="text-gray-900">{formatDuration(job.estimatedDuration)}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          {(job.throughput || job.errorCount !== undefined) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Métricas de Rendimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.throughput && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-green-700 mb-1">Throughput</div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatNumber(Math.round(job.throughput))} <span className="text-sm font-normal">reg/min</span>
                    </div>
                  </div>
                )}
                {job.errorCount !== undefined && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-red-700 mb-1">Errores</div>
                    <div className="text-2xl font-bold text-red-900">{formatNumber(job.errorCount)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parameters */}
          {Object.keys(job.parameters).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Parámetros de Configuración</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(job.parameters, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {getAvailableActions().map((action) => (
            <Button
              key={action.action}
              variant={action.variant}
              icon={action.icon}
              onClick={() => handleAction(action.action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchJobDetailsModal;