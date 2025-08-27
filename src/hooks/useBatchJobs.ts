import { useState, useEffect } from 'react';
import type { BatchJob } from '../types/batch.types';
import { createJobUpdate, getActionUpdate, getCurrentTimestamp } from '../services/utils/batch.utils';

const INITIAL_JOBS: BatchJob[] = [
  {
    id: '1',
    name: 'Anonimización Clientes Bancarios',
    description: 'Anonimización de datos personales de clientes del sector bancario',
    technique: 'Hashing (SHA-256)',
    sourceTable: 'customers_raw',
    targetTable: 'customers_anonymized',
    status: 'running',
    progress: 65,
    recordsTotal: 1250000,
    recordsProcessed: 812500,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: 'high',
    estimatedDuration: 180,
    createdBy: 'admin@zurich.cl',
    parameters: { algorithm: 'SHA-256', salt: 'enabled' }
  },
  {
    id: '2',
    name: 'Anonimización Transacciones Bancarias',
    description: 'Anonimización de datos de transacciones bancarias',
    technique: 'Hashing (SHA-256)',
    sourceTable: 'transactions_raw',
    targetTable: 'transactions_anonymized',
    status: 'pending',
    progress: 0,
    recordsTotal: 0,
    recordsProcessed: 0,
    startTime: undefined,
    priority: 'medium',
    estimatedDuration: 60,
    createdBy: 'admin@zurich.cl',
    parameters: { algorithm: 'SHA-256', salt: 'enabled' }
  },
];

export const useBatchJobs = () => {
  const [jobs, setJobs] = useState<BatchJob[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [selectedRows, setSelectedRows] = useState<BatchJob[]>([]);

  const handleJobAction = (jobId: string, action: string) => {
    console.log(`Ejecutando acción "${action}" en job ${jobId}`);
    
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job => {
        if (job.id !== jobId) return job;
        
        const baseUpdate = createJobUpdate(job, action);
        const actionUpdate = getActionUpdate(job, action);
        
        return {
          ...job,
          ...baseUpdate,
          ...actionUpdate,
          parameters: {
            ...job.parameters,
            ...baseUpdate.parameters,
            ...actionUpdate.parameters
          }
        };
      });
      
      return action === 'delete' 
        ? updatedJobs.filter(job => job.id !== jobId)
        : updatedJobs;
    });
  };

  const handleJobConfigured = (jobConfig: any) => {
    const job: BatchJob = {
      id: Date.now().toString(),
      name: jobConfig.name,
      description: jobConfig.description,
      technique: jobConfig.columnMappings[0]?.technique || 'No especificada',
      sourceTable: jobConfig.sourceTable,
      targetTable: jobConfig.targetTable,
      status: jobConfig.schedule.type === 'immediate' ? 'pending' : 'scheduled',
      progress: 0,
      recordsTotal: 0,
      recordsProcessed: 0,
      scheduledTime: jobConfig.schedule.datetime ? new Date(jobConfig.schedule.datetime) : undefined,
      priority: 'medium',
      estimatedDuration: 60,
      createdBy: 'current@user.cl',
      parameters: {
        columnMappings: jobConfig.columnMappings,
        filters: jobConfig.filters,
        performance: jobConfig.performance,
        validation: jobConfig.validation,
        notifications: jobConfig.notifications
      }
    };
    
    setJobs(prevJobs => [...prevJobs, job]);
  };

  // Simulación de actualizaciones en tiempo real
  const simulateJobUpdates = () => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.status === 'running') {
        const newProgress = Math.min(100, job.progress + Math.random() * 2);
        const newRecordsProcessed = Math.floor((newProgress / 100) * job.recordsTotal);
        
        const elapsedMinutes = job.startTime ? 
          (Date.now() - job.startTime.getTime()) / 60000 : 1;
        const currentThroughput = newRecordsProcessed / elapsedMinutes;
        
        const remainingRecords = job.recordsTotal - newRecordsProcessed;
        const estimatedTimeRemaining = currentThroughput > 0 ? 
          Math.round(remainingRecords / currentThroughput) : job.estimatedDuration;

        return {
          ...job,
          progress: newProgress,
          recordsProcessed: newRecordsProcessed,
          throughput: Math.round(currentThroughput),
          estimatedTimeRemaining: Math.max(0, estimatedTimeRemaining),
          status: newProgress >= 100 ? 'completed' : 'running',
          endTime: newProgress >= 100 ? new Date() : undefined,
          errorCount: (job.errorCount || 0) + (Math.random() < 0.1 ? 1 : 0)
        };
      }
      return job;
    }));
  };

  return {
    jobs,
    selectedJob,
    selectedRows,
    setSelectedJob,
    setSelectedRows,
    handleJobAction,
    handleJobConfigured,
    simulateJobUpdates
  };
};