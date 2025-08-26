export interface MonitoringMetrics {
  totalThroughput: number;
  averageJobDuration: number;
  systemLoad: number;
  queueLength: number;
  activeJobs: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  jobId?: string;
}

export interface MonitoringHookReturn {
  isMonitoring: boolean;
  metrics: MonitoringMetrics;
  notifications: Notification[];
  startMonitoring: () => void;
  stopMonitoring: () => void;
  clearNotifications: () => void;
}