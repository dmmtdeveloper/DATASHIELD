import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, User, Palette, Bell, Monitor } from 'lucide-react';
import type { UserPreferences as UserPreferencesType } from '../../../types/settings.types';
import { SettingsService } from '../../../services/settings/SettingsService';

const UserPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferencesType>({
    theme: 'light',
    language: 'es',
    timezone: 'America/Santiago',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    itemsPerPage: 25,
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    autoSave: true,
    compactView: false,
    showTooltips: true,
    defaultDashboard: 'overview',
    favoriteModules: []
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const modules = [
    { id: 'discovery', name: 'Descubrimiento de Datos' },
    { id: 'universe', name: 'Administración de Universos' },
    { id: 'catalog', name: 'Catálogo de Atributos' },
    { id: 'batch', name: 'Ejecución Batch' },
    { id: 'online', name: 'Ejecución Online' },
    { id: 'audit', name: 'Auditoría' },
    { id: 'monitoring', name: 'Monitoreo' }
  ];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentSettings = await SettingsService.getSettings();
      setPreferences(currentSettings.userPreferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await SettingsService.updateSettings({ userPreferences: preferences });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving user preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const defaultSettings = await SettingsService.getDefaultSettings();
      setPreferences(defaultSettings.userPreferences);
    } catch (error) {
      console.error('Error resetting user preferences:', error);
    }
  };

  const handleChange = (field: keyof UserPreferencesType, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const toggleFavoriteModule = (moduleId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteModules: prev.favoriteModules.includes(moduleId)
        ? prev.favoriteModules.filter(id => id !== moduleId)
        : [...prev.favoriteModules, moduleId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Preferencias de Usuario</h3>
          <p className="text-sm text-gray-600">Personaliza tu experiencia en la plataforma</p>
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
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
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
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elementos por página
            </label>
            <select
              value={preferences.itemsPerPage}
              onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Vista Compacta</label>
              <p className="text-xs text-gray-500">Reduce el espaciado entre elementos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.compactView}
                onChange={(e) => handleChange('compactView', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Mostrar Tooltips</label>
              <p className="text-xs text-gray-500">Ayuda contextual al pasar el mouse</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.showTooltips}
                onChange={(e) => handleChange('showTooltips', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Notificaciones</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Habilitar Notificaciones</label>
              <p className="text-xs text-gray-500">Recibe notificaciones del sistema</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.enableNotifications}
                onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.enableNotifications && (
            <>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Notificaciones por Email</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Notificaciones Push</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Sonidos</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Behavior Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Comportamiento</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dashboard por Defecto
            </label>
            <select
              value={preferences.defaultDashboard}
              onChange={(e) => handleChange('defaultDashboard', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Resumen General</option>
              <option value="metrics">Métricas del Sistema</option>
              <option value="activity">Actividad Reciente</option>
              <option value="compliance">Estado de Cumplimiento</option>
            </select>
          </div>
          <div className="flex items-center">
            <div>
              <label className="text-sm font-medium text-gray-700">Guardado Automático</label>
              <p className="text-xs text-gray-500">Guarda cambios automáticamente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Favorite Modules */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h4 className="text-md font-semibold text-gray-800">Módulos Favoritos</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">Selecciona los módulos que usas con más frecuencia para acceso rápido</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.favoriteModules.includes(module.id)}
                  onChange={() => toggleFavoriteModule(module.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">{module.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;