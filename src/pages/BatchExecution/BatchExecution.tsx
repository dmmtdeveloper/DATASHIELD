import { useState, useEffect } from 'react';
import BatchJobConfigurator from '../../components/execution/BatchJobConfigurator/BatchJobConfigurator';
import RealTimeMonitoringPanel from '../../components/execution/RealTimeMonitoringPanel';
import { useRealTimeJobMonitoring } from '../../hooks/useRealTimeJobMonitoring';
import DataTable, { Column } from '../../components/ui/DataTable/DataTable';
import Button from '../../components/ui/Button/Button';
import StatusBadge from '../../components/batch/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/batch/PriorityBadge/PriorityBadge';
import { BatchJob } from '../../types/batch.types';
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
  Search,
  Activity
} from 'lucide-react';

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

  const [showJobConfigurator, setShowJobConfigurator] = useState(false);
  const [selectedJob, setSelectedJob] = useState<BatchJob | null>(null);
  const [selectedRows, setSelectedRows] = useState<BatchJob[]>([]);
  
  const { isMonitoring, startMonitoring, stopMonitoring } = useRealTimeJobMonitoring();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const handleJobConfigured = (jobConfig: any) => {
    const job: BatchJob = {
      id: Date.now().toString(),
      name: jobConfig.name,
      description: jobConfig.description,
      technique: jobConfig.columnMappings[0]?.technique || 'No especificada',
      sourceTable: jobConfig.sourceTable,
      targetTable: jobConfig.targetTable,
      status: jobConfig.schedule.type === 'immediate' ? 'pending' : 'scheduled',
      progress: 0,
      recordsTotal: 0,
      recordsProcessed: 0,
      scheduledTime: jobConfig.schedule.datetime ? new Date(jobConfig.schedule.datetime) : undefined,
      priority: 'medium',
      estimatedDuration: 60,
      createdBy: 'current@user.cl',
      parameters: {
        columnMappings: jobConfig.columnMappings,
        filters: jobConfig.filters,
        performance: jobConfig.performance,
        validation: jobConfig.validation,
        notifications: jobConfig.notifications
      }
    };
    
    setJobs([...jobs, job]);
    setShowJobConfigurator(false);
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

  const stats = {
    total: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    scheduled: jobs.filter(j => j.status === 'scheduled').length
  };

  // Configuración de columnas para DataTable
  const columns: Column<BatchJob>[] = [
    {
      key: 'name',
      header: 'Trabajo',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
          <div className="text-xs text-gray-400 mt-1">
            {row.sourceTable} → {row.targetTable}
          </div>
        </div>
      )
    },
    {
      key: 'technique',
      header: 'Técnica',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (value, row) => <StatusBadge job={row} />
    },
    {
      key: 'progress',
      header: 'Progreso',
      sortable: true,
      render: (value, row) => (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>{row.progress}%</span>
            <span>{formatNumber(row.recordsProcessed)} / {formatNumber(row.recordsTotal)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${row.progress}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Prioridad',
      sortable: true,
      render: (value, row) => <PriorityBadge job={row} />
    },
    {
      key: 'startTime',
      header: 'Tiempo',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          {row.status === 'scheduled' && row.scheduledTime && (
            <div className="text-purple-600">
              Programado: {row.scheduledTime.toLocaleString('es-CL')}
            </div>
          )}
          {row.status === 'running' && row.startTime && (
            <div className="text-blue-600">
              Iniciado: {row.startTime.toLocaleString('es-CL')}
            </div>
          )}
          {row.status === 'completed' && row.endTime && (
            <div className="text-green-600">
              Completado: {row.endTime.toLocaleString('es-CL')}
            </div>
          )}
          <div className="text-gray-500 text-xs">
            Duración estimada: {formatDuration(row.estimatedDuration)}
          </div>
        </div>
      )
    }
  ];

  // Acciones para cada fila
  const tableActions = [
    {
      label: 'Ver',
      icon: Eye,
      variant: 'outline' as const,
      onClick: (job: BatchJob) => setSelectedJob(job)
    },
    {
      label: 'Iniciar',
      icon: Play,
      variant: 'primary' as const,
      onClick: (job: BatchJob) => handleJobAction(job.id, 'start')
    },
    {
      label: 'Pausar',
      icon: Pause,
      variant: 'secondary' as const,
      onClick: (job: BatchJob) => handleJobAction(job.id, 'pause')
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: (job: BatchJob) => handleJobAction(job.id, 'delete')
    }
  ];

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
            <Button variant="outline" icon={Download}>
              Exportar Reporte
            </Button>
            <Button 
              variant="primary" 
              icon={Plus}
              onClick={() => setShowJobConfigurator(true)}
            >
              Nuevo Trabajo
            </Button>
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
              {isMonitoring && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-200 text-xs">En vivo</span>
                </div>
              )}
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

      {/* Jobs Table usando DataTable */}
      <DataTable
        data={jobs}
        columns={columns}
        actions={tableActions}
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
        selectable={true}
        onRowSelect={setSelectedRows}
        onRowClick={(job) => setSelectedJob(job)}
        emptyMessage="No hay trabajos de anonimización configurados"
      />

      {/* Real-time Monitoring Panel */}
      {isMonitoring && (
        <RealTimeMonitoringPanel />
      )}

      {/* Job Configurator Modal */}
      {showJobConfigurator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <BatchJobConfigurator
              onSave={handleJobConfigured}
              onCancel={() => setShowJobConfigurator(false)}
            />
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
              <Button
                variant="outline"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Descripción:</span>
                      <p className="text-gray-900">{selectedJob.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Técnica:</span>
                      <p className="text-gray-900">{selectedJob.technique}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Estado:</span>
                      <div className="mt-1">
                        <StatusBadge job={selectedJob} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                      <div className="mt-1">
                        <PriorityBadge job={selectedJob} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso y Estadísticas</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Progreso:</span>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{selectedJob.progress}%</span>
                          <span>{formatNumber(selectedJob.recordsProcessed)} / {formatNumber(selectedJob.recordsTotal)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedJob.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duración Estimada:</span>
                      <p className="text-gray-900">{formatDuration(selectedJob.estimatedDuration)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Creado por:</span>
                      <p className="text-gray-900">{selectedJob.createdBy}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tablas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500">Tabla Origen:</span>
                    <p className="text-gray-900 font-mono">{selectedJob.sourceTable}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500">Tabla Destino:</span>
                    <p className="text-gray-900 font-mono">{selectedJob.targetTable}</p>
                  </div>
                </div>
              </div>
              
              {selectedJob.parameters && Object.keys(selectedJob.parameters).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Parámetros</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedJob.parameters, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedJob(null)}
              >
                Cerrar
              </Button>
              {selectedJob.status === 'pending' && (
                <Button
                  variant="primary"
                  icon={Play}
                  onClick={() => {
                    handleJobAction(selectedJob.id, 'start');
                    setSelectedJob(null);
                  }}
                >
                  Iniciar Trabajo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchExecution;

