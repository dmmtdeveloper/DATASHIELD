import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, RefreshCw } from 'lucide-react';
import UniverseList from './UniverseList';
import UniverseForm from './UniverseForm';
import UniverseDetails from './UniverseDetails';
import type { Universe, UniverseStatus } from '../../../types/universe';


const UniverseManager: React.FC = () => {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UniverseStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Datos de ejemplo
  useEffect(() => {
    const mockUniverses: Universe[] = [
      {
        id: '1',
        clientId: 'CLI001',
        clientName: 'Banco Nacional',
        description: 'Base de datos de clientes bancarios',
        status: 'anonimizado',
        createdAt: '2024-01-15T10:30:00Z',
        lastExecution: '2024-01-20T14:30:00Z',
        recordsTotal: 125000,
        recordsProcessed: 125000,
        anonymizationRules: [
          { field: 'rut', technique: 'masking', priority: 'high' },
          { field: 'email', technique: 'pseudonymization', priority: 'medium' },
          { field: 'phone', technique: 'generalization', priority: 'low' }
        ],
        complianceStatus: {
          ley19628: true,
          ley21719: true,
          lastAudit: '2024-01-18T09:00:00Z'
        }
      },
      {
        id: '2',
        clientId: 'CLI002',
        clientName: 'Seguros del Sur',
        description: 'Datos de pólizas y siniestros',
        status: 'pendiente',
        createdAt: '2024-01-10T08:15:00Z',
        lastExecution: null,
        recordsTotal: 89500,
        recordsProcessed: 0,
        anonymizationRules: [
          { field: 'rut', technique: 'masking', priority: 'high' },
          { field: 'address', technique: 'generalization', priority: 'medium' }
        ],
        complianceStatus: {
          ley19628: false,
          ley21719: false,
          lastAudit: null
        }
      },
      {
        id: '3',
        clientId: 'CLI003',
        clientName: 'Retail Express',
        description: 'Base de datos de clientes retail',
        status: 'en_proceso',
        createdAt: '2024-01-16T11:45:00Z',
        lastExecution: '2024-01-21T16:20:00Z',
        recordsTotal: 156200,
        recordsProcessed: 78100,
        anonymizationRules: [
          { field: 'rut', technique: 'masking', priority: 'high' },
          { field: 'email', technique: 'pseudonymization', priority: 'high' },
          { field: 'purchase_history', technique: 'suppression', priority: 'low' }
        ],
        complianceStatus: {
          ley19628: true,
          ley21719: false,
          lastAudit: '2024-01-19T14:30:00Z'
        }
      }
    ];
    setUniverses(mockUniverses);
  }, []);

  const filteredUniverses = universes.filter(universe => {
    const matchesSearch = universe.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         universe.clientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || universe.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateUniverse = (universeData: Partial<Universe>) => {
    const newUniverse: Universe = {
      ...universeData as Universe,
      ...universeData as Universe,
      createdAt: new Date().toISOString(),
      recordsProcessed: 0,
      complianceStatus: {
        ley19628: false,
        ley21719: false,
        lastAudit: null
      }
    };
    setUniverses([...universes, newUniverse]);
    setShowForm(false);
  };

  const handleUpdateUniverse = (updatedUniverse: Universe) => {
    setUniverses(universes.map(u => u.id === updatedUniverse.id ? updatedUniverse : u));
    setSelectedUniverse(updatedUniverse);
  };

  const handleDeleteUniverse = (universeId: string) => {
    setUniverses(universes.filter(u => u.id !== universeId));
    if (selectedUniverse?.id === universeId) {
      setSelectedUniverse(null);
      setShowDetails(false);
    }
  };

  const handleExecuteAnonymization = async (universeId: string) => {
    setIsLoading(true);
    // Simular proceso de anonimización
    setTimeout(() => {
      const updatedUniverses = universes.map(u => {
        if (u.id === universeId) {
          return {
            ...u,
            status: 'en_proceso' as UniverseStatus,
            lastExecution: new Date().toISOString()
          };
        }
        return u;
      });
      setUniverses(updatedUniverses);
      setIsLoading(false);
    }, 2000);
  };

  const getStatusStats = () => {
    const stats = {
      total: universes.length,
      anonimizado: universes.filter(u => u.status === 'anonimizado').length,
      pendiente: universes.filter(u => u.status === 'pendiente').length,
      en_proceso: universes.filter(u => u.status === 'en_proceso').length,
      error: universes.filter(u => u.status === 'error').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Administración de Universos
              </h1>
              <p className="text-gray-600 mt-2">Gestión completa de universos de anonimización</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Nuevo Universo
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm">Total Universos</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.anonimizado}</div>
              <div className="text-green-100 text-sm">Anonimizados</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.pendiente}</div>
              <div className="text-yellow-100 text-sm">Pendientes</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.en_proceso}</div>
              <div className="text-orange-100 text-sm">En Proceso</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.error}</div>
              <div className="text-red-100 text-sm">Con Errores</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UniverseStatus | 'all')}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="anonimizado">Anonimizado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="error">Error</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Universe List */}
        <UniverseList
          universes={filteredUniverses}
          onSelectUniverse={(universe: Universe) => {
            setSelectedUniverse(universe);
            setShowDetails(true);
          }}
          onEditUniverse={(universe: Universe) => {
            setSelectedUniverse(universe);
            setShowForm(true);
          }}
          onDeleteUniverse={handleDeleteUniverse}
          onExecuteAnonymization={handleExecuteAnonymization}
          isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      {showForm && (
        <UniverseForm
          universe={selectedUniverse}
          onSave={(universe) => {
            if (selectedUniverse) {
              handleUpdateUniverse(universe as Universe);
            } else {
              handleCreateUniverse(universe as Universe);

            }
          }}
          onClose={() => {
            setShowForm(false);
            setSelectedUniverse(null);
          }}
        />
      )}

      {showDetails && selectedUniverse && (
        <UniverseDetails
          universe={selectedUniverse}
          onClose={() => {
            setShowDetails(false);
            setSelectedUniverse(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default UniverseManager;