import React, { useState, useEffect } from "react";
import { Save, RotateCcw, Globe, Clock, Database } from "lucide-react";
import type { GeneralSettings as GeneralSettingsType } from "../../../types/settings.types";
import { settingsService } from "../../../services/settings/SettingsService";

interface GeneralSettingsProps {
  onSettingsChange?: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<GeneralSettingsType>({
    systemName: "Zurich Anonimización",
    systemDescription: "Sistema de Anonimización de Datos",
    defaultLanguage: "es",
    timezone: "America/Santiago",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    sessionTimeout: 480,
    maxConcurrentJobs: 5,
    defaultRetentionDays: 90,
    enableAuditLog: true,
    enableNotifications: true,
    autoBackup: true,
    backupFrequency: "daily",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await settingsService.getSettings();
      setSettings(currentSettings.general);
    } catch (error) {
      console.error("Error loading general settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings("general", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving general settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      setSettings(defaultSettings.general);
    } catch (error) {
      console.error("Error resetting general settings:", error);
    }
  };

  const handleChange = (field: keyof GeneralSettingsType, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    onSettingsChange?.();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Configuraciones Generales
          </h3>
          <p className="text-sm text-gray-600">
            Configuración básica del sistema y preferencias globales
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

      {/* Application Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Configuración de Aplicación
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sistema
            </label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => handleChange("systemName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma por Defecto
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => handleChange("defaultLanguage", e.target.value)}
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
              Descripción del Sistema
            </label>
            <textarea
              value={settings.systemDescription}
              onChange={(e) =>
                handleChange("systemDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción breve del sistema"
            />
          </div>
        </div>
      </div>

      {/* Date & Time Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Fecha y Hora</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Horaria
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Santiago">Santiago (UTC-3)</option>
              <option value="America/Buenos_Aires">Buenos Aires (UTC-3)</option>
              <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Fecha
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleChange("dateFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Hora
            </label>
            <select
              value={settings.timeFormat}
              onChange={(e) => handleChange("timeFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Configuración del Sistema
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Trabajos Concurrentes
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.maxConcurrentJobs}
              onChange={(e) =>
                handleChange("maxConcurrentJobs", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de Retención por Defecto
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.defaultRetentionDays}
              onChange={(e) =>
                handleChange("defaultRetentionDays", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Habilitar Registro de Auditoría
              </label>
              <p className="text-xs text-gray-500">
                Registra todas las acciones del sistema
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAuditLog}
                onChange={(e) =>
                  handleChange("enableAuditLog", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Habilitar Notificaciones
              </label>
              <p className="text-xs text-gray-500">
                Recibe notificaciones del sistema
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  handleChange("enableNotifications", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Respaldo Automático
              </label>
              <p className="text-xs text-gray-500">
                Realiza respaldos automáticos del sistema
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleChange("autoBackup", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia de Respaldo
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) =>
                  handleChange("backupFrequency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
