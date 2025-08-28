export interface GeneralSettings {
  systemName: string;
  systemDescription: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  maxConcurrentJobs: number;
  sessionTimeout: number;
  autoSaveInterval: number;
  enableDebugMode: boolean;
  enableMaintenanceMode: boolean;
  applicationName: string;
  language: string;
  defaultRetentionDays: number;
  enableAuditLog: boolean;
  enableNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number;
    passwordMinLength:number;
    
};
sessionSecurity: {
    maxSessionDuration: number;
    idleTimeout: number;
    maxConcurrentSessions: number;
    requireReauthentication: boolean;
    passwordMinLength:number;
};
auditSettings: {
    enableAuditLogging: boolean;
    logLevel: 'basic' | 'detailed' | 'verbose';
    retentionDays: number;
    enableRealTimeAlerts: boolean;
    passwordMinLength:number;
};
accessControl: {
    enableTwoFactor: boolean;
    allowedIpRanges: string[];
    blockSuspiciousActivity: boolean;
    maxFailedAttempts: number;
    passwordMinLength:number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: number;
  notifications: {
    email: boolean;
    browser: boolean;
    desktop: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
    showMetrics: boolean;
    compactMode: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

export interface AnonymizationSettings {

  defaultTechniques: {
    pii: string[];
    sensitive: string[];
    confidential: string[];
    personalData:string[]
  };
  qualitySettings: {
    preserveDataUtility: boolean;
    minimumAnonymityLevel: number;
    enableConsistencyChecks: boolean;
    validateResults: boolean;
  };
  performance: {
    batchSize: number;
    parallelProcessing: boolean;
    maxMemoryUsage: number;
    enableCaching: boolean;
  };
  compliance: {
    enableLey19628: boolean;
    enableLey21719: boolean;
    enableGDPR: boolean;
    enableCCPA: boolean;
    customRegulations: string[];
  };
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    smtpServer: string;
    smtpPort: number;
    username: string;
    password: string;
    fromAddress: string;
    enableSSL: boolean;
  };
  alerts: {
    jobCompletion: boolean;
    jobFailure: boolean;
    systemErrors: boolean;
    securityEvents: boolean;
    complianceViolations: boolean;
    maintenanceReminders: boolean;
  };
  channels: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
    sms: boolean;
  };
  frequency: {
    immediate: boolean;
    hourly: boolean;
    daily: boolean;
    weekly: boolean;
  };
}

export interface SystemSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  userPreferences: UserPreferences;
  anonymization: AnonymizationSettings;
  notifications: NotificationSettings;
}

export interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (category: keyof SystemSettings, newSettings: Partial<SystemSettings[keyof SystemSettings]>) => void;
  resetSettings: (category?: keyof SystemSettings) => void;
  saveSettings: () => Promise<void>;
  hasUnsavedChanges: boolean;
}