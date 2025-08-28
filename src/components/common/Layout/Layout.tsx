import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Building2,
  FolderOpen,
  Play,
  MousePointer,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { text: 'Descubrimiento de Datos', icon: Search, path: '/discovery' },
    { text: 'Administración de Universos', icon: Building2, path: '/universe' },
    { text: 'Catálogo de Atributos', icon: FolderOpen, path: '/catalog' },
    { text: 'Ejecución Batch', icon: Play, path: '/batch' },
    { text: 'Ejecución Online', icon: MousePointer, path: '/online' },
    { text: 'Auditoría', icon: FileText, path: '/audit' },
    { text: 'Monitoreo', icon: BarChart3, path: '/monitoring' },
    { text: 'Configuraciones', icon: Settings, path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-white shadow-lg transition-all duration-300 flex flex-col border-r border-gray-200`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-blue-600">
                Anonimización
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700"
            >
              {sidebarOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.text}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full  flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    title={!sidebarOpen ? item.text : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="ml-3 text-sm font-medium">{item.text}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center px-3 py-2">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2  text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} className="mx-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sistema de Anonimización de Datos - Zurich
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;