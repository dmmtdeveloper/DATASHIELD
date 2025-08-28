import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Shield, Hash, Eye, Key, Shuffle, Settings, AlertTriangle } from 'lucide-react';
import type { AnonymizationSettings as AnonymizationSettingsType } from '../../../types/settings.types';
import { SettingsService } from '../../../services/settings/SettingsService';

interface AnonymizationSettingsProps {
  onSave?: (settings: AnonymizationSettingsType) => void;
}

const AnonymizationSettings: React.FC<AnonymizationSettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<AnonymizationSettingsType>({
    defaultTechniques: {
      personalData: 'hashing',
      financialData: 'tokenization',
      contactData: 'masking',
      biometricData: 'encryption'
    },
    hashingConfig: {
      algorithm: 'SHA-256',
      saltEnabled: true,
      iterations: 10000
    },
    maskingConfig: {
      maskCharacter: '*',
      preserveLength: true,
      partialMasking: true,
      visibleCharacters: 3
    },
    tokenizationConfig: {
      tokenLength: 16,
      preserveFormat: false,
      reversible: true
    },
    encryptionConfig: {
      algorithm: 'AES-256',
      keyRotationDays: 90,
      backupKeys: true
    },
    complianceRules: {
      ley19628Enabled: true,
      ley21719Enabled: true,
      gdprCompliance: false,
      auditTrailRequired: true
    },
    performanceSettings: {
      batchSize: 1000,
      parallelProcessing: true,
      maxConcurrentJobs: 4,
      timeoutMinutes: 30
    }
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const systemSettings = await SettingsService.loadSettings();
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
      await SettingsService.updateSettings({ anonymization: settings });
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
      const defaultSettings = await SettingsService.getDefaultSettings();
      if (defaultSettings.anonymization) {
        setSettings(defaultSettings.anonymization);
      }
    } catch (error) {
      console.error('Error resetting anonymization settings:', error);
    }
  };

  const updateDefaultTechnique = (dataType: keyof AnonymizationSettingsType['defaultTechniques'], technique: string) => {
    setSettings(prev => ({
      ...prev,
      defaultTechniques: {
        ...prev.defaultTechniques,
        [dataType]: technique
      }
    }));
  };

  const updateHashingConfig = (field: keyof AnonymizationSettingsType['hashingConfig'], value: any) => {
    setSettings(prev => ({
      ...prev,
      hashingConfig: {
        ...prev.hashingConfig,
        [field]: value
      }
    }));
  };

  const updateMaskingConfig = (field: keyof AnonymizationSettingsType['maskingConfig'], value: any) => {
    setSettings(prev => ({
      ...prev,
      maskingConfig: {
        ...prev.maskingConfig,
        [field]: value
      }
    }));
  };

  const updateTokenizationConfig = (field: keyof AnonymizationSettingsType['tokenizationConfig'], value: any) => {
    setSettings(prev => ({
      ...prev,
      tokenizationConfig: {
        ...prev.tokenizationConfig,
        [field]: value
      }
    }));
  };

  const updateEncryptionConfig = (field: keyof AnonymizationSettingsType['encryptionConfig'], value: any) => {
    setSettings(prev => ({
      ...prev,
      encryptionConfig: {
        ...prev.encryptionConfig,
        [field]: value
      }
    }));
  };

  const updateComplianceRules = (field: keyof AnonymizationSettingsType['complianceRules'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      complianceRules: {
        ...prev.complianceRules,
        [field]: value
      }
    }));
  };

  const updatePerformanceSettings = (field: keyof AnonymizationSettingsType['performanceSettings'], value: any) => {
    setSettings(prev => ({
      ...prev,
      performanceSettings: {
        ...prev.performanceSettings,
        [field]: value
      }
    }));
  };

  const getTechniqueIcon = (technique: string) => {
    switch (technique) {
      case 'hashing': return <Hash className="w-4 h-4" />;
      case 'masking': return <Eye className="w-4 h-4" />;
      case 'tokenization': return <Key className="w-4 h-4" />;
      case 'encryption': return <Shield className="w-4 h-4" />;
      case 'shuffling': return <Shuffle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Personales
            </label>
            <select
              value={settings.defaultTechniques.personalData}
              onChange={(e) => updateDefaultTechnique('personalData', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hashing">Hashing</option>
              <option value="masking">Masking</option>
              <option value="tokenization">Tokenización</option>
              <option value="encryption">Encriptación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Financieros
            </label>
            <select
              value={settings.defaultTechniques.financialData}
              onChange={(e) => updateDefaultTechnique('financialData', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tokenization">Tokenización</option>
              <option value="encryption">Encriptación</option>
              <option value="hashing">Hashing</option>
              <option value="masking">Masking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos de Contacto
            </label>
            <select
              value={settings.defaultTechniques.contactData}
              onChange={(e) => updateDefaultTechnique('contactData', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="masking">Masking</option>
              <option value="hashing">Hashing</option>
              <option value="tokenization">Tokenización</option>
              <option value="shuffling">Shuffling</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos Biométricos
            </label>
            <select
              value={settings.defaultTechniques.biometricData}
              onChange={(e) => updateDefaultTechnique('biometricData', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="encryption">Encriptación</option>
              <option value="hashing">Hashing</option>
              <option value="tokenization">Tokenización</option>
            </select>
          </div>
        </div>
      </div>

      {/* Configuración de Hashing */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Configuración de Hashing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo
            </label>
            <select
              value={settings.hashingConfig.algorithm}
              onChange={(e) => updateHashingConfig('algorithm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
              <option value="MD5">MD5</option>
              <option value="BCRYPT">BCRYPT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iteraciones
            </label>
            <input
              type="number"
              value={settings.hashingConfig.iterations}
              onChange={(e) => updateHashingConfig('iterations', parseInt(e.target.value))}
              min="1000"
              max="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hashingConfig.saltEnabled}
                onChange={(e) => updateHashingConfig('saltEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Habilitar Salt</span>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración de Masking */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Configuración de Masking
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carácter de Máscara
            </label>
            <input
              type="text"
              value={settings.maskingConfig.maskCharacter}
              onChange={(e) => updateMaskingConfig('maskCharacter', e.target.value.charAt(0))}
              maxLength={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caracteres Visibles
            </label>
            <input
              type="number"
              value={settings.maskingConfig.visibleCharacters}
              onChange={(e) => updateMaskingConfig('visibleCharacters', parseInt(e.target.value))}
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maskingConfig.preserveLength}
                onChange={(e) => updateMaskingConfig('preserveLength', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Preservar Longitud</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maskingConfig.partialMasking}
                onChange={(e) => updateMaskingConfig('partialMasking', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Masking Parcial</span>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración de Tokenización */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Configuración de Tokenización
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud del Token
            </label>
            <input
              type="number"
              value={settings.tokenizationConfig.tokenLength}
              onChange={(e) => updateTokenizationConfig('tokenLength', parseInt(e.target.value))}
              min="8"
              max="64"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tokenizationConfig.preserveFormat}
                onChange={(e) => updateTokenizationConfig('preserveFormat', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Preservar Formato</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tokenizationConfig.reversible}
                onChange={(e) => updateTokenizationConfig('reversible', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Reversible</span>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración de Encriptación */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Configuración de Encriptación
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo
            </label>
            <select
              value={settings.encryptionConfig.algorithm}
              onChange={(e) => updateEncryptionConfig('algorithm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AES-256">AES-256</option>
              <option value="AES-128">AES-128</option>
              <option value="RSA-2048">RSA-2048</option>
              <option value="RSA-4096">RSA-4096</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotación de Claves (días)
            </label>
            <input
              type="number"
              value={settings.encryptionConfig.keyRotationDays}
              onChange={(e) => updateEncryptionConfig('keyRotationDays', parseInt(e.target.value))}
              min="30"
              max="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.encryptionConfig.backupKeys}
                onChange={(e) => updateEncryptionConfig('backupKeys', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Backup de Claves</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reglas de Cumplimiento */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Reglas de Cumplimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.complianceRules.ley19628Enabled}
                onChange={(e) => updateComplianceRules('ley19628Enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Ley 19.628 (Protección de Datos)</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.complianceRules.ley21719Enabled}
                onChange={(e) => updateComplianceRules('ley21719Enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Ley 21.719 (Datos Biométricos)</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.complianceRules.gdprCompliance}
                onChange={(e) => updateComplianceRules('gdprCompliance', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">GDPR (Reglamento Europeo)</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.complianceRules.auditTrailRequired}
                onChange={(e) => updateComplianceRules('auditTrailRequired', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Auditoría Obligatoria</span>
            </label>
          </div>
        </div>
      </div>

      {/* Configuración de Rendimiento */}
      <div className="card p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración de Rendimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de Lote
            </label>
            <input
              type="number"
              value={settings.performanceSettings.batchSize}
              onChange={(e) => updatePerformanceSettings('batchSize', parseInt(e.target.value))}
              min="100"
              max="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trabajos Concurrentes
            </label>
            <input
              type="number"
              value={settings.performanceSettings.maxConcurrentJobs}
              onChange={(e) => updatePerformanceSettings('maxConcurrentJobs', parseInt(e.target.value))}
              min="1"
              max="16"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (minutos)
            </label>
            <input
              type="number"
              value={settings.performanceSettings.timeoutMinutes}
              onChange={(e) => updatePerformanceSettings('timeoutMinutes', parseInt(e.target.value))}
              min="5"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.performanceSettings.parallelProcessing}
                onChange={(e) => updatePerformanceSettings('parallelProcessing', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Procesamiento Paralelo</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymizationSettings;