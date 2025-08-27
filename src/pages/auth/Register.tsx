import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Form, { type FormField } from '../../components/ui/Form/Form';

const Register: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text',
      placeholder: 'Tu nombre completo',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        custom: (value: string) => {
          if (value && value.trim().length < 2) {
            return 'El nombre debe tener al menos 2 caracteres';
          }
          return null;
        }
      },
      description: 'Ingresa tu nombre y apellidos'
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'tu@email.com',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (value && !value.includes('@')) {
            return 'Debe ser un correo electrónico válido';
          }
          return null;
        }
      },
      description: 'Usaremos este correo para enviarte notificaciones'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Mínimo 6 caracteres',
      required: true,
      validation: {
        minLength: 6,
        maxLength: 100,
        custom: (value: string) => {
          if (value && value.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
          }
          if (value && !/(?=.*[a-z])/.test(value)) {
            return 'La contraseña debe contener al menos una letra minúscula';
          }
          if (value && !/(?=.*[A-Z])/.test(value)) {
            return 'La contraseña debe contener al menos una letra mayúscula';
          }
          if (value && !/(?=.*\d)/.test(value)) {
            return 'La contraseña debe contener al menos un número';
          }
          return null;
        }
      },
      description: 'Debe contener mayúsculas, minúsculas y números'
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: 'password',
      placeholder: 'Repite tu contraseña',
      required: true,
      validation: {
        custom: (value: string, formData?: Record<string, any>) => {
          if (!value) {
            return 'Debes confirmar tu contraseña';
          }
          if (formData && value !== formData.password) {
            return 'Las contraseñas no coinciden';
          }
          return null;
        }
      },
      description: 'Debe ser igual a la contraseña anterior'
    },
    {
      name: 'acceptTerms',
      label: 'Acepto los términos y condiciones de uso',
      type: 'checkbox',
      required: true,
      validation: {
        custom: (value: boolean) => {
          if (!value) {
            return 'Debes aceptar los términos y condiciones';
          }
          return null;
        }
      }
    }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setError('');
    setSuccess(false);

    // Validaciones adicionales antes del envío
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Error al crear la cuenta. El email podría estar en uso o hay un problema con el servidor.');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error inesperado al crear la cuenta. Por favor, intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Anonimización
            </h2>
            <p className="text-gray-600">Zurich Seguros</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                ¡Cuenta creada exitosamente!
              </h3>
              <p className="text-gray-600 mb-4">
                Tu cuenta ha sido registrada correctamente en el sistema.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-700">
                  <strong>¡Bienvenido al sistema!</strong><br />
                  Ya puedes iniciar sesión con tus credenciales.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Serás redirigido al login en 3 segundos...
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Ir al login ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Anonimización
          </h2>
          <p className="text-gray-600">Zurich Seguros</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-2">
              Crear Cuenta
            </h3>
            <p className="text-gray-600 text-center text-sm">
              Completa los siguientes campos para registrarte
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 text-sm font-medium">Error al crear la cuenta</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            cancelLabel="Volver al Login"
            loading={isLoading}
            layout="vertical"
            columns={1}
            className="space-y-4"
          />

          {/* Terms and Privacy */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center space-y-2">
              <p>
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                  Política de Privacidad
                </a>
              </p>
              <p>
                Tu información estará protegida según las normativas de seguridad de Zurich Seguros
              </p>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Zurich Seguros. Sistema de Anonimización de Datos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;