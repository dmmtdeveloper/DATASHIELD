import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react';

const ValidationResults: React.FC = () => {
  const validationResults = [
    {
      table: 'usuarios.clientes',
      field: 'rut',
      category: 'Identificación Personal',
      technique: 'Hashing SHA2_256',
      risk: 'Alto',
      status: 'Validado'
    },
    {
      table: 'usuarios.clientes',
      field: 'email',
      category: 'Datos de Contacto',
      technique: 'Dynamic Data Masking',
      risk: 'Medio',
      status: 'Validado'
    },
    {
      table: 'financiero.cuentas',
      field: 'numero_cuenta',
      category: 'Datos Financieros',
      technique: 'Tokenización',
      risk: 'Alto',
      status: 'Pendiente'
    },
    {
      table: 'medico.pacientes',
      field: 'historial_medico',
      category: 'Datos Biométricos',
      technique: 'Encriptación AES',
      risk: 'Crítico',
      status: 'Requiere Revisión'
    }
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Crítico': return 'bg-red-100 text-red-800';
      case 'Alto': return 'bg-orange-100 text-orange-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Validado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pendiente': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Requiere Revisión': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Validación y Recomendaciones
      </h3>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-800 text-sm">
            Validación conjunta completada con referentes legales y técnicos
          </span>
        </div>
      </div>

      <div className="card mb-6">
        <h4 className="font-medium mb-3">Resumen de Validación</h4>
        <div className="flex flex-wrap gap-2">
          <span className="status-badge status-active">Validados: 2</span>
          <span className="status-badge status-pending">Pendientes: 1</span>
          <span className="status-badge status-inactive">Requieren Revisión: 1</span>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Tabla.Campo</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Técnica Recomendada</th>
                <th className="px-4 py-3 text-left">Nivel de Riesgo</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {validationResults.map((result, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{result.table}</div>
                    <div className="text-xs text-gray-500">{result.field}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{result.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{result.technique}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(result.risk)}`}>
                      {result.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="text-sm">{result.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Reporte
        </button>
        <button className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Aprobar Recomendaciones
        </button>
      </div>
    </div>
  );
};

export default ValidationResults;