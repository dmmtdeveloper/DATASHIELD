import type { BatchJob } from '../../types/batch.types';

// Utilidades de formateo
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CL').format(num);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Cálculos de estadísticas
export const calculateJobStats = (jobs: BatchJob[]) => {
  return {
    total: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    scheduled: jobs.filter(j => j.status === 'scheduled').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    paused: jobs.filter(j => j.status === 'paused').length,
    totalRecordsProcessed: jobs.reduce((acc, job) => acc + job.recordsProcessed, 0),
    totalErrors: jobs.reduce((acc, job) => acc + (job.errorCount || 0), 0),
    averageThroughput: jobs.filter(j => j.status === 'running')
      .reduce((acc, job) => acc + (job.throughput || 0), 0)
  };
};

// Utilidades para acciones de trabajos
export const createJobUpdate = (job: BatchJob, action: string) => {
  return {
    parameters: {
      ...job.parameters,
      lastModified: getCurrentTimestamp(),
      modifiedBy: 'dmmtdeveloper',
      actionHistory: [
        ...(job.parameters.actionHistory || []),
        { action, timestamp: getCurrentTimestamp(), user: 'dmmtdeveloper' }
      ]
    }
  };
};

export const getActionUpdate = (job: BatchJob, action: string): Partial<BatchJob> => {
  const actions: Record<string, Partial<BatchJob>> = {
    start: {
      status: 'running',
      startTime: new Date(),
      progress: job.progress || 0,
      throughput: 0,
      errorCount: job.errorCount || 0
    },
    pause: {
      status: 'paused',
      estimatedTimeRemaining: job.estimatedTimeRemaining || job.estimatedDuration
    },
    resume: {
      status: 'running',
      startTime: job.startTime || new Date()
    },
    stop: {
      status: 'failed',
      endTime: new Date(),
      estimatedTimeRemaining: 0,
      throughput: 0,
      parameters: {
        ...job.parameters,
        cancellationReason: 'Detenido por usuario'
      }
    },
    cancel: {
      status: 'failed',
      endTime: new Date(),
      estimatedTimeRemaining: 0,
      throughput: 0,
      parameters: {
        ...job.parameters,
        cancellationReason: 'Cancelado por usuario'
      }
    },
    retry: {
      status: 'pending',
      progress: 0,
      recordsProcessed: 0,
      startTime: undefined,
      endTime: undefined,
      estimatedTimeRemaining: job.estimatedDuration,
      throughput: 0,
      errorCount: 0,
      parameters: {
        ...job.parameters,
        retryCount: (job.parameters.retryCount || 0) + 1,
        retryTimestamp: getCurrentTimestamp()
      }
    }
  };
  
  return actions[action] || {};
};