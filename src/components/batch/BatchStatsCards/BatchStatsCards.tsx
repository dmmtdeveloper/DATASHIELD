import React from 'react';
import { Database, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { calculateJobStats } from '../../../services/utils/batch.utils';
import type { BatchJob } from '../../../types/batch.types';

interface BatchStatsCardsProps {
  jobs: BatchJob[];
  isMonitoring: boolean;
}

const BatchStatsCards: React.FC<BatchStatsCardsProps> = ({ jobs, isMonitoring }) => {
  const stats = calculateJobStats(jobs);

  return (
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
  );
};

export default BatchStatsCards;