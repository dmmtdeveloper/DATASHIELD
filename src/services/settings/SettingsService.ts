import type { SystemSettings, GeneralSettings, SecuritySettings, UserPreferences, AnonymizationSettings, NotificationSettings } from '../../types/settings.types';

export class SettingsService {
  private readonly STORAGE_KEY = 'anonimizacion_settings';
  private readonly API_BASE_URL = '/api/settings';

  // Configuraciones por defecto
  private getDefaultSettings(): SystemSettings {
    return {
      general: {
        systemName: 'Sistema de Anonimización de Datos',
        systemDescription: 'Plataforma para la anonimización de datos personales según normativas chilenas',
        defaultLanguage: 'es',
        timezone: 'America/Santiago',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        maxConcurrentJobs: 5,
        sessionTimeout: 30,
        autoSaveInterval: 5,
        enableDebugMode: false,
        enableMaintenanceMode: false
      },
      security: {
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          expirationDays: 90
        },
        sessionSecurity: {
          maxSessionDuration: 480,
          idleTimeout: 30,
          maxConcurrentSessions: 3,
          requireReauthentication: true
        },
        auditSettings: {
          enableAuditLogging: true,
          logLevel: 'detailed',
          retentionDays: 365,
          enableRealTimeAlerts: true
        },
        accessControl: {
          enableTwoFactor: false,
          allowedIpRanges: [],
          blockSuspiciousActivity: true,
          maxFailedAttempts: 3
        }
      },
      userPreferences: {
        theme: 'light',
        language: 'es',
        notifications: {
          email: true,
          browser: true,
          desktop: false
        },
        dashboard: {
          defaultView: 'overview',
          refreshInterval: 30,
          showMetrics: true,
          compactMode: false
        },
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false,
          screenReader: false
        }
      },
      anonymization: {
        defaultTechniques: {
          pii: ['masking', 'hashing'],
          sensitive: ['tokenization', 'encryption'],
          confidential: ['suppression', 'generalization']
        },
        qualitySettings: {
          preserveDataUtility: true,
          minimumAnonymityLevel: 3,
          enableConsistencyChecks: true,
          validateResults: true
        },
        performance: {
          batchSize: 1000,
          parallelProcessing: true,
          maxMemoryUsage: 2048,
          enableCaching: true
        },
        compliance: {
          enableLey19628: true,
          enableLey21719: true,
          enableGDPR: false,
          enableCCPA: false,
          customRegulations: []
        }
      },
      notifications: {
        email: {
          enabled: false,
          smtpServer: '',
          smtpPort: 587,
          username: '',
          password: '',
          fromAddress: '',
          enableSSL: true
        },
        alerts: {
          jobCompletion: true,
          jobFailure: true,
          systemErrors: true,
          securityEvents: true,
          complianceViolations: true,
          maintenanceReminders: false
        },
        channels: {
          email: true,
          slack: false,
          webhook: false,
          sms: false
        },
        frequency: {
          immediate: true,
          hourly: false,
          daily: false,
          weekly: false
        }
      }
    };
  }

  // Cargar configuraciones
  async loadSettings(): Promise<SystemSettings> {
    try {
      // Intentar cargar desde el servidor
      const response = await fetch(`${this.API_BASE_URL}`);
      if (response.ok) {
        const serverSettings = await response.json();
        return { ...this.getDefaultSettings(), ...serverSettings };
      }
    } catch (error) {
      console.warn('No se pudieron cargar las configuraciones del servidor, usando localStorage:', error);
    }

    // Fallback a localStorage
    const localSettings = localStorage.getItem(this.STORAGE_KEY);
    if (localSettings) {
      try {
        const parsedSettings = JSON.parse(localSettings);
        return { ...this.getDefaultSettings(), ...parsedSettings };
      } catch (error) {
        console.error('Error al parsear configuraciones locales:', error);
      }
    }

    return this.getDefaultSettings();
  }

  // Guardar configuraciones
  async saveSettings(settings: SystemSettings): Promise<void> {
    try {
      // Intentar guardar en el servidor
      const response = await fetch(`${this.API_BASE_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Error al guardar en el servidor');
      }
    } catch (error) {
      console.warn('No se pudieron guardar las configuraciones en el servidor, usando localStorage:', error);
    }

    // Guardar en localStorage como backup
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  // Actualizar configuración específica
  async updateSettings<T extends keyof SystemSettings>(
    category: T,
    newSettings: Partial<SystemSettings[T]>
  ): Promise<SystemSettings> {
    const currentSettings = await this.loadSettings();
    const updatedSettings = {
      ...currentSettings,
      [category]: {
        ...currentSettings[category],
        ...newSettings
      }
    };

    await this.saveSettings(updatedSettings);
    return updatedSettings;
  }

  // Restablecer configuraciones
  async resetSettings(category?: keyof SystemSettings): Promise<SystemSettings> {
    const defaultSettings = this.getDefaultSettings();
    
    if (category) {
      const currentSettings = await this.loadSettings();
      const resetSettings = {
        ...currentSettings,
        [category]: defaultSettings[category]
      };
      await this.saveSettings(resetSettings);
      return resetSettings;
    } else {
      await this.saveSettings(defaultSettings);
      return defaultSettings;
    }
  }

  // Validar configuraciones
  validateSettings(settings: Partial<SystemSettings>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar configuraciones generales
    if (settings.general) {
      if (settings.general.maxConcurrentJobs && settings.general.maxConcurrentJobs < 1) {
        errors.push('El número máximo de trabajos concurrentes debe ser mayor a 0');
      }
      if (settings.general.sessionTimeout && settings.general.sessionTimeout < 5) {
        errors.push('El timeout de sesión debe ser mayor a 5 minutos');
      }
    }

    // Validar configuraciones de seguridad
    if (settings.security?.passwordPolicy) {
      const policy = settings.security.passwordPolicy;
      if (policy.minLength && policy.minLength < 6) {
        errors.push('La longitud mínima de contraseña debe ser mayor a 6 caracteres');
      }
    }

    // Validar configuraciones de anonimización
    if (settings.anonymization?.performance) {
      const perf = settings.anonymization.performance;
      if (perf.batchSize && perf.batchSize < 100) {
        errors.push('El tamaño de lote debe ser mayor a 100');
      }
      if (perf.maxMemoryUsage && perf.maxMemoryUsage < 512) {
        errors.push('El uso máximo de memoria debe ser mayor a 512 MB');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Exportar configuraciones
  async exportSettings(): Promise<string> {
    const settings = await this.loadSettings();
    return JSON.stringify(settings, null, 2);
  }

  // Importar configuraciones
  async importSettings(settingsJson: string): Promise<SystemSettings> {
    try {
      const importedSettings = JSON.parse(settingsJson);
      const validation = this.validateSettings(importedSettings);
      
      if (!validation.isValid) {
        throw new Error(`Configuraciones inválidas: ${validation.errors.join(', ')}`);
      }

      const mergedSettings = { ...this.getDefaultSettings(), ...importedSettings };
      await this.saveSettings(mergedSettings);
      return mergedSettings;
    } catch (error) {
      throw new Error(`Error al importar configuraciones: ${error}`);
    }
  }
}

export const settingsService = new SettingsService();
export default SettingsService;