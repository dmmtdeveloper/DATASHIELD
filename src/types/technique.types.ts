export interface TechniqueParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  description: string;
}

export interface AnonymizationTechnique {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: TechniqueParameter[];
  icon: string;
  isReversible: boolean;
  dataTypes: string[];
}