import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import Button from '../Button/Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'warning',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const severityConfig = {
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-800',
      confirmVariant: 'primary' as const
    },
    error: {
      icon: X,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      confirmVariant: 'danger' as const
    },
    info: {
      icon: AlertTriangle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      confirmVariant: 'primary' as const
    },
    success: {
      icon: Check,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      confirmVariant: 'primary' as const
    }
  };

  const config = severityConfig[severity];
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4 rounded-t-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`${config.iconColor} p-2 rounded-full bg-white`}>
              <IconComponent size={24} />
            </div>
            <h3 className={`text-lg font-semibold ${config.titleColor}`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            className="min-w-[80px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;