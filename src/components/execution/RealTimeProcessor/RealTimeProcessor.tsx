import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Settings, Zap, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { OnlineSession, ProcessingRule } from '../../../types/online.types';


interface RealTimeProcessorProps {
  session: OnlineSession;
  onSessionUpdate: (session: OnlineSession) => void;
}

const RealTimeProcessor: React.FC<RealTimeProcessorProps> = ({ session, onSessionUpdate }) => {
  const [processingRules, setProcessingRules] = useState<ProcessingRule[]>([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [processingStats, setProcessingStats] = useState({
    totalProcessed: session.recordsProcessed,
    successRate: 97.5,
    avgLatency: 45,
    currentThroughput: session.recordsPerSecond
  });

  const techniques = [
    { value: 'hashing', label: 'Hashing SHA-256', description: 'Hash irreversible con salt' },
    { value: 'masking', label: 'Masking', description: 'Enmascaramiento de caracteres' },
    { value: 'tokenization', label: 'Tokenización', description: 'Reemplazo por tokens únicos' },
    { value: 'encryption', label: 'Encriptación AES', description: 'Encriptación reversible' },
    { value: 'generalization', label: 'Generalización', description: 'Reducción de precisión' },
    { value: 'suppression', label: 'Supresión', description: 'Eliminación de datos' }
  ];

  const ruleActions = [
    { value: 'anonymize', label: 'Anonimizar', color: 'blue' },
    { value: 'skip', label: 'Omitir', color: 'gray' },
    { value: 'alert', label: 'Alertar', color: 'yellow' },
    { value: 'reject', label: 'Rechazar', color: 'red' }
  ];

  useEffect(() => {
    // Simular actualización de estadísticas en tiempo real
    const interval = setInterval(() => {
      if (session.status === 'running') {
        setProcessingStats(prev => ({
          ...prev,
          totalProcessed: prev.totalProcessed + Math.floor(Math.random() * 10) + 5,
          currentThroughput: Math.floor(Math.random() * 20) + 40,
          avgLatency: Math.floor(Math.random() * 20) + 35
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session.status]);

  const handleStartProcessing = () => {
    const updatedSession = {
      ...session,
      status: 'running' as const,
      startTime: new Date(),
      isActive: true
    };
    onSessionUpdate(updatedSession);
  };

  const handlePauseProcessing = () => {
    const updatedSession = {
      ...session,
      status: 'paused' as const,
      isActive: false
    };
    onSessionUpdate(updatedSession);
  };

  const handleStopProcessing = () => {
    const updatedSession = {
      ...session,
      status: 'stopped' as const,
      endTime: new Date(),
      isActive: false
    };
    onSessionUpdate(updatedSession);
  };

  const addProcessingRule = () => {
    const newRule: ProcessingRule = {
      id: Date.now().toString(),
      fieldName: '',
      condition: '',
      action: 'anonymize',
      technique: 'hashing'
    };
    setProcessingRules([...processingRules, newRule]);
  };

  const removeProcessingRule = (ruleId: string) => {
    setProcessingRules(processingRules.filter(rule => rule.id !== ruleId));
  };

  const updateProcessingRule = (ruleId: string, updates: Partial<ProcessingRule>) => {
    setProcessingRules(processingRules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const getStatusColor = (status: OnlineSession['status']) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-gray-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Processing Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Control de Procesamiento</h3>
          <div className={`flex items-center gap-2 ${getStatusColor(session.status)}`}>
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-sm font-medium capitalize">{session.status}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {session.status !== 'running' ? (
            <button
              onClick={handleStartProcessing}
              className="px-4 py-2 text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Procesamiento
            </button>
          ) : (
            <button
              onClick={handlePauseProcessing}
              className="px-4 py-2 text-white bg-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </button>
          )}
          
          <button
            onClick={handleStopProcessing}
            className="px-4 py-2 text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Detener
          </button>

          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="px-4 py-2 text-blue-600 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configuración Avanzada
          </button>
        </div>

        {/* Processing Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Procesados</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{processingStats.totalProcessed.toLocaleString()}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Throughput</span>
            </div>
            <p className="text-lg font-bold text-green-900">{processingStats.currentThroughput}/s</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Latencia</span>
            </div>
            <p className="text-lg font-bold text-purple-900">{processingStats.avgLatency}ms</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Éxito</span>
            </div>
            <p className="text-lg font-bold text-yellow-900">{processingStats.successRate}%</p>
          </div>
        </div>
      </div>

      {/* Technique Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Técnicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnica Principal
            </label>
            <select
              value={session.technique}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {techniques.map(technique => (
                <option key={technique.value} value={technique.value}>
                  {technique.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {techniques.find(t => t.value === session.technique)?.description}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parámetros de Técnica
            </label>
            <div className="space-y-2">
              {Object.entries(session.parameters).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-24">{key}:</span>
                  <input
                    type="text"
                    value={value}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processing Rules */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reglas de Procesamiento</h3>
          <button
            onClick={addProcessingRule}
            className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
          >
            Agregar Regla
          </button>
        </div>

        <div className="space-y-3">
          {processingRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Campo
                  </label>
                  <select
                    value={rule.fieldName}
                    onChange={(e) => updateProcessingRule(rule.id, { fieldName: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar campo</option>
                    {session.inputSource.schema.map(field => (
                      <option key={field.fieldName} value={field.fieldName}>
                        {field.fieldName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Condición
                  </label>
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => updateProcessingRule(rule.id, { condition: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: length > 10"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Acción
                  </label>
                  <select
                    value={rule.action}
                    onChange={(e) => updateProcessingRule(rule.id, { action: e.target.value as any })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ruleActions.map(action => (
                      <option key={action.value} value={action.value}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => removeProcessingRule(rule.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-100 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              {rule.action === 'anonymize' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Técnica Específica
                  </label>
                  <select
                    value={rule.technique || ''}
                    onChange={(e) => updateProcessingRule(rule.id, { technique: e.target.value })}
                    className="w-full md:w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Usar técnica principal</option>
                    {techniques.map(technique => (
                      <option key={technique.value} value={technique.value}>
                        {technique.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvancedSettings && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración Avanzada</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máx. Registros/Segundo
              </label>
              <input
                type="number"
                defaultValue={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de Buffer
              </label>
              <input
                type="number"
                defaultValue={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reintentos en Error
              </label>
              <input
                type="number"
                defaultValue={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeProcessor;