import { useState, useEffect, useCallback } from 'react';
import type { BatchJob, JobUpdate } from '../types/batch.types';
import type { MonitoringMetrics, Notification, MonitoringHookReturn } from '../types/monitoring.types';

export const useRealTimeJobMonitoring = (
  jobs: BatchJob[], 
  setJobs: React.Dispatch<React.SetStateAction<BatchJob[]>>
): MonitoringHookReturn => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    totalThroughput: 0,
    averageJobDuration: 0,
    systemLoad: 0,
    queueLength: 0,
    activeJobs: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simular actualizaciones de progreso en tiempo real
  const simulateJobProgress = useCallback(() => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.status === 'running') {
          const progressIncrement = Math.random() * 5; // 0-5% de incremento
          const newProgress = Math.min(100, job.progress + progressIncrement);
          const newRecordsProcessed = Math.floor((newProgress / 100) * job.recordsTotal);
          
          // Calcular throughput (registros por minuto)
          const elapsedTime = job.startTime ? (Date.now() - job.startTime.getTime()) / (1000 * 60) : 1;
          const throughput = Math.floor(newRecordsProcessed / elapsedTime);
          
          // Estimar tiempo restante
          const remainingRecords = job.recordsTotal - newRecordsProcessed;
          const estimatedTimeRemaining = throughput > 0 ? Math.floor(remainingRecords / throughput) : 0;
          
          // Completar trabajo si llega al 100%
          if (newProgress >= 100) {
            const completedJob = {
              ...job,
              progress: 100,
              recordsProcessed: job.recordsTotal,
              status: 'completed' as const,
              endTime: new Date()
            };
            
            // Agregar notificación de completado
            setNotifications(prev => [{
              id: Date.now().toString(),
              type: 'success',
              message: `Trabajo "${job.name}" completado exitosamente`,
              timestamp: new Date(),
              jobId: job.id
            }, ...prev.slice(0, 9)]); // Mantener solo las últimas 10 notificaciones
            
            return completedJob;
          }
          
          return {
            ...job,
            progress: newProgress,
            recordsProcessed: newRecordsProcessed,
            estimatedTimeRemaining,
            throughput
          };
        }
        return job;
      })
    );
  }, [setJobs]);

  // Calcular métricas del sistema
  const calculateMetrics = useCallback(() => {
    const runningJobs = jobs.filter(job => job.status === 'running');
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const pendingJobs = jobs.filter(job => job.status === 'pending' || job.status === 'scheduled');
    
    const totalThroughput = runningJobs.reduce((sum, job) => sum + (job.throughput || 0), 0);
    
    const averageJobDuration = completedJobs.length > 0 
      ? completedJobs.reduce((sum, job) => {
          if (job.startTime && job.endTime) {
            return sum + (job.endTime.getTime() - job.startTime.getTime()) / (1000 * 60);
          }
          return sum;
        }, 0) / completedJobs.length
      : 0;
    
    const systemLoad = Math.min(100, (runningJobs.length / Math.max(1, jobs.length)) * 100);
    
    setMetrics({
      totalThroughput,
      averageJobDuration,
      systemLoad,
      queueLength: pendingJobs.length,
      activeJobs: runningJobs.length
    });
  }, [jobs]);

  // Iniciar/detener monitoreo
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    setNotifications(prev => [{
      id: Date.now().toString(),
      type: 'info',
      message: 'Monitoreo en tiempo real iniciado',
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    setNotifications(prev => [{
      id: Date.now().toString(),
      type: 'info',
      message: 'Monitoreo en tiempo real detenido',
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Efectos para actualizaciones automáticas
  useEffect(() => {
    if (!isMonitoring) return;
    
    const progressInterval = setInterval(simulateJobProgress, 2000); // Actualizar cada 2 segundos
    const metricsInterval = setInterval(calculateMetrics, 5000); // Actualizar métricas cada 5 segundos
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(metricsInterval);
    };
  }, [isMonitoring, simulateJobProgress, calculateMetrics]);

  // Calcular métricas iniciales
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  return {
    isMonitoring,
    metrics,
    notifications,
    startMonitoring,
    stopMonitoring,
    clearNotifications
  };
};