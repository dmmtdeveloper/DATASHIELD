import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Settings, Shield, Hash, Eye, Key, Shuffle, X, Save } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnique, setSelectedTechnique] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Attribute>>({});

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'status-badge status-active';
      case 'testing': return 'status-badge status-pending';
      case 'inactive': return 'status-badge status-inactive';
      default: return 'status-badge status-inactive';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'testing': return 'En Pruebas';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attr.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attr.category === selectedCategory;
    const matchesTechnique = selectedTechnique === 'all' || attr.technique === selectedTechnique;
    
    return matchesSearch && matchesCategory && matchesTechnique;
  });

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
    // Implementar lógica de guardado
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
    // Implementar lógica de eliminación
    console.log('Eliminar atributo:', id);
  };

  const handleExport = () => {
    // Implementar lógica de exportación
    console.log('Exportar catálogo');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Catálogo de Atributos
            </h1>
            <p className="text-gray-600">
              Gestión de atributos y técnicas de anonimización
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              className="btn-secondary flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={handleNewAttribute}
            >
              <Plus className="w-4 h-4" />
              Nuevo Atributo
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar atributos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn-outline flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  className="w-full p-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Técnica
                </label>
                <select
                  className="w-full p-2 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedTechnique}
                  onChange={(e) => setSelectedTechnique(e.target.value)}
                >
                  <option value="all">Todas las técnicas</option>
                  {techniques.map(technique => (
                    <option key={technique} value={technique}>{technique}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Atributos</p>
              <p className="text-2xl font-bold">{attributes.length}</p>
            </div>
            <Settings className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Activos</p>
              <p className="text-2xl font-bold">{attributes.filter(a => a.status === 'active').length}</p>
            </div>
            <Shield className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">En Pruebas</p>
              <p className="text-2xl font-bold">{attributes.filter(a => a.status === 'testing').length}</p>
            </div>
            <Eye className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Técnicas</p>
              <p className="text-2xl font-bold">{techniques.length}</p>
            </div>
            <Hash className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">Atributo</th>
                <th className="px-6 py-3 text-left">Categoría</th>
                <th className="px-6 py-3 text-left">Técnica</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Normativa</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.map((attribute) => (
                <tr key={attribute.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{attribute.name}</div>
                      <div className="text-sm text-gray-500">{attribute.dataType}</div>
                      <div className="text-xs text-gray-400 mt-1">{attribute.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {attribute.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTechniqueIcon(attribute.technique)}
                      <span className="text-sm">{attribute.technique}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(attribute.status)}>
                      {getStatusText(attribute.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {attribute.compliance.map((law, index) => (
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => handleEdit(attribute)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        onClick={() => handleDelete(attribute.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredAttributes.length} de {attributes.length} atributos
      </div>

      {/* Modal de Edición/Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Atributo' : 'Nuevo Atributo'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
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
                  {['active', 'testing', 'inactive'].map(status => (
                    <label key={status} className="flex items-center text-gray-800">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="mr-2 "
                      />
                      <span className="text-sm">{getStatusText(status)}</span>
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

              {/* Parámetros de Técnica */}
              {formData.technique && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetros de la Técnica
                  </label>
                  <div className="bg-gray-50 pt-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      Configuración específica para: <strong>{formData.technique}</strong>
                    </p>
                    {/* Aquí se pueden agregar campos específicos según la técnica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Algoritmo/Método
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 text-sm border text-gray-800 border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Ej: SHA-256, AES-256"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Configuración
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 text-gray-800 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Parámetros adicionales"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Actualizar' : 'Crear'} Atributo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeCatalog;