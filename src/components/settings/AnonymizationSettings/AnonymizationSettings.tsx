import React, { useState, useEffect } from "react";
import { Save, RotateCcw, Sliders, Shield, Eye, Hash } from "lucide-react";
import { settingsService } from "../../../services/settings/SettingsService";

interface AnonymizationSettingsProps {
  onSettingsChange?: () => void;
}

const AnonymizationSettings: React.FC<AnonymizationSettingsProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState({
    defaultTechniques: {
      enableMasking: true,
      enableEncryption: true,
      enableTokenization: false,
      enablePseudonymization: true,
    },
    dataRetention: {
      originalDataRetentionDays: 30,
      anonymizedDataRetentionDays: 365,
      autoDeleteOriginal: true,
    },
    qualitySettings: {
      preserveDataUtility: true,
      minimumAnonymityLevel: "k5",
      enableQualityMetrics: true,
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
      // Validar y establecer valores por defecto si no existen
      if (currentSettings && currentSettings.anonymization) {
        const anonymizationSettings = currentSettings.anonymization;

        setSettings({
          defaultTechniques: {
            enableMasking:
              anonymizationSettings.defaultTechniques?.enableMasking ?? true,
            enableEncryption:
              anonymizationSettings.defaultTechniques?.enableEncryption ?? true,
            enableTokenization:
              anonymizationSettings.defaultTechniques?.enableTokenization ??
              false,
            enablePseudonymization:
              anonymizationSettings.defaultTechniques?.enablePseudonymization ??
              true,
          },
          dataRetention: {
            originalDataRetentionDays:
              anonymizationSettings.dataRetention?.originalDataRetentionDays ??
              30,
            anonymizedDataRetentionDays:
              anonymizationSettings.dataRetention
                ?.anonymizedDataRetentionDays ?? 365,
            autoDeleteOriginal:
              anonymizationSettings.dataRetention?.autoDeleteOriginal ?? true,
          },
          qualitySettings: {
            preserveDataUtility:
              anonymizationSettings.qualitySettings?.preserveDataUtility ??
              true,
            minimumAnonymityLevel:
              anonymizationSettings.qualitySettings?.minimumAnonymityLevel ??
              "k5",
            enableQualityMetrics:
              anonymizationSettings.qualitySettings?.enableQualityMetrics ??
              true,
          },
        });
      } else {
        // Si no hay configuraciones, usar valores por defecto
        console.log("No anonymization settings found, using defaults");
      }
    } catch (error) {
      console.error("Error loading anonymization settings:", error);
      // Mantener los valores por defecto del estado inicial
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings("anonymization", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving anonymization settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      if (defaultSettings && defaultSettings.anonymization) {
        const anonymizationSettings = defaultSettings.anonymization;

        setSettings({
          defaultTechniques: {
            enableMasking:
              anonymizationSettings.defaultTechniques?.enableMasking ?? true,
            enableEncryption:
              anonymizationSettings.defaultTechniques?.enableEncryption ?? true,
            enableTokenization:
              anonymizationSettings.defaultTechniques?.enableTokenization ??
              false,
            enablePseudonymization:
              anonymizationSettings.defaultTechniques?.enablePseudonymization ??
              true,
          },
          dataRetention: {
            originalDataRetentionDays:
              anonymizationSettings.dataRetention?.originalDataRetentionDays ??
              30,
            anonymizedDataRetentionDays:
              anonymizationSettings.dataRetention
                ?.anonymizedDataRetentionDays ?? 365,
            autoDeleteOriginal:
              anonymizationSettings.dataRetention?.autoDeleteOriginal ?? true,
          },
          qualitySettings: {
            preserveDataUtility:
              anonymizationSettings.qualitySettings?.preserveDataUtility ??
              true,
            minimumAnonymityLevel:
              anonymizationSettings.qualitySettings?.minimumAnonymityLevel ??
              "k5",
            enableQualityMetrics:
              anonymizationSettings.qualitySettings?.enableQualityMetrics ??
              true,
          },
        });
      } else {
        // Si no hay configuraciones por defecto, restablecer a los valores iniciales
        setSettings({
          defaultTechniques: {
            enableMasking: true,
            enableEncryption: true,
            enableTokenization: false,
            enablePseudonymization: true,
          },
          dataRetention: {
            originalDataRetentionDays: 30,
            anonymizedDataRetentionDays: 365,
            autoDeleteOriginal: true,
          },
          qualitySettings: {
            preserveDataUtility: true,
            minimumAnonymityLevel: "k5",
            enableQualityMetrics: true,
          },
        });
      }
    } catch (error) {
      console.error("Error resetting anonymization settings:", error);
      // Restablecer a valores por defecto
      setSettings({
        defaultTechniques: {
          enableMasking: true,
          enableEncryption: true,
          enableTokenization: false,
          enablePseudonymization: true,
        },
        dataRetention: {
          originalDataRetentionDays: 30,
          anonymizedDataRetentionDays: 365,
          autoDeleteOriginal: true,
        },
        qualitySettings: {
          preserveDataUtility: true,
          minimumAnonymityLevel: "k5",
          enableQualityMetrics: true,
        },
      });
    }
  };

  const handleTechniqueChange = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      defaultTechniques: {
        ...prev.defaultTechniques,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleRetentionChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        [field]: value,
      },
    }));
    onSettingsChange?.();
  };

  const handleQualityChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      qualitySettings: {
        ...prev.qualitySettings,
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
            Configuraciones de Anonimización
          </h3>
          <p className="text-sm text-gray-600">
            Configuración de técnicas y políticas de anonimización
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

      {/* Default Techniques */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Técnicas por Defecto
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enmascaramiento de Datos
              </label>
              <p className="text-xs text-gray-500">
                Oculta información sensible con caracteres especiales
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultTechniques.enableMasking}
                onChange={(e) =>
                  handleTechniqueChange("enableMasking", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Cifrado de Datos
              </label>
              <p className="text-xs text-gray-500">
                Protege datos mediante algoritmos de cifrado
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultTechniques.enableEncryption}
                onChange={(e) =>
                  handleTechniqueChange("enableEncryption", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tokenización
              </label>
              <p className="text-xs text-gray-500">
                Reemplaza datos sensibles con tokens únicos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultTechniques.enableTokenization}
                onChange={(e) =>
                  handleTechniqueChange("enableTokenization", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Pseudonimización
              </label>
              <p className="text-xs text-gray-500">
                Reemplaza identificadores con pseudónimos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultTechniques.enablePseudonymization}
                onChange={(e) =>
                  handleTechniqueChange(
                    "enablePseudonymization",
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

      {/* Data Retention */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Retención de Datos
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retención de Datos Originales (días)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.dataRetention?.originalDataRetentionDays ?? 30}
              onChange={(e) =>
                handleRetentionChange(
                  "originalDataRetentionDays",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retención de Datos Anonimizados (días)
            </label>
            <input
              type="number"
              min="30"
              max="2555"
              value={settings.dataRetention?.anonymizedDataRetentionDays ?? 365}
              onChange={(e) =>
                handleRetentionChange(
                  "anonymizedDataRetentionDays",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Eliminar Datos Originales Automáticamente
              </label>
              <p className="text-xs text-gray-500">
                Elimina datos originales después del período de retención
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dataRetention?.autoDeleteOriginal ?? true}
                onChange={(e) =>
                  handleRetentionChange("autoDeleteOriginal", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quality Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">
            Configuración de Calidad
          </h4>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Preservar Utilidad de Datos
              </label>
              <p className="text-xs text-gray-500">
                Mantiene la utilidad estadística de los datos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.qualitySettings.preserveDataUtility}
                onChange={(e) =>
                  handleQualityChange("preserveDataUtility", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel Mínimo de Anonimato
            </label>
            <select
              value={settings.qualitySettings.minimumAnonymityLevel}
              onChange={(e) =>
                handleQualityChange("minimumAnonymityLevel", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="k3">K-3 (Básico)</option>
              <option value="k5">K-5 (Recomendado)</option>
              <option value="k10">K-10 (Alto)</option>
              <option value="k20">K-20 (Muy Alto)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Habilitar Métricas de Calidad
              </label>
              <p className="text-xs text-gray-500">
                Calcula métricas de calidad para los datos anonimizados
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.qualitySettings.enableQualityMetrics}
                onChange={(e) =>
                  handleQualityChange("enableQualityMetrics", e.target.checked)
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

export default AnonymizationSettings;
