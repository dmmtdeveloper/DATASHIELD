import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Square, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Settings,
  Download,
  Upload,
  Database,
  Calendar,
  BarChart3,
  Pause,
  RotateCcw,
  Trash2,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface BatchJob {
  id: string;
  name: string;
  description: string;
  technique: string;
  sourceTable: string;
  targetTable: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'scheduled';
  progress: number;
  recordsTotal: number;
  recordsProcessed: number;
  startTime?: Date;
  endTime?: Date;
  scheduledTime?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: number;
  createdBy: string;
  parameters: Record<string, any>;
}

const BatchExecution = () => {
  const [jobs, setJobs] = useState<BatchJob[]>([
    {
      id: '1',
      name: 'Anonimización Clientes Bancarios',
      description: 'Anonimización de datos personales de clientes del sector bancario',
      technique: 'Hashing (SHA-256)',
      sourceTable: 'customers_raw',
      targetTable: 'customers_anonymized',
      status: 'running',
      progress: 65,
      recordsTotal: 1250000,
      recordsProcessed: 812500,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high',
      estimatedDuration: 180,
      createdBy: 'admin@zurich.cl',
      parameters: { algorithm: 'SHA-256', salt: 'enabled' }
    },
    {
      id: '2',
      name: 'Tokenización Tarjetas de Crédito',
      description: 'Tokenización de números de tarjetas de crédito',
      technique: 'Tokenización',
      sourceTable: 'credit_cards',
      targetTable: 'credit_cards_tokenized',
      status: 'scheduled',
      progress: 0,
      recordsTotal: 500000,
      recordsProcessed: 0,
      scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      priority: 'critical',
      estimatedDuration: 90,
      createdBy: 'security@zurich.cl',
      parameters: { tokenFormat: 'alphanumeric', reversible: true }
    },
    {
      id: '3',
      name: 'Masking Datos Médicos',
      description: 'Enmascaramiento de información médica sensible',
      technique: 'Dynamic Data Masking',
      sourceTable: 'medical_records',
      targetTable: 'medical_records_masked',
      status: 'completed',
      progress: 100,
      recordsTotal: 750000,
      recordsProcessed: 750000,
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium',
      estimatedDuration: 120,
      createdBy: 'data@zurich.cl',
      parameters: { maskingPattern: 'partial', preserveFormat: true }
    }
  ]);

  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [newJob, setNewJob] = useState({
    name: '',
    description: '',
    technique: '',
    sourceTable: '',
    targetTable: '',
    priority: 'medium' as const,
    scheduledTime: '',
    parameters: {}
  });

  const techniques = [
    'Hashing (SHA-256)',
    'Hashing (SHA-1)',
    'Hashing (MD5)',
    'Tokenización',
    'Dynamic Data Masking',
    'Pseudonimización',
    'Encriptación AES-256',
    'Date Shifting',
    'Geographic Masking'
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      paused: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-purple-100 text-purple-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${badges[priority as keyof typeof badges]}`;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendiente',
      running: 'Ejecutando',
      completed: 'Completado',
      failed: 'Fallido',
      paused: 'Pausado',
      scheduled: 'Programado'
    };
    return texts[status as keyof typeof texts];
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      critical: 'Crítica'
    };
    return texts[priority as keyof typeof texts];
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const handleCreateJob = () => {
    const job: BatchJob = {
      id: Date.now().toString(),
      ...newJob,
      status: newJob.scheduledTime ? 'scheduled' : 'pending',
      progress: 0,
      recordsTotal: 0,
      recordsProcessed: 0,
      scheduledTime: newJob.scheduledTime ? new Date(newJob.scheduledTime) : undefined,
      estimatedDuration: 60,
      createdBy: 'current@user.cl'
    };
    
    setJobs([...jobs, job]);
    setShowNewJobModal(false);
    setNewJob({
      name: '',
      description: '',
      technique: '',
      sourceTable: '',
      targetTable: '',
      priority: 'medium',
      scheduledTime: '',
      parameters: {}
    });
  };

  const handleJobAction = (jobId: string, action: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        switch (action) {
          case 'start':
            return { ...job, status: 'running' as const, startTime: new Date() };
          case 'pause':
            return { ...job, status: 'paused' as const };
          case 'resume':
            return { ...job, status: 'running' as const };
          case 'stop':
            return { ...job, status: 'failed' as const, endTime: new Date() };
          case 'delete':
            return job;
          default:
            return job;
        }
      }
      return job;
    }).filter(job => !(job.id === jobId && action === 'delete')));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    scheduled: jobs.filter(j => j.status === 'scheduled').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Ejecución Batch
            </h1>
            <p className="text-gray-600">
              Gestión y monitoreo de trabajos de anonimización en lotes
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Reporte
            </button>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={() => setShowNewJobModal(true)}
            >
              <Plus className="w-4 h-4" />
              Nuevo Trabajo
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Trabajos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Database className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Ejecutando</p>
              <p className="text-2xl font-bold">{stats.running}</p>
            </div>
            <Play className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completados</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Fallidos</p>
              <p className="text-2xl font-bold">{stats.failed}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Programados</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar trabajos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="running">Ejecutando</option>
              <option value="completed">Completado</option>
              <option value="failed">Fallido</option>
              <option value="scheduled">Programado</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">Trabajo</th>
                <th className="px-6 py-3 text-left">Técnica</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Progreso</th>
                <th className="px-6 py-3 text-left">Prioridad</th>
                <th className="px-6 py-3 text-left">Tiempo</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{job.name}</div>
                      <div className="text-sm text-gray-500">{job.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {job.sourceTable} → {job.targetTable}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {job.technique}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(job.status)}>
                      {getStatusText(job.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{job.progress}%</span>
                        <span>{formatNumber(job.recordsProcessed)} / {formatNumber(job.recordsTotal)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getPriorityBadge(job.priority)}>
                      {getPriorityText(job.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {job.status === 'scheduled' && job.scheduledTime && (
                        <div className="text-purple-600">
                          Programado: {job.scheduledTime.toLocaleString('es-CL')}
                        </div>
                      )}
                      {job.status === 'running' && job.startTime && (
                        <div className="text-blue-600">
                          Iniciado: {job.startTime.toLocaleString('es-CL')}
                        </div>
                      )}
                      {job.status === 'completed' && job.endTime && (
                        <div className="text-green-600">
                          Completado: {job.endTime.toLocaleString('es-CL')}
                        </div>
                      )}
                      <div className="text-gray-500 text-xs">
                        Duración estimada: {formatDuration(job.estimatedDuration)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {job.status === 'pending' && (
                        <button
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => handleJobAction(job.id, 'start')}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === 'running' && (
                        <button
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          onClick={() => handleJobAction(job.id, 'pause')}
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === 'paused' && (
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => handleJobAction(job.id, 'resume')}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => setSelectedJob(job)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => handleJobAction(job.id, 'delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Nuevo Trabajo Batch
              </h2>
              <button
                onClick={() => setShowNewJobModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Trabajo *
                  </label>
                  <input
                    type="text"
                    value={newJob.name}
                    onChange={(e) => setNewJob({...newJob, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: Anonimización Clientes Q1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={newJob.priority}
                    onChange={(e) => setNewJob({...newJob, priority: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  rows={3}
                  placeholder="Descripción del trabajo de anonimización"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tabla Origen *
                  </label>
                  <input
                    type="text"
                    value={newJob.sourceTable}
                    onChange={(e) => setNewJob({...newJob, sourceTable: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: customers_raw"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tabla Destino *
                  </label>
                  <input
                    type="text"
                    value={newJob.targetTable}
                    onChange={(e) => setNewJob({...newJob, targetTable: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="Ej: customers_anonymized"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Técnica de Anonimización *
                  </label>
                  <select
                    value={newJob.technique}
                    onChange={(e) => setNewJob({...newJob, technique: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    <option value="">Seleccionar técnica</option>
                    {techniques.map(technique => (
                      <option  key={technique} value={technique}>{technique}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programar Ejecución (Opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newJob.scheduledTime}
                    onChange={(e) => setNewJob({...newJob, scheduledTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowNewJobModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateJob}
                className="btn-primary flex items-center gap-2"
                disabled={!newJob.name || !newJob.technique || !newJob.sourceTable || !newJob.targetTable}
              >
                <Plus className="w-4 h-4" />
                Crear Trabajo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Trabajo: {selectedJob.name}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Información General</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={getStatusBadge(selectedJob.status)}>
                          {getStatusText(selectedJob.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prioridad:</span>
                        <span className={getPriorityBadge(selectedJob.priority)}>
                          {getPriorityText(selectedJob.priority)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Técnica:</span>
                        <span className="font-medium text-gray-800">{selectedJob.technique}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Creado por:</span>
                        <span className="font-medium text-gray-800">{selectedJob.createdBy}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Tablas</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origen:</span>
                        <span className="font-medium text-gray-800">{selectedJob.sourceTable}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destino:</span>
                        <span className="font-medium text-gray-800">{selectedJob.targetTable}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Progreso</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-800">Progreso: {selectedJob.progress}%</span>
                        <span className="text-gray-800">{formatNumber(selectedJob.recordsProcessed)} / {formatNumber(selectedJob.recordsTotal)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedJob.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Tiempos</h3>
                    <div className="space-y-2">
                      {selectedJob.startTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inicio:</span>
                          <span className="font-medium">{selectedJob.startTime.toLocaleString('es-CL')}</span>
                        </div>
                      )}
                      {selectedJob.endTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fin:</span>
                          <span className="font-medium">{selectedJob.endTime.toLocaleString('es-CL')}</span>
                        </div>
                      )}
                      {selectedJob.scheduledTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Programado:</span>
                          <span className="font-medium text-gray-800">{selectedJob.scheduledTime.toLocaleString('es-CL')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duración estimada:</span>
                        <span className="font-medium text-gray-800">{formatDuration(selectedJob.estimatedDuration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Parámetros de Configuración</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700">
                    {JSON.stringify(selectedJob.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchExecution;