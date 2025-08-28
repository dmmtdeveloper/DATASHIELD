import React from 'react';
import {
  Plus,
  Play,
  FileText,
  Settings,
  Database,
  Shield,
  Clock,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
  route: string;
  category: 'execution' | 'management' | 'monitoring' | 'administration';
}

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'new-batch-job',
      title: 'Nuevo Trabajo Batch',
      description: 'Crear y configurar un nuevo trabajo de anonimización batch',
      icon: <Plus size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      route: '/batch',
      category: 'execution'
    },
    {
      id: 'start-online-session',
      title: 'Sesión Online',
      description: 'Iniciar procesamiento en tiempo real',
      icon: <Play size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      route: '/online',
      category: 'execution'
    },
    {
      id: 'view-audit-trail',
      title: 'Auditoría',
      description: 'Consultar registros de auditoría y cumplimiento',
      icon: <FileText size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      route: '/audit',
      category: 'monitoring'
    },
    {
      id: 'data-discovery',
      title: 'Descubrimiento',
      description: 'Escanear y clasificar datos sensibles',
      icon: <Database size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      route: '/discovery',
      category: 'management'
    },
    {
      id: 'universe-admin',
      title: 'Universos',
      description: 'Administrar universos de datos',
      icon: <Users size={24} />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      route: '/universe',
      category: 'administration'
    },
    {
      id: 'attribute-catalog',
      title: 'Catálogo',
      description: 'Gestionar atributos y técnicas de anonimización',
      icon: <Shield size={24} />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100',
      route: '/catalog',
      category: 'management'
    },
    {
      id: 'monitoring',
      title: 'Monitoreo',
      description: 'Ver estado del sistema y métricas',
      icon: <Clock size={24} />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100',
      route: '/monitoring',
      category: 'monitoring'
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes del sistema y preferencias',
      icon: <Settings size={24} />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
      route: '/settings',
      category: 'administration'
    }
  ];

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      execution: 'Ejecución',
      management: 'Gestión',
      monitoring: 'Monitoreo',
      administration: 'Administración'
    };
    return titles[category as keyof typeof titles] || category;
  };

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h3>
        <div className="text-sm text-gray-500">
          {quickActions.length} acciones disponibles
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
              {getCategoryTitle(category)}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.route)}
                  className={`
                    ${action.bgColor} ${action.hoverColor}
                    border border-gray-200 rounded-lg p-4 text-left
                    transition-all duration-200 hover:shadow-md hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    group
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${action.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-gray-800">
                        {action.title}
                      </h5>
                      <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-700">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Última actualización: {new Date().toLocaleTimeString('es-CL')}</span>
          <span>Haz clic en cualquier acción para navegar</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;