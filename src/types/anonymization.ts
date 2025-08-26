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
  category: string;
  description: string;
  icon: any;
  parameters: TechniqueParameter[];
  examples: {
    original: string;
    anonymized: string;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  reversible: boolean;
  compliance: string[];
}

export interface AnonymizationResult {
  success: boolean;
  originalData: string[];
  anonymizedData: string[];
  techniqueId: string;
  parameters: Record<string, any>;
  processingTime: number;
  timestamp: string;
  error?: string;
}

export interface AnonymizationJob {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  techniques: {
    techniqueId: string;
    parameters: Record<string, any>;
    fieldMappings: string[];
  }[];
  inputData: any[];
  outputData?: any[];
  createdAt: string;
  completedAt?: string;
  progress: number;
}