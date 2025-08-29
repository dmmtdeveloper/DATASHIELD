import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  User,
  Sliders,
  Bell,
  Save,
  RotateCcw,
} from "lucide-react";
import GeneralSettings from "../../components/settings/GeneralSettings/GeneralSettings";
import SecuritySettings from "../../components/settings/SecuritySettings/SecuritySettings";
import UserPreferences from "../../components/settings/UserPreferences/UserPreferences";
import AnonymizationSettings from "../../components/settings/AnonymizationSettings/AnonymizationSettings";
import NotificationSettings from "../../components/settings/NotificationSettings/NotificationSettings";

type SettingsTab =
  | "general"
  | "security"
  | "preferences"
  | "anonymization"
  | "notifications";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    {
      id: "general" as SettingsTab,
      label: "General",
      icon: SettingsIcon,
      description: "Configuraciones generales del sistema",
    },
    {
      id: "security" as SettingsTab,
      label: "Seguridad",
      icon: Shield,
      description: "Configuraciones de seguridad y autenticación",
    },
    {
      id: "preferences" as SettingsTab,
      label: "Preferencias",
      icon: User,
      description: "Preferencias personales del usuario",
    },
    {
      id: "anonymization" as SettingsTab,
      label: "Anonimización",
      icon: Sliders,
      description: "Configuraciones de técnicas de anonimización",
    },
    {
      id: "notifications" as SettingsTab,
      label: "Notificaciones",
      icon: Bell,
      description: "Configuración de notificaciones y alertas",
    },
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setHasChanges(false);
      // Aquí iría la lógica real de guardado
    } catch (error) {
      console.error("Error al guardar configuraciones:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres restablecer todas las configuraciones a sus valores por defecto?"
      )
    ) {
      setHasChanges(false);
      // Aquí iría la lógica de reset
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings onSettingsChange={() => setHasChanges(true)} />;
      case "security":
        return (
          <SecuritySettings onSettingsChange={() => setHasChanges(true)} />
        );
      case "preferences":
        return <UserPreferences onSettingsChange={() => setHasChanges(true)} />;
      case "anonymization":
        return (
          <AnonymizationSettings onSettingsChange={() => setHasChanges(true)} />
        );
      case "notifications":
        return (
          <NotificationSettings onSettingsChange={() => setHasChanges(true)} />
        );
      default:
        return <GeneralSettings onSettingsChange={() => setHasChanges(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configuraciones del Sistema
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona las configuraciones y preferencias del sistema de
                anonimización
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex-1">
                <p className="text-amber-800 font-medium">
                  Tienes cambios sin guardar
                </p>
                <p className="text-amber-600 text-sm">
                  Recuerda guardar tus cambios antes de salir
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResetSettings}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restablecer
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categorías
              </h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            isActive ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {tab.label}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
