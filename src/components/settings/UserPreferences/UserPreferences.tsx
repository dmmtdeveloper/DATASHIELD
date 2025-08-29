import React, { useState, useEffect } from "react";
import { Save, RotateCcw, User, Palette, Bell, Monitor } from "lucide-react";
import type { UserPreferences as UserPreferencesType } from "../../../types/settings.types";
import { settingsService } from "../../../services/settings/SettingsService";

interface UserPreferencesProps {
  onSettingsChange?: () => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({
  onSettingsChange,
}) => {
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    theme: "light",
    language: "es",
    timezone: "America/Santiago",
    notifications: {
      email: true,
      browser: true,
      desktop: false,
    },
    dashboard: {
      defaultView: "overview",
      refreshInterval: 30,
      showMetrics: true,
      compactMode: false,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentSettings = await settingsService.getSettings();
      setPreferences(currentSettings.userPreferences);
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings("userPreferences", preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving user preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      setPreferences(defaultSettings.userPreferences);
    } catch (error) {
      console.error("Error resetting user preferences:", error);
    }
  };

  const handleChange = (field: keyof UserPreferencesType, value: any) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
    onSettingsChange?.();
  };

  const handleNotificationChange = (
    field: keyof UserPreferencesType["notifications"],
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleDashboardChange = (
    field: keyof UserPreferencesType["dashboard"],
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleAccessibilityChange = (
    field: keyof UserPreferencesType["accessibility"],
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
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
            Preferencias de Usuario
          </h3>
          <p className="text-sm text-gray-600">
            Personaliza tu experiencia en la plataforma
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

      {/* Appearance Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Apariencia</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={preferences.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Horaria
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Santiago">Santiago (UTC-3)</option>
              <option value="America/Buenos_Aires">Buenos Aires (UTC-3)</option>
              <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Notificaciones
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notificaciones por Email
              </label>
              <p className="text-xs text-gray-500">
                Recibe notificaciones por correo electrónico
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) =>
                  handleNotificationChange("email", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notificaciones del Navegador
              </label>
              <p className="text-xs text-gray-500">
                Notificaciones en tiempo real
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.browser}
                onChange={(e) =>
                  handleNotificationChange("browser", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notificaciones de Escritorio
              </label>
              <p className="text-xs text-gray-500">
                Notificaciones del sistema operativo
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.desktop}
                onChange={(e) =>
                  handleNotificationChange("desktop", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Dashboard Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Dashboard</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista por Defecto
            </label>
            <select
              value={preferences.dashboard.defaultView}
              onChange={(e) =>
                handleDashboardChange("defaultView", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Resumen General</option>
              <option value="metrics">Métricas del Sistema</option>
              <option value="activity">Actividad Reciente</option>
              <option value="compliance">Estado de Cumplimiento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Actualización (segundos)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={preferences.dashboard.refreshInterval}
              onChange={(e) =>
                handleDashboardChange(
                  "refreshInterval",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mostrar Métricas
              </label>
              <p className="text-xs text-gray-500">
                Visualizar métricas en el dashboard
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.dashboard.showMetrics}
                onChange={(e) =>
                  handleDashboardChange("showMetrics", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Modo Compacto
              </label>
              <p className="text-xs text-gray-500">
                Reduce el espaciado entre elementos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.dashboard.compactMode}
                onChange={(e) =>
                  handleDashboardChange("compactMode", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Accesibilidad</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Alto Contraste
              </label>
              <p className="text-xs text-gray-500">
                Mejora la visibilidad del texto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={(e) =>
                  handleAccessibilityChange("highContrast", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Texto Grande
              </label>
              <p className="text-xs text-gray-500">
                Aumenta el tamaño del texto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.largeText}
                onChange={(e) =>
                  handleAccessibilityChange("largeText", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reducir Movimiento
              </label>
              <p className="text-xs text-gray-500">
                Disminuye animaciones y transiciones
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.reducedMotion}
                onChange={(e) =>
                  handleAccessibilityChange("reducedMotion", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Lector de Pantalla
              </label>
              <p className="text-xs text-gray-500">
                Optimiza para lectores de pantalla
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility.screenReader}
                onChange={(e) =>
                  handleAccessibilityChange("screenReader", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
