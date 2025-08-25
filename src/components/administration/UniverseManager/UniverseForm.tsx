import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import type { Universe, AnonymizationRule } from '../../../types/universe';

interface UniverseFormProps {
  universe?: Universe | null;
  onSave: (universe: Partial<Universe>) => void;
  onClose: () => void;
}

const UniverseForm: React.FC<UniverseFormProps> = ({ universe, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    description: '',
    recordsTotal: 0,
    anonymizationRules: [] as AnonymizationRule[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (universe) {
      setFormData({
        clientId: universe.clientId,
        clientName: universe.clientName,
        description: universe.description,
        recordsTotal: universe.recordsTotal,
        anonymizationRules: universe.anonymizationRules
      });
    }
  }, [universe]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId.trim()) {
      newErrors.clientId = 'El ID del cliente es requerido';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.recordsTotal <= 0) {
      newErrors.recordsTotal = 'El número de registros debe ser mayor a 0';
    }

    if (formData.anonymizationRules.length === 0) {
      newErrors.rules = 'Debe agregar al menos una regla de anonimización';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        status: universe?.status || 'pendiente'
      });
    }
  };

  const addRule = () => {
    setFormData({
      ...formData,
      anonymizationRules: [
        ...formData.anonymizationRules,
        { field: '', technique: 'masking', priority: 'medium' }
      ]
    });
  };

  const removeRule = (index: number) => {
    setFormData({
      ...formData,
      anonymizationRules: formData.anonymizationRules.filter((_, i) => i !== index)
    });
  };

  const updateRule = (index: number, field: keyof AnonymizationRule, value: string) => {
    const updatedRules = [...formData.anonymizationRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setFormData({
      ...formData,
      anonymizationRules: updatedRules
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {universe ? 'Editar Universo' : 'Nuevo Universo'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Cliente *
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="CLI001"
                />
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.clientId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Cliente *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del cliente"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.clientName}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descripción del universo de datos"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de Registros *
              </label>
              <input
                type="number"
                value={formData.recordsTotal}
                onChange={(e) => setFormData({ ...formData, recordsTotal: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.recordsTotal ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="100000"
                min="1"
              />
              {errors.recordsTotal && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.recordsTotal}
                </p>
              )}
            </div>
          </div>

          {/* Reglas de Anonimización */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Reglas de Anonimización</h3>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Regla
              </button>
            </div>
            
            {errors.rules && (
              <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.rules}
              </p>
            )}

            <div className="space-y-4">
              {formData.anonymizationRules.map((rule, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campo
                      </label>
                      <input
                        type="text"
                        value={rule.field}
                        onChange={(e) => updateRule(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="rut, email, phone..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Técnica
                      </label>
                      <select
                        value={rule.technique}
                        onChange={(e) => updateRule(index, 'technique', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="masking">Enmascaramiento</option>
                        <option value="pseudonymization">Pseudonimización</option>
                        <option value="generalization">Generalización</option>
                        <option value="suppression">Supresión</option>
                        <option value="encryption">Encriptación</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridad
                      </label>
                      <select
                        value={rule.priority}
                        onChange={(e) => updateRule(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="high">Alta</option>
                        <option value="medium">Media</option>
                        <option value="low">Baja</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
            >
              <Save className="w-4 h-4" />
              {universe ? 'Actualizar' : 'Crear'} Universo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniverseForm;