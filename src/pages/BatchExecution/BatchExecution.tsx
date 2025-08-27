import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import BatchJobConfigurator from '../../components/execution/BatchJobConfigurator/BatchJobConfigurator';
import RealTimeMonitoringPanel from '../../components/execution/RealTimeMonitoringPanel';
import BatchStatsCards from '../../components/batch/BatchStatsCards/BatchStatsCards';
import BatchJobsTable from '../../components/batch/BatchJobsTable/BatchJobsTable';
import BatchJobDetailsModal from '../../components/batch/BatchJobDetailsModal/BatchJobDetailsModal';
import Button from '../../components/ui/Button/Button';
import { useRealTimeJobMonitoring } from '../../hooks/useRealTimeJobMonitoring';
import { useBatchJobs } from '../../hooks/useBatchJobs';

const BatchExecution = () => {
  const [showJobConfigurator, setShowJobConfigurator] = useState(false);
  
  const {
    jobs,
    selectedJob,
    selectedRows,
    setSelectedJob,
    setSelectedRows,
    handleJobAction,
    handleJobConfigured,
    simulateJobUpdates
  } = useBatchJobs();
  
  const { isMonitoring, startMonitoring, stopMonitoring } = useRealTimeJobMonitoring(jobs, () => {});

  // Simular actualizaciones cada 5 segundos cuando hay trabajos ejecutándose
  useEffect(() => {
    const runningJobs = jobs.filter(j => j.status === 'running');
    if (runningJobs.length > 0 && isMonitoring) {
      const interval = setInterval(simulateJobUpdates, 5000);
      return () => clearInterval(interval);
    }
  }, [jobs, isMonitoring, simulateJobUpdates]);

  const handleJobConfiguredAndClose = (jobConfig: any) => {
    handleJobConfigured(jobConfig);
    setShowJobConfigurator(false);
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
      <BatchStatsCards jobs={jobs} isMonitoring={isMonitoring} />

      {/* Jobs Table */}
      <BatchJobsTable
        jobs={jobs}
        onJobAction={handleJobAction}
        onJobSelect={setSelectedJob}
        onRowSelect={setSelectedRows}
      />

      {/* Real-time Monitoring Panel */}
      {isMonitoring && (
        <RealTimeMonitoringPanel
          isMonitoring={isMonitoring}
          metrics={{
            totalThroughput: jobs.filter(j => j.status === 'running').reduce((acc, job) => acc + (job.recordsProcessed / ((Date.now() - (job.startTime?.getTime() || 0)) / 60000)), 0),
            averageJobDuration: jobs.filter(j => j.status === 'completed').reduce((acc, job) => acc + job.estimatedDuration, 0) / Math.max(jobs.filter(j => j.status === 'completed').length, 1),
            systemLoad: Math.random() * 100,
            queueLength: jobs.filter(j => j.status === 'pending' || j.status === 'scheduled').length,
            activeJobs: jobs.filter(j => j.status === 'running').length
          }}
          notifications={[]}
          onStartMonitoring={startMonitoring}
          onStopMonitoring={stopMonitoring}
          onClearNotifications={() => console.log('Clearing notifications')}
        />
      )}

      {/* Job Configurator Modal */}
      {showJobConfigurator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <BatchJobConfigurator
              onSave={handleJobConfiguredAndClose}
              onCancel={() => setShowJobConfigurator(false)}
            />
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <BatchJobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onJobAction={handleJobAction}
        />
      )}
    </div>
  );
};

export default BatchExecution;
