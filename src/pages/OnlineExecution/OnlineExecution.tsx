import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Settings, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import DataInputSelector from '../../components/execution/DataInputSelector/DataInputSelector';
import RealTimeProcessor from '../../components/execution/RealTimeProcessor/RealTimeProcessor';
import LiveMonitoring from '../../components/execution/LiveMonitoring/LiveMonitoring';
import type { OnlineSession } from '../../types/online.types';
import NewSessionModal from '../../components/execution/OnlineExecution/NewSessionModal';

const OnlineExecution: React.FC = () => {
  const [activeSession, setActiveSession] = useState<OnlineSession | null>(null);
  const [sessions, setSessions] = useState<OnlineSession[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'input' | 'processor' | 'monitoring'>('input');

  const mockSessions: OnlineSession[] = [
    {
      id: '1',
      name: 'API Clientes - Anonimización RUT',
      description: 'Procesamiento en tiempo real de datos de clientes desde API externa',
      technique: 'hashing',
      inputSource: {
        type: 'api',
        name: 'API Clientes',
        configuration: {
          endpoint: 'https://api.empresa.cl/clientes',
          headers: { 'Authorization': 'Bearer token123' },
          pollInterval: 5000
        },
        schema: [
          { fieldName: 'rut', dataType: 'string', isSensitive: true, anonymizationTechnique: 'hashing', required: true },
          { fieldName: 'nombre', dataType: 'string', isSensitive: true, anonymizationTechnique: 'masking', required: true },
          { fieldName: 'email', dataType: 'string', isSensitive: true, anonymizationTechnique: 'tokenization', required: false }
        ]
      },
      outputTarget: {
        type: 'database',
        name: 'BD Anonimizada',
        configuration: {
          connectionString: 'Server=localhost;Database=AnonymizedData;',
          tableName: 'clientes_anonimizados'
        }
      },
      status: 'running',
      startTime: new Date(Date.now() - 3600000),
      recordsProcessed: 15420,
      recordsPerSecond: 45,
      errorCount: 3,
      createdBy: 'admin',
      parameters: { saltKey: 'secret123', preserveFormat: true },
      isActive: true
    },
    {
      id: '2',
      name: 'Stream Transacciones',
      description: 'Anonimización de datos de transacciones en tiempo real',
      technique: 'tokenization',
      inputSource: {
        type: 'stream',
        name: 'Kafka Stream',
        configuration: {
          endpoint: 'kafka://localhost:9092/transactions',
          pollInterval: 1000
        },
        schema: [
          { fieldName: 'cardNumber', dataType: 'string', isSensitive: true, anonymizationTechnique: 'tokenization', required: true },
          { fieldName: 'amount', dataType: 'number', isSensitive: false, required: true }
        ]
      },
      outputTarget: {
        type: 'stream',
        name: 'Output Stream',
        configuration: {
          endpoint: 'kafka://localhost:9092/anonymized-transactions'
        }
      },
      status: 'paused',
      startTime: new Date(Date.now() - 1800000),
      recordsProcessed: 8750,
      recordsPerSecond: 0,
      errorCount: 1,
      createdBy: 'admin',
      parameters: { tokenVault: 'vault1' },
      isActive: false
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
    setActiveSession(mockSessions[0]);
  }, []);

  const handleStartSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'running', isActive: true, startTime: new Date() }
        : session
    ));
  };

  const handlePauseSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'paused', isActive: false }
        : session
    ));
  };

  const handleStopSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'stopped', isActive: false, endTime: new Date() }
        : session
    ));
  };

  const getStatusIcon = (status: OnlineSession['status']) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: OnlineSession['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'running':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'paused':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'stopped':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Ejecución Online
          </h1>
          <p className="text-gray-600">
            Procesamiento y anonimización de datos en tiempo real
          </p>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Nueva Sesión
        </button>
      </div>

      {/* Sessions Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl text-gray-700 font-semibold mb-4">Sesiones Activas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                activeSession?.id === session.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveSession(session)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(session.status)}
                  <span className="font-medium text-gray-900">{session.name}</span>
                </div>
                <span className={getStatusBadge(session.status)}>
                  {session.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{session.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Procesados: {session.recordsProcessed.toLocaleString()}</div>
                <div>Velocidad: {session.recordsPerSecond}/s</div>
                <div>Errores: {session.errorCount}</div>
                <div>Técnica: {session.technique}</div>
              </div>
              
              {/* Control buttons */}
              <div className="flex gap-2 mt-3">
                {session.status === 'running' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePauseSession(session.id);
                    }}
                    className="px-2 py-1 text-xs text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200"
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSession(session.id);
                    }}
                    className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded hover:bg-green-200"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopSession(session.id);
                  }}
                  className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded hover:bg-red-200"
                >
                  <Square className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      {activeSession && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'input', label: 'Fuente de Datos', icon: Settings },
                { id: 'processor', label: 'Procesador', icon: Activity },
                { id: 'monitoring', label: 'Monitoreo', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'input' && (
              <DataInputSelector 
                session={activeSession}
                onSessionUpdate={setActiveSession}
              />
            )}
            {selectedTab === 'processor' && (
              <RealTimeProcessor 
                session={activeSession}
                onSessionUpdate={setActiveSession}
              />
            )}
            {selectedTab === 'monitoring' && (
              <LiveMonitoring 
                session={activeSession}
              />
            )}
          </div>
        </div>
      )}
  // Agregar al final del componente, antes del cierre del div principal:
        {/* Modal de Nueva Sesión */}
   <NewSessionModal 
          isOpen={showConfig}
          onClose={() => setShowConfig(false)}
          onCreateSession={(newSession) => {
            setSessions(prev => [...prev, newSession]);
            setActiveSession(newSession);
            setShowConfig(false);
          }}
        />
    </div>
  );
};


export default OnlineExecution;
