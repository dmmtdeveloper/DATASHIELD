import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Bell, Mail, MessageSquare, AlertTriangle, Info, Volume2, VolumeX } from 'lucide-react';
import type { NotificationSettings as NotificationSettingsType } from '../../../types/settings.types';
import { SettingsService } from '../../../services/settings/SettingsService';

interface NotificationSettingsProps {
  onSave?: (settings: NotificationSettingsType) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    emailNotifications: {
      enabled: true,
      jobCompletion: true,
      jobFailure: true,
      systemAlerts: true,
      complianceAlerts: true,
      weeklyReports: false,
      maintenanceNotices: true
    },
    inAppNotifications: {
      enabled: true,
      realTimeAlerts: true,
      jobUpdates: true,
      systemMessages: true,
      userMentions: false
    },
    smsNotifications: {
      enabled: false,
      criticalAlertsOnly: true,
      phoneNumber: '',
      verificationRequired: true
    },
    notificationFrequency: {
      immediate: true,
      digest: false,
      digestFrequency: 'daily',
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    },
    alertLevels: {
      info: true,
      warning: true,
      error: true,
      critical: true
    },
    channels: {
      email: 'user@example.com',
      slack: '',
      webhook: '',
      teams: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSms, setTestingSms] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const systemSettings = await SettingsService.loadSettings();
      if (systemSettings.notification) {
        setSettings(systemSettings.notification);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await SettingsService.updateSettings({ notification: settings });
      setSaved(true);
      onSave?.(settings);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await SettingsService.getDefaultSettings();
      if (defaultSettings.notification) {
        setSettings(defaultSettings.notification);
      }
    } catch (error) {
      console.error('Error resetting notification settings:', error);
    }
  };

  const updateEmailNotifications = (field: keyof NotificationSettingsType['emailNotifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [field]: value
      }
    }));
  };

  const updateInAppNotifications = (field: keyof NotificationSettingsType['inAppNotifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      inAppNotifications: {
        ...prev.inAppNotifications,
        [field]: value
      }
    }));
  };

  const updateSmsNotifications = (field: keyof NotificationSettingsType['smsNotifications'], value: any) => {
    setSettings(prev => ({
      ...prev,
      smsNotifications: {
        ...prev.smsNotifications,
        [field]: value
      }
    }));
  };

  const updateNotificationFrequency = (field: keyof NotificationSettingsType['notificationFrequency'], value: any) => {
    setSettings(prev => ({
      ...prev,
      notificationFrequency: {
        ...prev.notificationFrequency,
        [field]: value
      }
    }));
  };

  const updateQuietHours = (field: keyof NotificationSettingsType['notificationFrequency']['quietHours'], value: any) => {
    setSettings(prev => ({
      ...prev,
      notificationFrequency: {
        ...prev.notificationFrequency,
        quietHours: {
          ...prev.notificationFrequency.quietHours,
          [field]: value
        }
      }
    }));
  };

  const updateAlertLevels = (field: keyof NotificationSettingsType['alertLevels'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      alertLevels: {
        ...prev.alertLevels,
        [field]: value
      }
    }));
  };

  const updateChannels = (field: keyof NotificationSettingsType['channels'], value: string) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [field]: value
      }
    }));
  };

  const testEmailNotification = async () => {
    setTestingEmail(true);
    try {
      // Simular envío de email de prueba
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Email de prueba enviado correctamente');
    } catch (error) {
      alert('Error al enviar email de prueba');
    } finally {
      setTestingEmail(false);
    }
  };

  const testSmsNotification = async () => {
    setTestingSms(true);
    try {
      // Simular envío de SMS de prueba
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('SMS de prueba enviado correctamente');
    } catch (error) {
      alert('Error al enviar SMS de prueba');
    } finally {
      setTestingSms(false);
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Configuración de Notificaciones</h3>
          <p className="text-sm text-gray-600">Gestiona cómo y cuándo recibir notificaciones del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Guardado' : loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Notificaciones por Email */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notificaciones por Email
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={testEmailNotification}
              disabled={testingEmail || !settings.emailNotifications.enabled}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {testingEmail ? 'Enviando...' : 'Probar'}
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.enabled}
                onChange={(e) => updateEmailNotifications('enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Habilitado</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.jobCompletion}
                onChange={(e) => updateEmailNotifications('jobCompletion', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Finalización de trabajos</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.jobFailure}
                onChange={(e) => updateEmailNotifications('jobFailure', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Fallos de trabajos</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.systemAlerts}
                onChange={(e) => updateEmailNotifications('systemAlerts', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Alertas del sistema</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.complianceAlerts}
                onChange={(e) => updateEmailNotifications('complianceAlerts', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Alertas de cumplimiento</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.weeklyReports}
                onChange={(e) => updateEmailNotifications('weeklyReports', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Reportes semanales</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications.maintenanceNotices}
                onChange={(e) => updateEmailNotifications('maintenanceNotices', e.target.checked)}
                disabled={!settings.emailNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Avisos de mantenimiento</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notificaciones en la Aplicación */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificaciones en la Aplicación
          </h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.inAppNotifications.enabled}
              onChange={(e) => updateInAppNotifications('enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Habilitado</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications.realTimeAlerts}
                onChange={(e) => updateInAppNotifications('realTimeAlerts', e.target.checked)}
                disabled={!settings.inAppNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Alertas en tiempo real</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications.jobUpdates}
                onChange={(e) => updateInAppNotifications('jobUpdates', e.target.checked)}
                disabled={!settings.inAppNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Actualizaciones de trabajos</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications.systemMessages}
                onChange={(e) => updateInAppNotifications('systemMessages', e.target.checked)}
                disabled={!settings.inAppNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mensajes del sistema</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications.userMentions}
                onChange={(e) => updateInAppNotifications('userMentions', e.target.checked)}
                disabled={!settings.inAppNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Menciones de usuario</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notificaciones SMS */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notificaciones SMS
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={testSmsNotification}
              disabled={testingSms || !settings.smsNotifications.enabled || !settings.smsNotifications.phoneNumber}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {testingSms ? 'Enviando...' : 'Probar'}
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications.enabled}
                onChange={(e) => updateSmsNotifications('enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Habilitado</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Teléfono
            </label>
            <input
              type="tel"
              value={settings.smsNotifications.phoneNumber}
              onChange={(e) => updateSmsNotifications('phoneNumber', e.target.value)}
              disabled={!settings.smsNotifications.enabled}
              placeholder="+56 9 1234 5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications.criticalAlertsOnly}
                onChange={(e) => updateSmsNotifications('criticalAlertsOnly', e.target.checked)}
                disabled={!settings.smsNotifications.enabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Solo alertas críticas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Frecuencia de Notificaciones */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {settings.notificationFrequency.quietHours.enabled ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          Frecuencia de Notificaciones
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                checked={settings.notificationFrequency.immediate}
                onChange={(e) => {
                  updateNotificationFrequency('immediate', e.target.checked);
                  updateNotificationFrequency('digest', !e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Inmediatas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                checked={settings.notificationFrequency.digest}
                onChange={(e) => {
                  updateNotificationFrequency('digest', e.target.checked);
                  updateNotificationFrequency('immediate', !e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Resumen</span>
            </label>
          </div>
          
          {settings.notificationFrequency.digest && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia del Resumen
              </label>
              <select
                value={settings.notificationFrequency.digestFrequency}
                onChange={(e) => updateNotificationFrequency('digestFrequency', e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Horario Silencioso</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationFrequency.quietHours.enabled}
                  onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Habilitado</span>
              </label>
            </div>
            
            {settings.notificationFrequency.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={settings.notificationFrequency.quietHours.startTime}
                    onChange={(e) => updateQuietHours('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    value={settings.notificationFrequency.quietHours.endTime}
                    onChange={(e) => updateQuietHours('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Niveles de Alerta */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Niveles de Alerta
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(settings.alertLevels).map(([level, enabled]) => (
            <div key={level} className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => updateAlertLevels(level as keyof NotificationSettingsType['alertLevels'], e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  {getAlertIcon(level)}
                  <span className="text-sm text-gray-700 capitalize">
                    {level === 'info' ? 'Información' : 
                     level === 'warning' ? 'Advertencia' : 
                     level === 'error' ? 'Error' : 'Crítico'}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Canales de Integración */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Canales de Integración
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Principal
            </label>
            <input
              type="email"
              value={settings.channels.email}
              onChange={(e) => updateChannels('email', e.target.value)}
              placeholder="usuario@empresa.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
              value={settings.channels.webhook}
              onChange={(e) => updateChannels('webhook', e.target.value)}
              placeholder="https://hooks.slack.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canal Slack
            </label>
            <input
              type="text"
              value={settings.channels.slack}
              onChange={(e) => updateChannels('slack', e.target.value)}
              placeholder="#notificaciones"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teams Webhook
            </label>
            <input
              type="url"
              value={settings.channels.teams}
              onChange={(e) => updateChannels('teams', e.target.value)}
              placeholder="https://outlook.office.com/webhook/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;