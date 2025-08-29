import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Bell,
  Mail,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { settingsService } from "../../../services/settings/SettingsService";

interface NotificationSettingsProps {
  onSettingsChange?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      jobCompletion: true,
      errors: true,
      systemAlerts: true,
      weeklyReports: false,
      emailAddress: "admin@example.com",
    },
    browser: {
      enabled: true,
      realTimeAlerts: true,
      jobUpdates: true,
      systemNotifications: true,
    },
    alerts: {
      criticalErrors: true,
      securityIssues: true,
      performanceWarnings: false,
      maintenanceReminders: true,
    },
    frequency: {
      maxDailyEmails: 10,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
      enableQuietHours: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await settingsService.getSettings();
      if (currentSettings && currentSettings.notifications) {
        const notificationSettings = currentSettings.notifications;

        setSettings({
          email: {
            enabled: notificationSettings.email?.enabled ?? true,
            jobCompletion: notificationSettings.email?.jobCompletion ?? true,
            errors: notificationSettings.email?.errors ?? true,
            systemAlerts: notificationSettings.email?.systemAlerts ?? true,
            weeklyReports: notificationSettings.email?.weeklyReports ?? false,
            emailAddress:
              notificationSettings.email?.emailAddress ?? "admin@example.com",
          },
          browser: {
            enabled: notificationSettings.browser?.enabled ?? true,
            realTimeAlerts:
              notificationSettings.browser?.realTimeAlerts ?? true,
            jobUpdates: notificationSettings.browser?.jobUpdates ?? true,
            systemNotifications:
              notificationSettings.browser?.systemNotifications ?? true,
          },
          alerts: {
            criticalErrors: notificationSettings.alerts?.criticalErrors ?? true,
            securityIssues: notificationSettings.alerts?.securityIssues ?? true,
            performanceWarnings:
              notificationSettings.alerts?.performanceWarnings ?? false,
            maintenanceReminders:
              notificationSettings.alerts?.maintenanceReminders ?? true,
          },
          frequency: {
            maxDailyEmails:
              notificationSettings.frequency?.maxDailyEmails ?? 10,
            quietHoursStart:
              notificationSettings.frequency?.quietHoursStart ?? "22:00",
            quietHoursEnd:
              notificationSettings.frequency?.quietHoursEnd ?? "08:00",
            enableQuietHours:
              notificationSettings.frequency?.enableQuietHours ?? true,
          },
        });
      } else {
        console.log("No notification settings found, using defaults");
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
      // Mantener los valores por defecto del estado inicial
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings("notifications", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      if (defaultSettings && defaultSettings.notifications) {
        const notificationSettings = defaultSettings.notifications;

        setSettings({
          email: {
            enabled: notificationSettings.email?.enabled ?? true,
            jobCompletion: notificationSettings.email?.jobCompletion ?? true,
            errors: notificationSettings.email?.errors ?? true,
            systemAlerts: notificationSettings.email?.systemAlerts ?? true,
            weeklyReports: notificationSettings.email?.weeklyReports ?? false,
            emailAddress:
              notificationSettings.email?.emailAddress ?? "admin@example.com",
          },
          browser: {
            enabled: notificationSettings.browser?.enabled ?? true,
            realTimeAlerts:
              notificationSettings.browser?.realTimeAlerts ?? true,
            jobUpdates: notificationSettings.browser?.jobUpdates ?? true,
            systemNotifications:
              notificationSettings.browser?.systemNotifications ?? true,
          },
          alerts: {
            criticalErrors: notificationSettings.alerts?.criticalErrors ?? true,
            securityIssues: notificationSettings.alerts?.securityIssues ?? true,
            performanceWarnings:
              notificationSettings.alerts?.performanceWarnings ?? false,
            maintenanceReminders:
              notificationSettings.alerts?.maintenanceReminders ?? true,
          },
          frequency: {
            maxDailyEmails:
              notificationSettings.frequency?.maxDailyEmails ?? 10,
            quietHoursStart:
              notificationSettings.frequency?.quietHoursStart ?? "22:00",
            quietHoursEnd:
              notificationSettings.frequency?.quietHoursEnd ?? "08:00",
            enableQuietHours:
              notificationSettings.frequency?.enableQuietHours ?? true,
          },
        });
      } else {
        // Restablecer a valores por defecto
        setSettings({
          email: {
            enabled: true,
            jobCompletion: true,
            errors: true,
            systemAlerts: true,
            weeklyReports: false,
            emailAddress: "admin@example.com",
          },
          browser: {
            enabled: true,
            realTimeAlerts: true,
            jobUpdates: true,
            systemNotifications: true,
          },
          alerts: {
            criticalErrors: true,
            securityIssues: true,
            performanceWarnings: false,
            maintenanceReminders: true,
          },
          frequency: {
            maxDailyEmails: 10,
            quietHoursStart: "22:00",
            quietHoursEnd: "08:00",
            enableQuietHours: true,
          },
        });
      }
    } catch (error) {
      console.error("Error resetting notification settings:", error);
      // Restablecer a valores por defecto en caso de error
      setSettings({
        email: {
          enabled: true,
          jobCompletion: true,
          errors: true,
          systemAlerts: true,
          weeklyReports: false,
          emailAddress: "admin@example.com",
        },
        browser: {
          enabled: true,
          realTimeAlerts: true,
          jobUpdates: true,
          systemNotifications: true,
        },
        alerts: {
          criticalErrors: true,
          securityIssues: true,
          performanceWarnings: false,
          maintenanceReminders: true,
        },
        frequency: {
          maxDailyEmails: 10,
          quietHoursStart: "22:00",
          quietHoursEnd: "08:00",
          enableQuietHours: true,
        },
      });
    }
  };

  const handleEmailChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleBrowserChange = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      browser: {
        ...prev.browser,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleAlertsChange = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleFrequencyChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Configuraciones de Notificaciones
          </h3>
          <p className="text-sm text-gray-600">
            Gestiona cómo y cuándo recibir notificaciones del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              saved
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-50`}
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : saved ? "Guardado" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Notificaciones por Email
          </h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de Email
            </label>
            <input
              type="email"
              value={settings.email?.emailAddress ?? "admin@example.com"}
              onChange={(e) =>
                handleEmailChange("emailAddress", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Habilitar Notificaciones por Email
              </label>
              <p className="text-xs text-gray-500">
                Recibe notificaciones importantes por email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.enabled ?? true}
                onChange={(e) => handleEmailChange("enabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Finalización de Trabajos
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.jobCompletion ?? true}
                onChange={(e) =>
                  handleEmailChange("jobCompletion", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Errores del Sistema
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.errors ?? true}
                onChange={(e) => handleEmailChange("errors", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Alertas del Sistema
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.systemAlerts ?? true}
                onChange={(e) =>
                  handleEmailChange("systemAlerts", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Reportes Semanales
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.weeklyReports ?? false}
                onChange={(e) =>
                  handleEmailChange("weeklyReports", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Browser Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Notificaciones del Navegador
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Habilitar Notificaciones del Navegador
              </label>
              <p className="text-xs text-gray-500">
                Muestra notificaciones en tiempo real
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.browser?.enabled ?? true}
                onChange={(e) =>
                  handleBrowserChange("enabled", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Alertas en Tiempo Real
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.browser?.realTimeAlerts ?? true}
                onChange={(e) =>
                  handleBrowserChange("realTimeAlerts", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Actualizaciones de Trabajos
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.browser?.jobUpdates ?? true}
                onChange={(e) =>
                  handleBrowserChange("jobUpdates", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Notificaciones del Sistema
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.browser?.systemNotifications ?? true}
                onChange={(e) =>
                  handleBrowserChange("systemNotifications", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Alert Types */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Tipos de Alertas
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Errores Críticos
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts?.criticalErrors ?? true}
                onChange={(e) =>
                  handleAlertsChange("criticalErrors", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Problemas de Seguridad
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts?.securityIssues ?? true}
                onChange={(e) =>
                  handleAlertsChange("securityIssues", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Advertencias de Rendimiento
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts?.performanceWarnings ?? false}
                onChange={(e) =>
                  handleAlertsChange("performanceWarnings", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Recordatorios de Mantenimiento
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts?.maintenanceReminders ?? true}
                onChange={(e) =>
                  handleAlertsChange("maintenanceReminders", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Configuración de Frecuencia
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Emails Diarios
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={settings.frequency?.maxDailyEmails ?? 10}
              onChange={(e) =>
                handleFrequencyChange(
                  "maxDailyEmails",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Horario Silencioso
              </label>
              <p className="text-xs text-gray-500">
                No enviar notificaciones durante estas horas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.frequency?.enableQuietHours ?? true}
                onChange={(e) =>
                  handleFrequencyChange("enableQuietHours", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {(settings.frequency?.enableQuietHours ?? true) && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inicio del Horario Silencioso
              </label>
              <input
                type="time"
                value={settings.frequency?.quietHoursStart ?? "22:00"}
                onChange={(e) =>
                  handleFrequencyChange("quietHoursStart", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fin del Horario Silencioso
              </label>
              <input
                type="time"
                value={settings.frequency?.quietHoursEnd ?? "08:00"}
                onChange={(e) =>
                  handleFrequencyChange("quietHoursEnd", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
