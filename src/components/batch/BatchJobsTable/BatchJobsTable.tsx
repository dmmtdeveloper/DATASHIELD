import React from 'react';
import { Eye, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import DataTable, { type Column } from '../../ui/DataTable';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';
import ConfirmationDialog from '../../ui/ConfirmationDialog/ConfirmationDialog';
import { formatDuration, formatNumber } from '../../../services/utils/batch.utils';
import useConfirmation from '../../../hooks/useConfirmation';
import type { BatchJob, NewJobForm } from '../../../types/batch.types';

interface BatchJobsTableProps {
  jobs: BatchJob[];
  onJobAction: (jobId: string, action: string) => void;
  onJobSelect: (job: BatchJob) => void;
  onRowSelect: (rows: BatchJob[]) => void;
}

const BatchJobsTable: React.FC<BatchJobsTableProps> = ({
  jobs,
  onJobAction,
  onJobSelect,
  onRowSelect
}) => {
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  const columns: Column<BatchJob>[] = [
    {
      key: 'name',
      header: 'Trabajo',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
          <div className="text-xs text-gray-400 mt-1">
            {row.sourceTable} → {row.targetTable}
          </div>
          {(row.errorCount ?? 0) > 0 && (
            <div className="text-xs text-red-500 mt-1">
              {row.errorCount} errores
            </div>
          )}
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
      render: (_, row) => (
        <div className="space-y-1">
          <StatusBadge status={row.status} />
          {(row.throughput ?? 0) > 0 && (
            <div className="text-xs text-gray-500">
              {formatNumber(row.throughput ?? 0)}/min
            </div>
          )}
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progreso',
      sortable: true,
      render: (_, row) => (
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
      render: (_, row) => <PriorityBadge priority={row.priority} />
    },
    {
      key: 'startTime',
      header: 'Tiempo',
      sortable: true,
      render: (_, row) => (
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

  const handleDeleteConfirmation = (job: BatchJob, event?: React.MouseEvent) => {
    // Evitar que el evento se propague y active el onRowClick
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    showConfirmation({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este trabajo? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      severity: 'error',
      onConfirm: () => {
        onJobAction(job.id, 'delete');
        hideConfirmation();
      }
    });
  };

  const handleActionClick = (action: () => void, event?: React.MouseEvent) => {
    // Evitar que cualquier acción active el onRowClick
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    action();
  };

  const getTableActions = (job: BatchJob) => {
    const actions = [
      {
        label: 'Ver',
        icon: Eye,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleActionClick(() => onJobSelect(job), event)
      }
    ];

    if (job.status === 'pending' || job.status === 'scheduled') {
      actions.push({
        label: 'Iniciar',
        icon: Play,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleActionClick(() => onJobAction(job.id, 'start'), event)
      });
    }

    if (job.status === 'running') {
      actions.push({
        label: 'Pausar',
        icon: Pause,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleActionClick(() => onJobAction(job.id, 'pause'), event)
      });
    }

    if (job.status === 'paused') {
      actions.push({
        label: 'Reanudar',
        icon: Play,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleActionClick(() => onJobAction(job.id, 'resume'), event)
      });
    }

    if (job.status === 'failed') {
      actions.push({
        label: 'Reintentar',
        icon: RotateCcw,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleActionClick(() => onJobAction(job.id, 'retry'), event)
      });
    }

    if (job.status !== 'running') {
      actions.push({
        label: 'Eliminar',
        icon: Trash2,
        variant: 'outline' as const,
        onClick: (event?: React.MouseEvent) => handleDeleteConfirmation(job, event)
      });
    }

    return actions;
  };

  return (
    <>
      <DataTable
        data={jobs}
        columns={columns}
        actions={(job: BatchJob) => getTableActions(job).map(action => ({
          ...action,
          onClick: () => action.onClick()
        }))}
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
        selectable={true}
        onRowSelect={onRowSelect}
        onRowClick={onJobSelect}
        emptyMessage="No hay trabajos de anonimización configurados"
      />
      
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        severity={confirmation.severity}
        onConfirm={handleConfirm}
        onCancel={hideConfirmation}
      />
    </>
  );
};

export default BatchJobsTable;