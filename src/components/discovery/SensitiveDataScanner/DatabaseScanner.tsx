import React, { useState } from 'react';
import { Search, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const DatabaseScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const databases = [
    { name: 'SQL Server - Producción', status: 'completed', tables: 45, sensitive: 12 },
    { name: 'PostgreSQL - CRM', status: 'completed', tables: 23, sensitive: 8 },
    { name: 'Oracle - Financiero', status: 'scanning', tables: 67, sensitive: 15 },
    { name: 'DB2/AS400 - Legacy', status: 'pending', tables: 89, sensitive: 0 }
  ];

  const handleScan = () => {
    setScanning(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scanning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'scanning': return 'Escaneando';
      default: return 'Pendiente';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'status-badge status-active';
      case 'scanning': return 'status-badge status-pending';
      default: return 'status-badge status-inactive';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Escaneo de Bases de Datos
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          <span className="text-blue-800 text-sm">
            Identificación de motores de BD: SQL Server, PostgreSQL, Oracle, DB2/AS400
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {databases.map((db, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-700">{db.name}</span>
              </div>
              <span className={getStatusBadge(db.status)}>
                {getStatusText(db.status)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Tablas: {db.tables} | Datos sensibles: {db.sensitive}
            </p>
            {db.status === 'scanning' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            scanning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleScan}
          disabled={scanning}
        >
          <Search className="w-4 h-4" />
          {scanning ? 'Escaneando...' : 'Iniciar Escaneo Completo'}
        </button>
        
        {scanning && (
          <div className="flex items-center gap-3">
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseScanner;