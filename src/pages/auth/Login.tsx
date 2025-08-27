import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Info, User } from 'lucide-react';
import Form, { type FormField } from '../../components/ui/Form/Form';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const formFields: FormField[] = [
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
      description: 'Ingresa tu correo electrónico registrado'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Tu contraseña',
      required: true,
      validation: {
        minLength: 6,
        custom: (value: string) => {
          if (value && value.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
          }
          return null;
        }
      },
      description: 'Contraseña de tu cuenta'
    },
    {
      name: 'rememberMe',
      label: 'Recordar mi sesión',
      type: 'checkbox',
      defaultValue: false,
      description: 'Mantener la sesión activa en este dispositivo'
    }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setError('');
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Guardar preferencia de "recordar sesión" si es necesario
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        navigate('/');
      } else {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    
    try {
      const success = await login('admin@zurich.com', 'admin123');
      if (success) {
        navigate('/');
      } else {
        setError('Error al acceder con las credenciales de demo.');
      }
    } catch (err) {
      console.error('Error en demo login:', err);
      setError('Error de conexión. Por favor, intenta de nuevo.');
    }
  };

  const handleForgotPassword = () => {
    // Aquí puedes implementar la lógica de recuperación de contraseña
    alert('Funcionalidad de recuperación de contraseña en desarrollo.\n\nPor ahora, contacta al administrador del sistema.');
  };

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
              Iniciar Sesión
            </h3>
            <p className="text-gray-600 text-center text-sm">
              Accede a tu cuenta para continuar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 text-sm font-medium">Error de autenticación</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <Form
            fields={formFields}
            onSubmit={handleSubmit}
            submitLabel={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            loading={isLoading}
            layout="vertical"
            columns={1}
            className="space-y-4"
          />

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Demo Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-700 text-sm font-medium mb-2">
                    Cuenta de Demostración
                  </p>
                  <p className="text-blue-600 text-xs mb-3">
                    Prueba el sistema con credenciales de demo
                  </p>
                  <div className="bg-white rounded p-2 mb-3 border border-blue-200">
                    <p className="text-xs text-gray-700">
                      <strong>Email:</strong> admin@zurich.com<br />
                      <strong>Contraseña:</strong> admin123
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {isLoading ? 'Accediendo...' : 'Acceso Demo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              >
                Regístrate aquí
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

export default Login;