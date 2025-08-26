import React, { useState, useCallback } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../Button/Button';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  className?: string;
  description?: string;
  defaultValue?: any;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  columns?: 1 | 2 | 3;
}

interface FormErrors {
  [key: string]: string;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  loading = false,
  className = '',
  layout = 'vertical',
  columns = 1
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || 
        (field.type === 'checkbox' ? false : 
         field.type === 'number' ? 0 : '');
    });
    return initialData;
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: FormField, value: any): string | null => {
    // Campo requerido
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} es requerido`;
    }

    if (!value && !field.required) return null;

    const validation = field.validation;
    if (!validation) return null;

    // Validación de patrón
    if (validation.pattern && !validation.pattern.test(String(value))) {
      return `${field.label} no tiene el formato correcto`;
    }

    // Validación de longitud mínima
    if (validation.minLength && String(value).length < validation.minLength) {
      return `${field.label} debe tener al menos ${validation.minLength} caracteres`;
    }

    // Validación de longitud máxima
    if (validation.maxLength && String(value).length > validation.maxLength) {
      return `${field.label} no puede tener más de ${validation.maxLength} caracteres`;
    }

    // Validación de valor mínimo
    if (validation.min !== undefined && Number(value) < validation.min) {
      return `${field.label} debe ser mayor o igual a ${validation.min}`;
    }

    // Validación de valor máximo
    if (validation.max !== undefined && Number(value) > validation.max) {
      return `${field.label} debe ser menor o igual a ${validation.max}`;
    }

    // Validación personalizada
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  }, []);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validar campo si ya fue tocado
    if (touched[fieldName]) {
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
      }
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formData[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])));
    
    if (!hasErrors) {
      await onSubmit(formData);
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const renderField = (field: FormField) => {
    const hasError = touched[field.name] && errors[field.name];
    const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    const renderInput = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={`${baseInputClasses} min-h-[100px] resize-vertical`}
              rows={4}
            />
          );

        case 'select':
          return (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              disabled={field.disabled}
              className={baseInputClasses}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox':
          return (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                onBlur={() => handleFieldBlur(field.name)}
                disabled={field.disabled}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={field.disabled ? 'text-gray-400' : 'text-gray-700'}>
                {field.label}
              </span>
            </label>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    onBlur={() => handleFieldBlur(field.name)}
                    disabled={field.disabled}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={field.disabled ? 'text-gray-400' : 'text-gray-700'}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          );

        case 'password':
          return (
            <div className="relative">
              <input
                type={showPasswords[field.name] ? 'text' : 'password'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                onBlur={() => handleFieldBlur(field.name)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`${baseInputClasses} pr-10`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords[field.name] ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          );

        default:
          return (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => {
                const value = field.type === 'number' ? 
                  (e.target.value === '' ? '' : Number(e.target.value)) : 
                  e.target.value;
                handleFieldChange(field.name, value);
              }}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={baseInputClasses}
              min={field.validation?.min}
              max={field.validation?.max}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
          );
      }
    };

    return (
      <div key={field.name} className={`${field.className || ''}`}>
        {field.type !== 'checkbox' && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {renderInput()}
        
        {field.description && (
          <p className="mt-1 text-xs text-gray-500">{field.description}</p>
        )}
        
        {hasError && (
          <div className="mt-1 flex items-center gap-1 text-red-600 text-xs">
            <AlertCircle className="w-3 h-3" />
            {errors[field.name]}
          </div>
        )}
      </div>
    );
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {fields.map(renderField)}
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default Form;