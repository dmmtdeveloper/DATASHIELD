export interface BatchJob {
  id: string;
  name: string;
  description: string;
  technique: string;
  sourceTable: string;
  targetTable: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'scheduled';
  progress: number;
  recordsTotal: number;
  recordsProcessed: number;
  startTime?: Date;
  endTime?: Date;
  scheduledTime?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: number;
  createdBy: string;
  parameters: Record<string, any>;
  estimatedTimeRemaining?: number;
  throughput?: number;
  errorCount?: number;
}

export interface JobUpdate {
  jobId: string;
  progress?: number;
  recordsProcessed?: number;
  status?: BatchJob['status'];
  estimatedTimeRemaining?: number;
  throughput?: number;
  errorCount?: number;
}

export interface NewJobForm {
  name: string;
  description: string;
  technique: string;
  sourceTable: string;
  targetTable: string;
  priority: BatchJob['priority'];
  scheduledTime: string;
  parameters: Record<string, any>;
}