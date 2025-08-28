export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  module: AuditModule;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: AuditSeverity;
  status: 'success' | 'failure' | 'warning';
  duration?: number; // en milisegundos
  metadata: Record<string, any>;
  changes?: AuditChange[];
  
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'create' | 'update' | 'delete';
}

export type AuditAction = 
  | 'login' | 'logout' | 'password_change' | 'password_reset'
  | 'create' | 'read' | 'update' | 'delete' | 'export' | 'import'
  | 'batch_job_create' | 'batch_job_start' | 'batch_job_pause' | 'batch_job_stop' | 'batch_job_delete' | 'batch_job_complete'
  | 'online_session_create' | 'online_session_start' | 'online_session_pause' | 'online_session_stop'
  | 'technique_apply' | 'technique_configure' | 'technique_test'
  | 'data_discovery' | 'data_classification' | 'data_scan'
  | 'universe_create' | 'universe_update' | 'universe_delete' | 'universe_activate' | 'universe_deactivate'
  | 'attribute_create' | 'attribute_update' | 'attribute_delete' | 'attribute_classify'
  | 'report_generate' | 'report_export' | 'report_view'
  | 'system_config' | 'user_management' | 'permission_change'
  | 'user_create' | 'user_update' | 'system_backup' | 'config_change'
  | 'audit_log_create' | 'audit_log_delete' | 'audit_log_export';

export type AuditModule = 
  | 'authentication' | 'universe_administration' | 'data_discovery' 
  | 'attribute_catalog' | 'batch_execution' | 'online_execution'
  | 'audit_trail' | 'monitoring' | 'system' | 'user_management' |'configuration';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditFilters {
    endDate?:Date;
    startDate?:Date;
    
    
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  userName?: string;
  userRole?: string;
  actions?: AuditAction[];
  modules?: AuditModule[];
  severity?: AuditSeverity[];
  status?: ('success' | 'failure' | 'warning')[];
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  searchText?: string;
  limit?: number;
  offset?: number;
  sortBy?: keyof AuditLog;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditSearchResult {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AuditExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filters: AuditFilters;
  includeFields: (keyof AuditLog)[];
  fileName?: string;
  includeMetadata: boolean;
  includeChanges: boolean;
  dateFormat?: string;
  timezone?: string;
}

export interface AuditReport {
  id: string;
  name: string;
  description: string;
  filters: AuditFilters;
  generatedAt: Date;
  generatedBy: string;
  totalRecords: number;
  filePath?: string;
  format: AuditExportConfig['format'];
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface AuditStatistics {
  totalLogs: number;
  logsToday: number;
  logsThisWeek: number;
  logsThisMonth: number;
  actionBreakdown: Record<AuditAction, number>;
  moduleBreakdown: Record<AuditModule, number>;
  severityBreakdown: Record<AuditSeverity, number>;
  statusBreakdown: Record<'success' | 'failure' | 'warning', number>;
  topUsers: Array<{
    userId: string;
    userName: string;
    actionCount: number;
  }>;
  recentActivity: AuditLog[];
  errorTrends: Array<{
    date: string;
    errorCount: number;
    totalCount: number;
    errorRate: number;
  }>;
}

export interface AuditAlert {
  id: string;
  name: string;
  description: string;
  conditions: AuditAlertCondition[];
  actions: AuditAlertAction[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AuditAlertCondition {
  field: keyof AuditLog;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AuditAlertAction {
  type: 'email' | 'webhook' | 'notification';
   
  configuration: {
    recipients?: string[];
    webhookUrl?: string;
    message?: string;
    subject?: string;
  };
}

export interface AuditDashboardData {
  statistics: AuditStatistics;
  recentAlerts: AuditAlert[];
  systemHealth: {
    auditingStatus: 'healthy' | 'warning' | 'critical';
    storageUsage: number;
    retentionCompliance: boolean;
    lastBackup?: Date;
  };
  complianceMetrics: {
    dataRetentionDays: number;
    gdprCompliance: boolean;
    iso27001Compliance: boolean;
    localLawCompliance: boolean; // Ley 21.719 y 19.628
  };
}