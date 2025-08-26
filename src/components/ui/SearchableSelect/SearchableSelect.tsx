import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar opciones...',
  multiple = false,
  disabled = false,
  loading = false,
  clearable = true,
  className = '',
  error,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const handleRemoveTag = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter(v => v !== optionValue);
      onChange(newValues);
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (!multiple) return selectedOptions[0]?.label;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} elementos seleccionados`;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div ref={containerRef} className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
            error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
          } ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${
            isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {multiple && selectedOptions.length > 1 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map(option => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                    >
                      {option.label}
                      <button
                        onClick={(e) => handleRemoveTag(option.value, e)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className={selectedOptions.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                  {getDisplayText()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {loading && (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              {clearable && selectedOptions.length > 0 && !disabled && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`} />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500 text-center">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map(option => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => !option.disabled && handleOptionClick(option.value)}
                      className={`px-3 py-2 cursor-pointer transition-colors ${
                        option.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-100'
                      } ${
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchableSelect;