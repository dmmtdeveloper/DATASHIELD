import React, { useState } from 'react';
import { 
  Hash, 
  Eye, 
  EyeOff, 
  Shuffle, 
  Key, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard, 
  User, 
  Building, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface TechniqueParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  description: string;
}

interface AnonymizationTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  parameters: TechniqueParameter[];
  examples: {
    original: string;
    anonymized: string;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  reversible: boolean;
  compliance: string[];
}

const TechniqueManager: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<AnonymizationTechnique | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const techniques: AnonymizationTechnique[] = [
    {
      id: 'hash-sha256',
      name: 'Hash SHA-256',
      category: 'Hashing',
      description: 'Convierte datos en un hash irreversible usando SHA-256',
      icon: <Hash className="w-5 h-5" />,
      parameters: [
        {
          name: 'salt',
          type: 'string',
          required: false,
          defaultValue: '',
          description: 'Salt adicional para mayor seguridad'
        },
        {
          name: 'preserveLength',
          type: 'boolean',
          required: false,
          defaultValue: false,
          description: 'Preservar longitud original'
        }
      ],
      examples: [
        { original: 'juan.perez@email.com', anonymized: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' },
        { original: '12345678-9', anonymized: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f' }
      ],
      riskLevel: 'low',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628', 'Ley 21.719']
    },
    {
      id: 'masking-partial',
      name: 'Enmascaramiento Parcial',
      category: 'Masking',
      description: 'Oculta parcialmente los datos manteniendo formato',
      icon: <EyeOff className="w-5 h-5" />,
      parameters: [
        {
          name: 'maskChar',
          type: 'string',
          required: false,
          defaultValue: '*',
          description: 'Carácter para enmascarar'
        },
        {
          name: 'visibleStart',
          type: 'number',
          required: false,
          defaultValue: 2,
          description: 'Caracteres visibles al inicio'
        },
        {
          name: 'visibleEnd',
          type: 'number',
          required: false,
          defaultValue: 2,
          description: 'Caracteres visibles al final'
        }
      ],
      examples: [
        { original: 'juan.perez@email.com', anonymized: 'ju*********@em***.com' },
        { original: '12345678-9', anonymized: '12*****8-9' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628']
    },
    {
      id: 'tokenization',
      name: 'Tokenización',
      category: 'Tokenization',
      description: 'Reemplaza datos sensibles con tokens únicos',
      icon: <Key className="w-5 h-5" />,
      parameters: [
        {
          name: 'tokenFormat',
          type: 'select',
          required: true,
          defaultValue: 'alphanumeric',
          options: ['alphanumeric', 'numeric', 'uuid'],
          description: 'Formato del token'
        },
        {
          name: 'preserveFormat',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar formato original'
        }
      ],
      examples: [
        { original: '4532-1234-5678-9012', anonymized: 'TKN-8765-4321-0987' },
        { original: 'juan.perez@email.com', anonymized: 'token.abc123@domain.tkn' }
      ],
      riskLevel: 'low',
      reversible: true,
      compliance: ['PCI-DSS', 'GDPR', 'Ley 21.719']
    },
    {
      id: 'pseudonymization',
      name: 'Pseudonimización',
      category: 'Pseudonymization',
      description: 'Reemplaza identificadores con pseudónimos consistentes',
      icon: <User className="w-5 h-5" />,
      parameters: [
        {
          name: 'keyDerivation',
          type: 'select',
          required: true,
          defaultValue: 'hmac',
          options: ['hmac', 'pbkdf2', 'scrypt'],
          description: 'Método de derivación de clave'
        },
        {
          name: 'preserveRelations',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar relaciones entre datos'
        }
      ],
      examples: [
        { original: 'Juan Pérez', anonymized: 'Usuario_A7B9C2' },
        { original: '12345678-9', anonymized: 'ID_X9Y8Z7' }
      ],
      riskLevel: 'medium',
      reversible: true,
      compliance: ['GDPR', 'Ley 19.628', 'Ley 21.719']
    },
    {
      id: 'date-shifting',
      name: 'Desplazamiento de Fechas',
      category: 'Date Anonymization',
      description: 'Modifica fechas manteniendo intervalos relativos',
      icon: <Calendar className="w-5 h-5" />,
      parameters: [
        {
          name: 'shiftRange',
          type: 'number',
          required: true,
          defaultValue: 365,
          description: 'Rango de desplazamiento en días'
        },
        {
          name: 'preserveWeekday',
          type: 'boolean',
          required: false,
          defaultValue: false,
          description: 'Preservar día de la semana'
        }
      ],
      examples: [
        { original: '1985-03-15', anonymized: '1986-07-22' },
        { original: '2020-12-25', anonymized: '2021-04-18' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['HIPAA', 'GDPR']
    },
    {
      id: 'geographic-masking',
      name: 'Enmascaramiento Geográfico',
      category: 'Geographic',
      description: 'Reduce precisión de coordenadas geográficas',
      icon: <MapPin className="w-5 h-5" />,
      parameters: [
        {
          name: 'precision',
          type: 'select',
          required: true,
          defaultValue: 'city',
          options: ['country', 'region', 'city', 'neighborhood'],
          description: 'Nivel de precisión'
        },
        {
          name: 'addNoise',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Agregar ruido aleatorio'
        }
      ],
      examples: [
        { original: '-33.4489, -70.6693', anonymized: '-33.45, -70.67' },
        { original: 'Las Condes, Santiago', anonymized: 'Santiago, Chile' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628']
    },
    {
      id: 'phone-masking',
      name: 'Enmascaramiento Telefónico',
      category: 'Contact',
      description: 'Enmascara números telefónicos preservando formato',
      icon: <Phone className="w-5 h-5" />,
      parameters: [
        {
          name: 'preserveCountryCode',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar código de país'
        },
        {
          name: 'preserveAreaCode',
          type: 'boolean',
          required: false,
          defaultValue: false,
          description: 'Preservar código de área'
        }
      ],
      examples: [
        { original: '+56 9 8765 4321', anonymized: '+56 9 XXXX XXXX' },
        { original: '(02) 2345-6789', anonymized: '(02) XXXX-XXXX' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628']
    },
    {
      id: 'credit-card-masking',
      name: 'Enmascaramiento de Tarjetas',
      category: 'Financial',
      description: 'Enmascara números de tarjetas de crédito',
      icon: <CreditCard className="w-5 h-5" />,
      parameters: [
        {
          name: 'showLast',
          type: 'number',
          required: false,
          defaultValue: 4,
          description: 'Últimos dígitos visibles'
        },
        {
          name: 'preserveFormat',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar formato con guiones'
        }
      ],
      examples: [
        { original: '4532-1234-5678-9012', anonymized: 'XXXX-XXXX-XXXX-9012' },
        { original: '5555444433332222', anonymized: 'XXXXXXXXXXXX2222' }
      ],
      riskLevel: 'high',
      reversible: false,
      compliance: ['PCI-DSS', 'GDPR']
    },
    {
      id: 'synthetic-data',
      name: 'Datos Sintéticos',
      category: 'Synthetic',
      description: 'Genera datos sintéticos con propiedades estadísticas similares',
      icon: <Shuffle className="w-5 h-5" />,
      parameters: [
        {
          name: 'preserveDistribution',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar distribución estadística'
        },
        {
          name: 'correlationLevel',
          type: 'select',
          required: false,
          defaultValue: 'medium',
          options: ['low', 'medium', 'high'],
          description: 'Nivel de correlación'
        }
      ],
      examples: [
        { original: 'María González', anonymized: 'Ana Rodríguez' },
        { original: 'Ingeniero Civil', anonymized: 'Arquitecto' }
      ],
      riskLevel: 'low',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628', 'Ley 21.719']
    }
  ];

  const categories = ['all', ...Array.from(new Set(techniques.map(t => t.category)))];

  const filteredTechniques = techniques.filter(technique => {
    const matchesCategory = selectedCategory === 'all' || technique.category === selectedCategory;
    const matchesSearch = technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderParameterInput = (param: TechniqueParameter, value: any, onChange: (value: any) => void) => {
    switch (param.type) {
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{param.description}</span>
          </label>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || param.defaultValue || ''}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={param.description}
          />
        );
      case 'select':
        return (
          <select
            value={value || param.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {param.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value || param.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={param.description}
          />
        );
    }
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestor de Técnicas de Anonimización</h1>
        <p className="text-gray-600">Administra y configura las técnicas de anonimización disponibles</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar técnicas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Técnica
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de técnicas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Técnicas Disponibles</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTechniques.map(technique => (
              <div
                key={technique.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTechnique?.id === technique.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTechnique(technique)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {technique.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{technique.name}</h3>
                      <p className="text-sm text-gray-600">{technique.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskBadgeColor(technique.riskLevel)}`}>
                      {technique.riskLevel}
                    </span>
                    {technique.reversible && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Reversible
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{technique.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detalles de técnica seleccionada */}
        <div>
          {selectedTechnique ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    {selectedTechnique.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTechnique.name}</h2>
                    <p className="text-gray-600">{selectedTechnique.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600">{selectedTechnique.description}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Características</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Nivel de Riesgo:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getRiskBadgeColor(selectedTechnique.riskLevel)}`}>
                        {selectedTechnique.riskLevel}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Reversible:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedTechnique.reversible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedTechnique.reversible ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cumplimiento Normativo</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnique.compliance.map(norm => (
                      <span key={norm} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {norm}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Parámetros de Configuración</h3>
                  <div className="space-y-3">
                    {selectedTechnique.parameters.map(param => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderParameterInput(param, param.defaultValue, () => {})}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Ejemplos</h3>
                  <div className="space-y-2">
                    {selectedTechnique.examples.map((example, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="text-sm">
                          <span className="text-gray-600">Original:</span>
                          <span className="ml-2 font-mono">{example.original}</span>
                        </div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-600">Anonimizado:</span>
                          <span className="ml-2 font-mono text-blue-600">{example.anonymized}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Guardar Configuración
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Probar Técnica
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una Técnica</h3>
              <p className="text-gray-600">Elige una técnica de anonimización de la lista para ver sus detalles y configuración.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechniqueManager;