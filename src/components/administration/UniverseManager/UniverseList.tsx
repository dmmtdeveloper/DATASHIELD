import React from 'react';
import { Eye, Edit, Trash2, Play, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { Universe } from '../../../types/universe';

interface UniverseListProps {
  universes: Universe[];
  onSelectUniverse: (universe: Universe) => void;
  onEditUniverse: (universe: Universe) => void;
  onDeleteUniverse: (id: string) => void;
  onExecuteAnonymization: (id: string) => void;
  isLoading: boolean;
}

const UniverseList: React.FC<UniverseListProps> = ({
  universes,
  onSelectUniverse,
  onEditUniverse,
  onDeleteUniverse,
  onExecuteAnonymization,
  isLoading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'anonimizado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'en_proceso':
        return <Clock className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'anonimizado':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'en_proceso':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-CL');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CL');
  };

  const getProgressPercentage = (universe: Universe) => {
    if (universe.recordsTotal === 0) return 0;
    return Math.round((universe.recordsProcessed / universe.recordsTotal) * 100);
  };

  if (universes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <AlertCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay universos</h3>
        <p className="text-gray-500">Crea tu primer universo para comenzar con la anonimización</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progreso</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Última Ejecución</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cumplimiento</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {universes.map((universe) => {
              const progress = getProgressPercentage(universe);
              return (
                <tr key={universe.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{universe.clientName}</div>
                      <div className="text-sm text-gray-500">{universe.clientId}</div>
                      <div className="text-xs text-gray-400 mt-1">{universe.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(universe.status)}
                      <span className={getStatusBadge(universe.status)}>
                        {getStatusText(universe.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(universe.recordsProcessed)} / {formatNumber(universe.recordsTotal)} registros
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(universe.lastExecution)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          universe.complianceStatus.ley19628 ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Ley 19.628</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          universe.complianceStatus.ley21719 ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Ley 21.719</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectUniverse(universe)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditUniverse(universe)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {universe.status === 'pendiente' && (
                        <button
                          onClick={() => onExecuteAnonymization(universe.id)}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Ejecutar anonimización"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteUniverse(universe.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniverseList;