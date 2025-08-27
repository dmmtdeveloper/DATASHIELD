import React, { useState, useMemo } from 'react';
import { Plus, Download, Settings, Shield, Hash, Eye, Key, Shuffle, X, Save, Edit, Trash2 } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button/Button';
import StatusBadge from '../../components/batch/StatusBadge/StatusBadge';


interface Attribute {
  id: string;
  name: string;
  dataType: string;
  category: string;
  technique: string;
  status: 'active' | 'inactive' | 'testing';
  compliance: string[];
  description: string;
  parameters: Record<string, any>;
  lastModified: string;
}

const AttributeCatalog: React.FC = () => {
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Attribute>>({});
  const [selectedRows, setSelectedRows] = useState<Attribute[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Datos de ejemplo
  const attributes: Attribute[] = [
    {
      id: '1',
      name: 'RUT',
      dataType: 'VARCHAR(12)',
      category: 'Identificación Personal',
      technique: 'Hashing SHA-256',
      status: 'active',
      compliance: ['Ley 19.628', 'Ley 21.719'],
      description: 'Rol Único Tributario - Identificador único de personas',
      parameters: { algorithm: 'SHA-256', salt: 'enabled' },
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      name: 'Email',
      dataType: 'VARCHAR(255)',
      category: 'Datos de Contacto',
      technique: 'Dynamic Data Masking',
      status: 'active',
      compliance: ['Ley 19.628'],
      description: 'Dirección de correo electrónico',
      parameters: { maskType: 'partial', visibleChars: 3 },
      lastModified: '2024-01-14'
    },
    {
      id: '3',
      name: 'Número de Cuenta',
      dataType: 'VARCHAR(20)',
      category: 'Datos Financieros',
      technique: 'Tokenización',
      status: 'testing',
      compliance: ['Ley 19.628'],
      description: 'Número de cuenta bancaria',
      parameters: { tokenFormat: 'format-preserving', vault: 'secure' },
      lastModified: '2024-01-13'
    },
    {
      id: '4',
      name: 'Huella Dactilar',
      dataType: 'BLOB',
      category: 'Datos Biométricos',
      technique: 'Encriptación AES',
      status: 'active',
      compliance: ['Ley 21.719'],
      description: 'Datos biométricos de huella dactilar',
      parameters: { keySize: 256, mode: 'CBC' },
      lastModified: '2024-01-12'
    }
  ];

  const categories = [
    'Identificación Personal',
    'Datos de Contacto',
    'Datos Financieros',
    'Datos Biométricos',
    'Geolocalización',
    'Datos Laborales'
  ];

  const techniques = [
    'Hashing SHA-256',
    'Dynamic Data Masking',
    'Tokenización',
    'Encriptación AES',
    'Pseudonimización',
    'Generalización'
  ];

  // Filtrado de atributos - corregido para usar la variable correcta
  const filteredAttributes = useMemo(() => {
    let result = [...attributes];
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        result = result.filter(attribute => {
          const attributeValue = attribute[key as keyof Attribute];
          return String(attributeValue).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });
    
    return result;
  }, [attributes, filters]);

  const getTechniqueIcon = (technique: string) => {
    switch (technique) {
      case 'Hashing SHA-256': return <Hash className="w-4 h-4" />;
      case 'Dynamic Data Masking': return <Eye className="w-4 h-4" />;
      case 'Tokenización': return <Key className="w-4 h-4" />;
      case 'Encriptación AES': return <Shield className="w-4 h-4" />;
      case 'Pseudonimización': return <Shuffle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  // Configuración de columnas para DataTable
  const columns: Column<Attribute>[] = [
    {
      key: 'name',
      header: 'Atributo',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.dataType}</div>
          <div className="text-xs text-gray-400 mt-1">{row.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Categoría',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'technique',
      header: 'Técnica',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {getTechniqueIcon(row.technique)}
          <span className="text-sm">{row.technique}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (_, row) => {
        // Map attribute status to StatusBadge status
        const statusMap: Record<'active' | 'inactive' | 'testing', 'running' | 'failed' | 'pending'> = {
          active: 'running',
          inactive: 'failed', 
          testing: 'pending'
        };
        return <StatusBadge status={statusMap[row.status]} />;
      }
    },
    {
      key: 'compliance',
      header: 'Normativa',
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          {row.compliance.map((law, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                law === 'Ley 21.719' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {law}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'lastModified',
      header: 'Última Modificación',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString('es-CL')}
        </span>
      )
    }
  ];

  // Acciones para cada fila
  const tableActions = [
    {
      label: 'Editar',
      icon: Edit,
      variant: 'outline' as const,
      onClick: (attribute: Attribute) => handleEdit(attribute)
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: (attribute: Attribute) => handleDelete(attribute.id)
    }
  ];

  const handleEdit = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setFormData(attribute);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleNewAttribute = () => {
    setSelectedAttribute(null);
    setFormData({
      name: '',
      dataType: '',
      category: '',
      technique: '',
      status: 'inactive',
      compliance: [],
      description: '',
      parameters: {}
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = () => {
    console.log('Guardando:', formData);
    setShowModal(false);
    setSelectedAttribute(null);
    setFormData({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAttribute(null);
    setFormData({});
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    console.log('Eliminar atributo:', id);
  };

  const handleExport = () => {
    console.log('Exportar catálogo');
  };

  const stats = {
    total: attributes.length,
    active: attributes.filter(a => a.status === 'active').length,
    testing: attributes.filter(a => a.status === 'testing').length,
    techniques: techniques.length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Catálogo de Atributos
            </h1>
            <p className="text-gray-600">
              Gestión de atributos y técnicas de anonimización
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              icon={Download}
              onClick={handleExport}
            >
              Exportar
            </Button>
            <Button 
              variant="primary" 
              icon={Plus}
              onClick={handleNewAttribute}
            >
              Nuevo Atributo
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Atributos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Settings className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Activos</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <Shield className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">En Pruebas</p>
              <p className="text-2xl font-bold">{stats.testing}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Técnicas</p>
              <p className="text-2xl font-bold">{stats.techniques}</p>
            </div>
            <Hash className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* DataTable con datos filtrados - solo una instancia */}
      <DataTable
        data={filteredAttributes}
        columns={columns}
        actions={tableActions}
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
        selectable={true}
        onRowSelect={setSelectedRows}
        onRowClick={(attribute) => setSelectedAttribute(attribute)}
        emptyMessage="No hay atributos configurados"
      />

      {/* Modal de Edición/Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Atributo' : 'Nuevo Atributo'}
              </h2>
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Atributo *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: RUT, Email, Teléfono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Dato *
                  </label>
                  <input
                    type="text"
                    value={formData.dataType || ''}
                    onChange={(e) => setFormData({...formData, dataType: e.target.value})}
                    className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: VARCHAR(255), INT, BLOB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción del atributo y su uso"
                />
              </div>

              {/* Categoría y Técnica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Técnica de Anonimización *
                  </label>
                  <select
                    value={formData.technique || ''}
                    onChange={(e) => setFormData({...formData, technique: e.target.value})}
                    className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar técnica</option>
                    {techniques.map(technique => (
                      <option key={technique} value={technique}>{technique}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <div className="flex gap-4">
                  {[{value: 'active', label: 'Activo'}, {value: 'testing', label: 'En Pruebas'}, {value: 'inactive', label: 'Inactivo'}].map(status => (
                    <label key={status.value} className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="mr-2"
                      />
                      <span className="text-sm">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cumplimiento Normativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cumplimiento Normativo
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Ley 19.628', 'Ley 21.719', 'GDPR', 'PCI-DSS'].map(law => (
                    <label key={law} className="flex items-center text-gray-800">
                      <input
                        type="checkbox"
                        checked={formData.compliance?.includes(law) || false}
                        onChange={(e) => {
                          const compliance = formData.compliance || [];
                          if (e.target.checked) {
                            setFormData({...formData, compliance: [...compliance, law]});
                          } else {
                            setFormData({...formData, compliance: compliance.filter(c => c !== law)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{law}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSave}
              >
                {isEditing ? 'Actualizar' : 'Crear'} Atributo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeCatalog;