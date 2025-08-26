import React from 'react';
import Badge from '../../ui/Badge/Badge';
import type { BatchJob } from '../../../types/batch.types';

interface StatusBadgeProps {
  status: BatchJob['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { variant: 'warning' as const, text: 'Pendiente' },
    running: { variant: 'info' as const, text: 'Ejecutando' },
    completed: { variant: 'success' as const, text: 'Completado' },
    failed: { variant: 'error' as const, text: 'Fallido' },
    paused: { variant: 'default' as const, text: 'Pausado' },
    scheduled: { variant: 'info' as const, text: 'Programado' }
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatusBadge;