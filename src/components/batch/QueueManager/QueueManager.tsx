import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Filter,
  RefreshCw
} from 'lucide-react';
import Button from '../../ui/Button/Button';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';
import type { BatchJob } from '../../../types/batch.types';

interface QueueManagerProps {
  jobs: BatchJob[];
  onJobsReorder: (jobs: BatchJob[]) => void;
  onPriorityChange: (jobId: string, priority: BatchJob['priority']) => void;
  onJobAction: (jobId: string, action: string) => void;
  maxConcurrentJobs?: number;
  onMaxConcurrentChange?: (max: number) => void;
}

const QueueManager: React.FC<QueueManagerProps> = ({
  jobs,
  onJobsReorder,
  onPriorityChange,
  onJobAction,
  maxConcurrentJobs = 3,
  onMaxConcurrentChange
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Filtrar y ordenar trabajos por prioridad y estado
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const priorityMatch = filterPriority === 'all' || job.priority === filterPriority;
      const statusMatch = filterStatus === 'all' || job.status === filterStatus;
      return priorityMatch && statusMatch;
    });

    // Ordenar por prioridad y luego por fecha de creación
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    return filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Si tienen la misma prioridad, ordenar por estado (pending/scheduled primero)
      const statusOrder = { 'pending': 0, 'scheduled': 1, 'running': 2, 'paused': 3, 'completed': 4, 'failed': 5 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [jobs, filterPriority, filterStatus]);

  // Estadísticas de la cola
  const queueStats = useMemo(() => {
    const pending = jobs.filter(j => j.status === 'pending' || j.status === 'scheduled');
    const running = jobs.filter(j => j.status === 'running');
    const criticalPending = pending.filter(j => j.priority === 'critical');
    
    return {
      totalInQueue: pending.length,
      running: running.length,
      criticalPending: criticalPending.length,
      estimatedWaitTime: pending.reduce((acc, job) => acc + job.estimatedDuration, 0),
      canStartMore: running.length < maxConcurrentJobs
    };
  }, [jobs, maxConcurrentJobs]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredAndSortedJobs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onJobsReorder(items);
  };

  const optimizeQueue = () => {
    const optimized = [...jobs].sort((a, b) => {
      // Prioridad crítica primero
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      
      // Luego por duración estimada (trabajos más cortos primero)
      if (a.estimatedDuration !== b.estimatedDuration) {
        return a.estimatedDuration - b.estimatedDuration;
      }
      
      // Finalmente por prioridad general
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    onJobsReorder(optimized);
  };

  const startNextJobs = () => {
    const pendingJobs = jobs.filter(j => j.status === 'pending' || j.status === 'scheduled');
    const runningCount = jobs.filter(j => j.status === 'running').length;
    const canStart = maxConcurrentJobs - runningCount;
    
    if (canStart > 0) {
      const toStart = pendingJobs.slice(0, canStart);
      toStart.forEach(job => onJobAction(job.id, 'start'));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Cola de Trabajos</h2>
          <p className="text-gray-600 text-sm">Administra prioridades y orden de ejecución</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={BarChart3}
            onClick={optimizeQueue}
            size="sm"
          >
            Optimizar Cola
          </Button>
          <Button
            variant="primary"
            icon={Play}
            onClick={startNextJobs}
            disabled={!queueStats.canStartMore || queueStats.totalInQueue === 0}
            size="sm"
          >
            Iniciar Siguientes
          </Button>
          <Button
            variant="outline"
            icon={Settings}
            onClick={() => setShowSettings(!showSettings)}
            size="sm"
          >
            Configurar
          </Button>
        </div>
      </div>

      {/* Estadísticas de la Cola */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">En Cola</p>
              <p className="text-2xl font-bold text-blue-700">{queueStats.totalInQueue}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Ejecutando</p>
              <p className="text-2xl font-bold text-green-700">{queueStats.running}/{maxConcurrentJobs}</p>
            </div>
            <Play className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Críticos</p>
              <p className="text-2xl font-bold text-red-700">{queueStats.criticalPending}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Tiempo Estimado</p>
              <p className="text-lg font-bold text-purple-700">
                {Math.floor(queueStats.estimatedWaitTime / 60)}h {queueStats.estimatedWaitTime % 60}m
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Configuración */}
      {showSettings && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Cola</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trabajos Concurrentes Máximos
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxConcurrentJobs}
                onChange={(e) => onMaxConcurrentChange?.(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Política de Priorización
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="priority">Por Prioridad</option>
                <option value="duration">Por Duración (Más Cortos Primero)</option>
                <option value="fifo">Primero en Entrar, Primero en Salir</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="scheduled">Programado</option>
            <option value="running">Ejecutando</option>
            <option value="paused">Pausado</option>
          </select>
        </div>
      </div>

      {/* Lista de Trabajos con Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs-queue">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {filteredAndSortedJobs.map((job, index) => (
                <Draggable key={job.id} draggableId={job.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white border rounded-lg p-4 transition-all ${
                        snapshot.isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-gray-400 text-sm font-mono">#{index + 1}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{job.name}</h4>
                            <p className="text-sm text-gray-600">{job.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {job.estimatedDuration}min estimado
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                {job.recordsTotal.toLocaleString()} registros
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={job.status} />
                            <PriorityBadge priority={job.priority} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={job.priority}
                            onChange={(e) => onPriorityChange(job.id, e.target.value as BatchJob['priority'])}
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="critical">Crítica</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                          </select>
                          {job.status === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Play}
                              onClick={(e) => {
                                e.stopPropagation();
                                onJobAction(job.id, 'start');
                              }}
                            >
                              Iniciar
                            </Button>
                          )}
                          {job.status === 'running' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={Pause}
                              onClick={(e) => {
                                e.stopPropagation();
                                onJobAction(job.id, 'pause');
                              }}
                            >
                              Pausar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No hay trabajos en la cola con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default QueueManager;