import type { AuditLog, AuditStatistics } from '../types/audit.types';

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
    userId: 'admin',
    userName: 'Administrador Sistema',
    userRole: 'admin',
    action: 'batch_job_create',
    module: 'batch_execution',
    resourceType: 'BatchJob',
    resourceId: 'job_001',
    resourceName: 'Anonimización Clientes Q1',
    details: 'Creación de trabajo batch para anonimización de datos de clientes del primer trimestre',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12345',
    severity: 'medium',
    status: 'success',
    duration: 1250,
    metadata: {
      technique: 'hashing',
      recordCount: 15000,
      estimatedDuration: 3600
    },
    changes: [
      { field: 'status', oldValue: null, newValue: 'pending', changeType: 'create' },
      { field: 'technique', oldValue: null, newValue: 'hashing', changeType: 'create' }
    ]
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
    userId: 'operator1',
    userName: 'Juan Pérez',
    userRole: 'operator',
    action: 'online_session_start',
    module: 'online_execution',
    resourceType: 'OnlineSession',
    resourceId: 'session_002',
    resourceName: 'API Clientes - Tiempo Real',
    details: 'Inicio de sesión de procesamiento en tiempo real para API de clientes',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12346',
    severity: 'low',
    status: 'success',
    duration: 850,
    metadata: {
      inputSource: 'api',
      technique: 'tokenization',
      recordsPerSecond: 45
    },
    changes: [
      { field: 'status', oldValue: 'idle', newValue: 'running', changeType: 'update' }
    ]
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1800000), // 30 minutos atrás
    userId: 'analyst1',
    userName: 'María González',
    userRole: 'analyst',
    action: 'data_discovery',
    module: 'data_discovery',
    resourceType: 'DatabaseScan',
    resourceId: 'scan_003',
    resourceName: 'Escaneo BD Producción',
    details: 'Escaneo de base de datos de producción para identificación de datos sensibles',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12347',
    severity: 'high',
    status: 'success',
    duration: 45000,
    metadata: {
      tablesScanned: 25,
      sensitiveFieldsFound: 47,
      complianceIssues: 3
    },
    changes: []
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
    userId: 'admin',
    userName: 'Administrador Sistema',
    userRole: 'admin',
    action: 'login',
    module: 'authentication',
    resourceType: 'UserSession',
    resourceId: 'login_004',
    resourceName: 'Inicio de Sesión Admin',
    details: 'Inicio de sesión exitoso del administrador del sistema',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12348',
    severity: 'low',
    status: 'success',
    duration: 500,
    metadata: {
      loginMethod: 'password',
      mfaUsed: true
    },
    changes: []
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
    userId: 'operator2',
    userName: 'Carlos Rodríguez',
    userRole: 'operator',
    action: 'technique_apply',
    module: 'attribute_catalog',
    resourceType: 'AnonymizationTechnique',
    resourceId: 'tech_005',
    resourceName: 'Aplicación Masking RUT',
    details: 'Aplicación de técnica de masking a campo RUT en catálogo de atributos',
    ipAddress: '192.168.1.115',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12349',
    severity: 'medium',
    status: 'failure',
    duration: 2100,
    metadata: {
      technique: 'masking',
      fieldType: 'rut',
      errorCode: 'INVALID_PATTERN'
    },
    changes: []
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 10800000), // 3 horas atrás
    userId: 'analyst2',
    userName: 'Ana López',
    userRole: 'analyst',
    action: 'universe_create',
    module: 'universe_administration',
    resourceType: 'Universe',
    resourceId: 'univ_006',
    resourceName: 'Universo Clientes Corporativos',
    details: 'Creación de nuevo universo para segmentación de clientes corporativos',
    ipAddress: '192.168.1.120',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12350',
    severity: 'medium',
    status: 'success',
    duration: 3200,
    metadata: {
      clientType: 'corporate',
      segmentCount: 5,
      estimatedRecords: 25000
    },
    changes: [
      { field: 'name', oldValue: null, newValue: 'Universo Clientes Corporativos', changeType: 'create' },
      { field: 'status', oldValue: null, newValue: 'active', changeType: 'create' }
    ]
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 14400000), // 4 horas atrás
    userId: 'operator1',
    userName: 'Juan Pérez',
    userRole: 'operator',
    action: 'batch_job_create',
    module: 'batch_execution',
    resourceType: 'BatchJob',
    resourceId: 'job_007',
    resourceName: 'Tokenización Datos Financieros',
    details: 'Finalización exitosa del trabajo de tokenización de datos financieros',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'sess_12351',
    severity: 'low',
    status: 'success',
    duration: 7200000,
    metadata: {
      technique: 'tokenization',
      recordsProcessed: 50000,
      successRate: 99.8
    },
    changes: [
      { field: 'status', oldValue: 'running', newValue: 'completed', changeType: 'update' },
      { field: 'endTime', oldValue: null, newValue: new Date().toISOString(), changeType: 'update' }
    ]
  }
];

export const mockStatistics: AuditStatistics = {
  totalLogs: 1247,
  logsToday: 89,
  logsThisWeek: 456,
  logsThisMonth: 1247,
  actionBreakdown: {
      'login': 156,
      'logout': 142,
      'batch_job_create': 45,
      'batch_job_start': 43,
      'batch_job_complete': 38,
      'online_session_start': 67,
      'online_session_stop': 62,
      'data_discovery': 23,
      'technique_apply': 89,
      'universe_create': 15,
      'universe_update': 28,
      'user_create': 8,
      'user_update': 12,
      'system_backup': 5,
      'config_change': 18,
      password_change: 0,
      password_reset: 0,
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
      export: 0,
      import: 0,
      batch_job_pause: 0,
      batch_job_stop: 0,
      batch_job_delete: 0,
      online_session_create: 0,
      online_session_pause: 0,
      technique_configure: 0,
      technique_test: 0,
      data_classification: 0,
      data_scan: 0,
      universe_delete: 0,
      universe_activate: 0,
      universe_deactivate: 0,
      attribute_create: 0,
      attribute_update: 0,
      attribute_delete: 0,
      attribute_classify: 0,
      report_generate: 0,
      report_export: 0,
      report_view: 0,
      system_config: 0,
      user_management: 0,
      permission_change: 0,
      audit_log_create: 0,
      audit_log_delete: 0,
      audit_log_export: 0,
     
  },
  moduleBreakdown: {
      'authentication': 298,
      'batch_execution': 234,
      'online_execution': 189,
      'data_discovery': 156,
      'attribute_catalog': 234,
      'universe_administration': 78,
      'audit_trail': 45,
      'system': 91,
      'user_management': 67,
      'configuration': 55,
      monitoring: 0
  },
  severityBreakdown: {
    'low': 567,
    'medium': 445,
    'high': 189,
    'critical': 46
  },
  statusBreakdown: {
    'success': 1089,
    'failure': 123,
    'warning': 35
  },
  topUsers: [
    { userId: 'admin', userName: 'Administrador Sistema', actionCount: 234 },
    { userId: 'operator1', userName: 'Juan Pérez', actionCount: 189 },
    { userId: 'analyst1', userName: 'María González', actionCount: 156 },
    { userId: 'operator2', userName: 'Carlos Rodríguez', actionCount: 134 },
    { userId: 'analyst2', userName: 'Ana López', actionCount: 98 }
  ],
  recentActivity: mockAuditLogs.slice(0, 5),
  errorTrends: [
    { date: '2024-01-15', errorCount: 12, totalCount: 156, errorRate: 7.7 },
    { date: '2024-01-16', errorCount: 8, totalCount: 134, errorRate: 6.0 },
    { date: '2024-01-17', errorCount: 15, totalCount: 178, errorRate: 8.4 },
    { date: '2024-01-18', errorCount: 6, totalCount: 145, errorRate: 4.1 },
    { date: '2024-01-19', errorCount: 11, totalCount: 167, errorRate: 6.6 },
    { date: '2024-01-20', errorCount: 9, totalCount: 152, errorRate: 5.9 },
    { date: '2024-01-21', errorCount: 13, totalCount: 189, errorRate: 6.9 }
  ]
};

// Función helper para generar datos mock adicionales si es necesario
export const generateMockAuditLog = (overrides: Partial<AuditLog> = {}): AuditLog => {
  const baseLog: AuditLog = {
      id: `mock_${Date.now()}`,
      timestamp: new Date(),
      userId: 'mock_user',
      userName: 'Usuario Mock',
      userRole: 'operator',
      resourceType: 'MockResource',
      resourceId: 'mock_resource_id',
      resourceName: 'Recurso Mock',
      details: 'Acción mock para pruebas',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Mock Browser)',
      sessionId: 'mock_session',
      severity: 'low',
      status: 'success',
      duration: 1000,
      metadata: {},
      changes: [],
      action: 'batch_job_create',
      module: 'data_discovery'
  };

  return { ...baseLog, ...overrides };
};