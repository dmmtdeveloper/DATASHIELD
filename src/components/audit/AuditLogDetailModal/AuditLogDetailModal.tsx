import React from 'react';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { AuditLog } from '../../../types/audit.types';

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  const formatTimestamp = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Santiago'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failure':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Detalles del Registro de Auditoría</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Información General</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID:</dt>
                  <dd className="text-sm text-gray-900">{log.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Timestamp:</dt>
                  <dd className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duración:</dt>
                  <dd className="text-sm text-gray-900">{log.duration}ms</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">IP Address:</dt>
                  <dd className="text-sm text-gray-900">{log.ipAddress}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Usuario y Sesión</h4>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Usuario:</dt>
                  <dd className="text-sm text-gray-900">{log.userName} ({log.userId})</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rol:</dt>
                  <dd className="text-sm text-gray-900">{log.userRole}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sesión:</dt>
                  <dd className="text-sm text-gray-900">{log.sessionId}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Action Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Detalles de la Acción</h4>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Acción:</dt>
                <dd className="text-sm text-gray-900">{log.action}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Módulo:</dt>
                <dd className="text-sm text-gray-900">{log.module}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Estado:</dt>
                <dd className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  <span className="text-sm text-gray-900 capitalize">{log.status}</span>
                </dd>
              </div>
            </dl>
            
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500">Descripción:</dt>
              <dd className="text-sm text-gray-900 mt-1">{log.details}</dd>
            </div>
          </div>
          
          {/* Resource Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recurso Afectado</h4>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre:</dt>
                <dd className="text-sm text-gray-900">{log.resourceName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo:</dt>
                <dd className="text-sm text-gray-900">{log.resourceType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ID:</dt>
                <dd className="text-sm text-gray-900">{log.resourceId}</dd>
              </div>
            </dl>
          </div>
          
          {/* Metadata */}
          {Object.keys(log.metadata).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Metadatos</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {/* Changes */}
          {log.changes && log.changes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Cambios Realizados</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Campo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor Anterior</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor Nuevo</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {log.changes.map((change, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{change.field}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {change.oldValue !== null ? String(change.oldValue) : '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {change.newValue !== null ? String(change.newValue) : '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{change.changeType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailModal;