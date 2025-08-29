import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Shield,
  Lock,
  Key,
  AlertTriangle,
} from "lucide-react";
import type { SecuritySettings as SecuritySettingsType } from "../../../types/settings.types";
import { settingsService } from "../../../services/settings/SettingsService";

interface SecuritySettingsProps {
  onSettingsChange?: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<SecuritySettingsType>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
    },
    sessionSecurity: {
      maxSessionDuration: 480,
      idleTimeout: 30,
      maxConcurrentSessions: 3,
      requireReauthentication: true,
    },
    auditSettings: {
      enableAuditLogging: true,
      logLevel: "detailed",
      retentionDays: 365,
      enableRealTimeAlerts: true,
    },
    accessControl: {
      enableTwoFactor: false,
      allowedIpRanges: [],
      blockSuspiciousActivity: true,
      maxFailedAttempts: 3,
    },
    encryptionAlgorithm: "AES-256",
    hashingAlgorithm: "SHA-256",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newIP, setNewIP] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await settingsService.getSettings();
      setSettings(currentSettings.security);
    } catch (error) {
      console.error("Error loading security settings:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings("security", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving security settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      setSettings(defaultSettings.security);
    } catch (error) {
      console.error("Error resetting security settings:", error);
    }
  };

  const handleChange = (field: keyof SecuritySettingsType, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    onSettingsChange?.();
  };

  const handlePasswordPolicyChange = (
    field: keyof SecuritySettingsType["passwordPolicy"],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleSessionSecurityChange = (
    field: keyof SecuritySettingsType["sessionSecurity"],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      sessionSecurity: {
        ...prev.sessionSecurity,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleAuditSettingsChange = (
    field: keyof SecuritySettingsType["auditSettings"],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      auditSettings: {
        ...prev.auditSettings,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleAccessControlChange = (
    field: keyof SecuritySettingsType["accessControl"],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const addIP = () => {
    if (newIP && !settings.accessControl.allowedIpRanges.includes(newIP)) {
      handleAccessControlChange("allowedIpRanges", [
        ...settings.accessControl.allowedIpRanges,
        newIP,
      ]);
      setNewIP("");
    }
  };

  const removeIP = (ip: string) => {
    handleAccessControlChange(
      "allowedIpRanges",
      settings.accessControl.allowedIpRanges.filter(
        (allowedIP) => allowedIP !== ip
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Configuraciones de Seguridad
          </h3>
          <p className="text-sm text-gray-600">
            Configuración de autenticación, autorización y seguridad del sistema
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

      {/* Password Policy */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Política de Contraseñas
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud Mínima
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={settings.passwordPolicy.minLength}
              onChange={(e) =>
                handlePasswordPolicyChange(
                  "minLength",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiración (días)
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={settings.passwordPolicy.expirationDays}
              onChange={(e) =>
                handlePasswordPolicyChange(
                  "expirationDays",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">0 = sin expiración</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Requerir mayúsculas
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={(e) =>
                  handlePasswordPolicyChange(
                    "requireUppercase",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Requerir minúsculas
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireLowercase}
                onChange={(e) =>
                  handlePasswordPolicyChange(
                    "requireLowercase",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Requerir números
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={(e) =>
                  handlePasswordPolicyChange("requireNumbers", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Requerir caracteres especiales
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireSpecialChars}
                onChange={(e) =>
                  handlePasswordPolicyChange(
                    "requireSpecialChars",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Autenticación</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo Intentos de Login
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.accessControl.maxFailedAttempts}
              onChange={(e) =>
                handleAccessControlChange(
                  "maxFailedAttempts",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración Máxima de Sesión (minutos)
            </label>
            <input
              type="number"
              min="30"
              max="1440"
              value={settings.sessionSecurity.maxSessionDuration}
              onChange={(e) =>
                handleSessionSecurityChange(
                  "maxSessionDuration",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de Inactividad (minutos)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.sessionSecurity.idleTimeout}
              onChange={(e) =>
                handleSessionSecurityChange(
                  "idleTimeout",
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
                Autenticación de Dos Factores
              </label>
              <p className="text-xs text-gray-500">
                Requiere verificación adicional
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessControl.enableTwoFactor}
                onChange={(e) =>
                  handleAccessControlChange("enableTwoFactor", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Bloquear Actividad Sospechosa
              </label>
              <p className="text-xs text-gray-500">
                Detecta y bloquea actividad inusual
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.accessControl.blockSuspiciousActivity}
                onChange={(e) =>
                  handleAccessControlChange(
                    "blockSuspiciousActivity",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Encryption Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Cifrado y Hashing
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo de Cifrado
            </label>
            <select
              value={settings.encryptionAlgorithm}
              onChange={(e) =>
                handleChange("encryptionAlgorithm", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AES-256">AES-256</option>
              <option value="AES-192">AES-192</option>
              <option value="AES-128">AES-128</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo de Hashing
            </label>
            <select
              value={settings.hashingAlgorithm}
              onChange={(e) => handleChange("hashingAlgorithm", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
              <option value="bcrypt">bcrypt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Configuración de Auditoría
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Logs de Auditoría
            </label>
            <select
              value={settings.auditSettings.logLevel}
              onChange={(e) =>
                handleAuditSettingsChange("logLevel", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Básico</option>
              <option value="detailed">Detallado</option>
              <option value="verbose">Completo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retención de Logs (días)
            </label>
            <input
              type="number"
              min="30"
              max="2555"
              value={settings.auditSettings.retentionDays}
              onChange={(e) =>
                handleAuditSettingsChange(
                  "retentionDays",
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
                Habilitar Registro de Auditoría
              </label>
              <p className="text-xs text-gray-500">
                Registra todas las acciones del sistema
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auditSettings.enableAuditLogging}
                onChange={(e) =>
                  handleAuditSettingsChange(
                    "enableAuditLogging",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Alertas en Tiempo Real
              </label>
              <p className="text-xs text-gray-500">
                Notifica eventos de seguridad inmediatamente
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auditSettings.enableRealTimeAlerts}
                onChange={(e) =>
                  handleAuditSettingsChange(
                    "enableRealTimeAlerts",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Session Security */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Seguridad de Sesiones
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Sesiones Concurrentes
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.sessionSecurity.maxConcurrentSessions}
              onChange={(e) =>
                handleSessionSecurityChange(
                  "maxConcurrentSessions",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Requerir Re-autenticación
              </label>
              <p className="text-xs text-gray-500">
                Solicita credenciales para acciones sensibles
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sessionSecurity.requireReauthentication}
                onChange={(e) =>
                  handleSessionSecurityChange(
                    "requireReauthentication",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Lista Blanca de IPs
          </h4>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Habilitar Lista Blanca de IPs
            </label>
            <p className="text-xs text-gray-500">
              Solo permite acceso desde IPs autorizadas
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.accessControl.allowedIpRanges.length > 0}
              onChange={(e) => {
                if (!e.target.checked) {
                  handleAccessControlChange("allowedIpRanges", []);
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="192.168.1.1"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addIP}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar
            </button>
          </div>

          {settings.accessControl.allowedIpRanges.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                IPs Autorizadas:
              </label>
              <div className="space-y-1">
                {settings.accessControl.allowedIpRanges.map((ip, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{ip}</span>
                    <button
                      onClick={() => removeIP(ip)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
