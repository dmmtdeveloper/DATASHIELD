import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Shield, Settings, AlertTriangle } from 'lucide-react';
import type { AnonymizationSettings as AnonymizationSettingsType } from '../../../types/settings.types';
import { settingsService } from '../../../services/settings/SettingsService';

interface AnonymizationSettingsProps {
  onSave?: (settings: AnonymizationSettingsType) => void;
}

const AnonymizationSettings: React.FC<AnonymizationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<AnonymizationSettingsType>({
    defaultTechniques: {
      pii: ['masking', 'hashing'],
      sensitive: ['tokenization', 'encryption'],
      confidential: ['suppression', 'generalization'],
      personalData: ['anonymization', 'pseudonymization']
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
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const systemSettings = await settingsService.getSettings();
      if (systemSettings.anonymization) {
        setSettings(systemSettings.anonymization);
      }
    } catch (error) {
      console.error('Error loading anonymization settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingsService.updateSettings('anonymization', settings);
      setSaved(true);
      onSave?.(settings);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving anonymization settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await settingsService.getDefaultSettings();
      if (defaultSettings.anonymization) {
        setSettings(defaultSettings.anonymization);
      }
    } catch (error) {
      console.error('Error resetting anonymization settings:', error);
    }
  };

  const updateDefaultTechniques = (field: keyof AnonymizationSettingsType['defaultTechniques'], value: string[]) => {
    setSettings(prev => ({
      ...prev,
      defaultTechniques: {
        ...prev.defaultTechniques,
        [field]: value
      }
    }));
  };

  const updateQualitySettings = (field: keyof AnonymizationSettingsType['qualitySettings'], value: any) => {
    setSettings(prev => ({
      ...prev,
      qualitySettings: {
        ...prev.qualitySettings,
        [field]: value
      }
    }));
  };

  const updatePerformance = (field: keyof AnonymizationSettingsType['performance'], value: any) => {
    setSettings(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        [field]: value
      }
    }));
  };

  const updateCompliance = (field: keyof AnonymizationSettingsType['compliance'], value: any) => {
    setSettings(prev => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Configuración de Anonimización</h3>
          <p className="text-sm text-gray-600">Gestiona las técnicas y parámetros de anonimización</p>
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

      {/* Técnicas por Defecto */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Técnicas por Defecto
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos PII (Información Personal Identificable)
            </label>
            <div className="space-y-2">
              {settings.defaultTechniques.pii.map((technique, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {technique}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Sensibles
            </label>
            <div className="space-y-2">
              {settings.defaultTechniques.sensitive.map((technique, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {technique}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Confidenciales
            </label>
            <div className="space-y-2">
              {settings.defaultTechniques.confidential.map((technique, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    {technique}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Personales
            </label>
            <div className="space-y-2">
              {settings.defaultTechniques.personalData.map((technique, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {technique}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Calidad */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Configuración de Calidad
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel Mínimo de Anonimidad
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.qualitySettings.minimumAnonymityLevel}
              onChange={(e) => updateQualitySettings('minimumAnonymityLevel', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Preservar Utilidad de Datos</label>
                <p className="text-xs text-gray-500">Mantiene la utilidad para análisis</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.qualitySettings.preserveDataUtility}
                  onChange={(e) => updateQualitySettings('preserveDataUtility', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Verificaciones de Consistencia</label>
                <p className="text-xs text-gray-500">Valida la consistencia de datos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.qualitySettings.enableConsistencyChecks}
                  onChange={(e) => updateQualitySettings('enableConsistencyChecks', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Validar Resultados</label>
                <p className="text-xs text-gray-500">Verificación automática de resultados</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.qualitySettings.validateResults}
                  onChange={(e) => updateQualitySettings('validateResults', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Rendimiento */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración de Rendimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de Lote
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              value={settings.performance.batchSize}
              onChange={(e) => updatePerformance('batchSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uso Máximo de Memoria (MB)
            </label>
            <input
              type="number"
              min="512"
              max="8192"
              value={settings.performance.maxMemoryUsage}
              onChange={(e) => updatePerformance('maxMemoryUsage', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Procesamiento Paralelo</label>
              <p className="text-xs text-gray-500">Utiliza múltiples hilos de procesamiento</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.performance.parallelProcessing}
                onChange={(e) => updatePerformance('parallelProcessing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Habilitar Caché</label>
              <p className="text-xs text-gray-500">Almacena resultados temporales</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.performance.enableCaching}
                onChange={(e) => updatePerformance('enableCaching', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración de Cumplimiento */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Configuración de Cumplimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Ley 19.628 (Protección de Datos)</label>
              <p className="text-xs text-gray-500">Normativa chilena de protección de datos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compliance.enableLey19628}
                onChange={(e) => updateCompliance('enableLey19628', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Ley 21.719 (Datos Biométricos)</label>
              <p className="text-xs text-gray-500">Normativa chilena para datos biométricos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compliance.enableLey21719}
                onChange={(e) => updateCompliance('enableLey21719', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">GDPR (Reglamento Europeo)</label>
              <p className="text-xs text-gray-500">Reglamento General de Protección de Datos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compliance.enableGDPR}
                onChange={(e) => updateCompliance('enableGDPR', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">CCPA (California Consumer Privacy Act)</label>
              <p className="text-xs text-gray-500">Normativa de privacidad de California</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compliance.enableCCPA}
                onChange={(e) => updateCompliance('enableCCPA', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        
        {settings.compliance.customRegulations.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regulaciones Personalizadas
            </label>
            <div className="space-y-2">
              {settings.compliance.customRegulations.map((regulation, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {regulation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymizationSettings;