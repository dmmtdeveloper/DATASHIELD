export interface OnlineSession {
  id: string;
  name: string;
  description: string;
  technique: string;
  inputSource: DataInputSource;
  outputTarget: DataOutputTarget;
  status: 'idle' | 'running' | 'paused' | 'stopped' | 'error';
  startTime?: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsPerSecond: number;
  errorCount: number;
  createdBy: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

export interface DataInputSource {
  type: 'api' | 'stream' | 'file' | 'database';
  name: string;
  configuration: {
    endpoint?: string;
    headers?: Record<string, string>;
    connectionString?: string;
    tableName?: string;
    filePath?: string;
    format?: 'json' | 'csv' | 'xml';
    pollInterval?: number; // en milisegundos
  };
  schema: DataSchema[];
}

export interface DataOutputTarget {
  type: 'api' | 'stream' | 'file' | 'database';
  name: string;
  configuration: {
    endpoint?: string;
    headers?: Record<string, string>;
    connectionString?: string;
    tableName?: string;
    filePath?: string;
    format?: 'json' | 'csv' | 'xml';
  };
}

export interface DataSchema {
  fieldName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'object';
  isSensitive: boolean;
  anonymizationTechnique?: string;
  required: boolean;
}

export interface OnlineProcessingMetrics {
  sessionId: string;
  timestamp: Date;
  recordsProcessed: number;
  recordsPerSecond: number;
  errorCount: number;
  memoryUsage: number;
  cpuUsage: number;
  latency: number; // en milisegundos
  throughput: number;
}

export interface RealTimeAlert {
  id: string;
  sessionId: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
}

export interface OnlineSessionConfig {
  name: string;
  description: string;
  technique: string;
  inputSource: DataInputSource;
  outputTarget: DataOutputTarget;
  parameters: Record<string, any>;
  maxRecordsPerSecond?: number;
  bufferSize?: number;
  retryAttempts?: number;
  alertThresholds: {
    errorRate: number;
    latency: number;
    memoryUsage: number;
  };
}

export interface ProcessingRule {
  id: string;
  fieldName: string;
  condition: string;
  action: 'anonymize' | 'skip' | 'alert' | 'reject';
  technique?: string;
  parameters?: Record<string, any>;
}