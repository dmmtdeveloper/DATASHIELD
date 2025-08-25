import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DatabaseScanner from '../../components/discovery/SensitiveDataScanner/DatabaseScanner';
import AttributeClassifier from '../../components/discovery/AttributeClassification/AttributeClassifier';
import ValidationResults from '../../components/discovery/DataDiscovery/ValidationResults';

const DataDiscovery = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    'Escaneo de Bases de Datos',
    'Clasificación de Atributos',
    'Validación y Recomendaciones'
  ];
  
  const sensitiveCategories = [
    { name: 'Identificación Personal', count: 45, law: 'Ley 19.628' },
    { name: 'Datos de Contacto', count: 32, law: 'Ley 19.628' },
    { name: 'Datos Biométricos', count: 8, law: 'Ley 21.719' },
    { name: 'Geolocalización', count: 12, law: 'Ley 21.719' },
    { name: 'Categorías Especiales', count: 6, law: 'Ley 21.719' }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Descubrimiento de Datos Sensibles
        </h1>
        
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= activeStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= activeStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Clasificación según Normativa Chilena
        </h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {sensitiveCategories.map((category) => (
            <span 
              key={category.name}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                category.law === 'Ley 21.719' 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}
            >
              {category.name}: {category.count}
            </span>
          ))}
        </div>
        
        {activeStep === 0 && <DatabaseScanner />}
        {activeStep === 1 && <AttributeClassifier />}
        {activeStep === 2 && <ValidationResults />}
        
        <div className="flex justify-between mt-6">
          <button 
            className={`btn-secondary flex items-center gap-2 ${
              activeStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button 
            className={`btn-primary flex items-center gap-2 ${
              activeStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataDiscovery;