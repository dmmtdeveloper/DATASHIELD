import React from 'react';
import { X, Edit, Calendar, Database, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { Universe } from '../../../types/universe';

interface UniverseDetailsProps {
  universe: Universe;
  onClose: () => void;
  onEdit: () => void;
}

const UniverseDetails: React.FC<UniverseDetailsProps> = ({ universe, onClose, onEdit }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleString('es-CL');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CL');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'anonimizado': return 'text-green-600 bg-green-100';
      case 'en_proceso': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'anonimizado': return 'Anonimizado';
      case 'en_proceso': return 'En Proceso';
      case 'error': return 'Error';
      default: return 'Pendiente';
    }
  };

  const getTechniqueText = (technique: string) => {
    switch (technique) {
      case 'masking': return 'Enmascaramiento';
      case 'pseudonymization': return 'Pseudonimización';
      case 'generalization': return 'Generalización';
      case 'suppression': return 'Supresión';
      case 'encryption': return 'Encriptación';
      default: return technique;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      default: return 'Baja';
    }
  };

  const progress = universe.recordsTotal > 0 
    ? Math.round((universe.recordsProcessed / universe.recordsTotal) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-gray-700/90  flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Universo</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">ID Cliente</label>
                <p className="text-lg font-semibold text-gray-900">{universe.clientId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Cliente</label>
                <p className="text-lg font-semibold text-gray-900">{universe.clientName}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
                <p className="text-gray-900">{universe.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(universe.status)}`}>
                  {getStatusText(universe.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Creación</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatDate(universe.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Progreso */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Progreso de Anonimización
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progreso General</span>
                <span className="text-2xl font-bold text-green-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(universe.recordsTotal)}</div>
                  <div className="text-sm text-gray-600">Total Registros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(universe.recordsProcessed)}</div>
                  <div className="text-sm text-gray-600">Procesados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(universe.recordsTotal - universe.recordsProcessed)}</div>
                  <div className="text-sm text-gray-600">Pendientes</div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Última Ejecución</label>
                <p className="text-gray-900">{formatDate(universe.lastExecution)}</p>
              </div>
            </div>
          </div>

          {/* Reglas de Anonimización */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Reglas de Anonimización
            </h3>
            <div className="space-y-3">
              {universe.anonymizationRules.map((rule, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Campo</label>
                      <p className="font-semibold text-gray-900">{rule.field}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Técnica</label>
                      <p className="text-gray-900">{getTechniqueText(rule.technique)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Prioridad</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                        {getPriorityText(rule.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cumplimiento Normativo */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Cumplimiento Normativo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                {universe.complianceStatus.ley19628 ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">Ley 19.628</p>
                  <p className="text-sm text-gray-600">
                    {universe.complianceStatus.ley19628 ? 'Cumple' : 'No cumple'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {universe.complianceStatus.ley21719 ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">Ley 21.719</p>
                  <p className="text-sm text-gray-600">
                    {universe.complianceStatus.ley21719 ? 'Cumple' : 'No cumple'}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Última Auditoría</label>
                <p className="text-gray-900">{formatDate(universe.complianceStatus.lastAudit)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseDetails;