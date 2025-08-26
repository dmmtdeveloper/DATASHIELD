import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  textColor
}) => {
  return (
    <div className={`${gradient} text-white p-4 rounded-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor} text-sm`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className={`${textColor} text-xs`}>{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${textColor}`} />
      </div>
    </div>
  );
};

export default MetricCard;