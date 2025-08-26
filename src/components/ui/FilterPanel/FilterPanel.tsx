import React, { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import Button from '../Button/Button';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  const handleReset = () => {
    const resetValues = Object.fromEntries(
      filters.map(filter => [filter.key, filter.type === 'multiselect' ? [] : ''])
    );
    onChange(resetValues);
    onReset?.();
  };

  const activeFiltersCount = Object.values(values).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  }).length;

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'select':
      case 'multiselect':
        return (
          <SearchableSelect
            key={filter.key}
            options={filter.options || []}
            value={value}
            onChange={(newValue) => handleFilterChange(filter.key, newValue)}
            placeholder={filter.placeholder}
            multiple={filter.type === 'multiselect'}
            label={filter.label}
            clearable
          />
        );

      case 'date':
        return (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <input
              type="date"
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'daterange':
        return (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={value?.from || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value })}
                placeholder="Desde"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={value?.to || ''}
                onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value })}
                placeholder="Hasta"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={filter.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              placeholder={filter.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                icon={RotateCcw}
                onClick={handleReset}
              >
                Limpiar
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              icon={isExpanded ? X : Filter}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Cerrar' : 'Filtrar'}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(renderFilter)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;