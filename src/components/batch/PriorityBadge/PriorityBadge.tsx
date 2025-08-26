import React from 'react';
import Badge from '../../ui/Badge/Badge';
import type { BatchJob } from '../../../types/batch.types';

interface PriorityBadgeProps {
  priority: BatchJob['priority'];
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityConfig = {
    low: { variant: 'default' as const, text: 'Baja' },
    medium: { variant: 'info' as const, text: 'Media' },
    high: { variant: 'warning' as const, text: 'Alta' },
    critical: { variant: 'error' as const, text: 'Crítica' }
  };
  
  const config = priorityConfig[priority];
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default PriorityBadge;