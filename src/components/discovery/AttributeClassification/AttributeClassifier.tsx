import React from 'react';
import { User, Mail, Phone, MapPin, Shield, Building } from 'lucide-react';

const AttributeClassifier: React.FC = () => {
  const categories = [
    {
      name: 'Identificación Personal',
      law: 'Ley 19.628',
      color: 'red',
      icon: <User className="w-5 h-5" />,
      attributes: ['RUT', 'Nombre completo', 'Documentos oficiales', 'Pasaporte']
    },
    {
      name: 'Datos de Contacto',
      law: 'Ley 19.628',
      color: 'yellow',
      icon: <Mail className="w-5 h-5" />,
      attributes: ['Teléfonos', 'Direcciones', 'Correos electrónicos']
    },
    {
      name: 'Datos Biométricos',
      law: 'Ley 21.719',
      color: 'red',
      icon: <Shield className="w-5 h-5" />,
      attributes: ['Huellas dactilares', 'Imágenes faciales', 'Historial médico']
    },
    {
      name: 'Geolocalización',
      law: 'Ley 21.719',
      color: 'yellow',
      icon: <MapPin className="w-5 h-5" />,
      attributes: ['Ubicación física', 'Desplazamientos', 'GPS']
    },
    {
      name: 'Datos Laborales',
      law: 'Ley 19.628',
      color: 'blue',
      icon: <Building className="w-5 h-5" />,
      attributes: ['Cargo', 'Formación', 'Desempeño', 'Salario']
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return { icon: 'text-red-500', badge: 'bg-red-100 text-red-800' };
      case 'yellow': return { icon: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-800' };
      case 'blue': return { icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-800' };
      default: return { icon: 'text-gray-500', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Clasificación de Atributos según Normativa Chilena
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const colors = getColorClasses(category.color);
          return (
            <div key={index} className="card h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={colors.icon}>
                    {category.icon}
                  </div>
                  <span className="font-medium ml-2 text-gray-700">{category.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium  ${colors.badge}`}>
                  {category.law}
                </span>
              </div>
              
              <ul className="space-y-2">
                {category.attributes.map((attr, attrIndex) => (
                  <li key={attrIndex} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {attr}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeClassifier;