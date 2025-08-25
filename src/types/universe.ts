export type UniverseStatus = 'pendiente' | 'en_proceso' | 'anonimizado' | 'error';

export type AnonymizationTechnique = 
  | 'masking' 
  | 'pseudonymization' 
  | 'generalization' 
  | 'suppression' 
  | 'encryption';

export type Priority = 'high' | 'medium' | 'low';

export interface AnonymizationRule {
  field: string;
  technique: AnonymizationTechnique;
  priority: Priority;
}

export interface ComplianceStatus {
  ley19628: boolean;
  ley21719: boolean;
  lastAudit: string | null;
}

export interface Universe {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  status: UniverseStatus;
  createdAt: string;
  lastExecution: string | null;
  recordsTotal: number;
  recordsProcessed: number;
  anonymizationRules: AnonymizationRule[];
  complianceStatus: ComplianceStatus;
}