import { AnonymizationTechnique, TechniqueParameter, AnonymizationResult } from '../../types/anonymization';
import { HashingService } from './techniques/HashingService';
import { MaskingService } from './techniques/MaskingService';
import { TokenizationService } from './techniques/TokenizationService';
import { PseudonymizationService } from './techniques/PseudonymizationService';
import { DateShiftingService } from './techniques/DateShiftingService';
import { GeographicMaskingService } from './techniques/GeographicMaskingService';
import { SyntheticDataService } from './techniques/SyntheticDataService';

export class TechniqueService {
  private static instance: TechniqueService;
  private techniques: Map<string, any> = new Map();

  private constructor() {
    this.initializeTechniques();
  }

  public static getInstance(): TechniqueService {
    if (!TechniqueService.instance) {
      TechniqueService.instance = new TechniqueService();
    }
    return TechniqueService.instance;
  }

  private initializeTechniques(): void {
    this.techniques.set('hash-sha256', new HashingService());
    this.techniques.set('masking-partial', new MaskingService());
    this.techniques.set('tokenization', new TokenizationService());
    this.techniques.set('pseudonymization', new PseudonymizationService());
    this.techniques.set('date-shifting', new DateShiftingService());
    this.techniques.set('geographic-masking', new GeographicMaskingService());
    this.techniques.set('synthetic-data', new SyntheticDataService());
  }

  public async applyTechnique(
    techniqueId: string,
    data: string | string[],
    parameters: Record<string, any> = {}
  ): Promise<AnonymizationResult> {
    const technique = this.techniques.get(techniqueId);
    
    if (!technique) {
      throw new Error(`Técnica no encontrada: ${techniqueId}`);
    }

    try {
      const startTime = Date.now();
      const result = await technique.anonymize(data, parameters);
      const endTime = Date.now();

      return {
        success: true,
        originalData: Array.isArray(data) ? data : [data],
        anonymizedData: Array.isArray(result) ? result : [result],
        techniqueId,
        parameters,
        processingTime: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        originalData: Array.isArray(data) ? data : [data],
        anonymizedData: [],
        techniqueId,
        parameters,
        error: error instanceof Error ? error.message : 'Error desconocido',
        processingTime: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  public validateParameters(techniqueId: string, parameters: Record<string, any>): boolean {
    const technique = this.techniques.get(techniqueId);
    return technique ? technique.validateParameters(parameters) : false;
  }

  public getTechniqueInfo(techniqueId: string): AnonymizationTechnique | null {
    const technique = this.techniques.get(techniqueId);
    return technique ? technique.getInfo() : null;
  }

  public getAllTechniques(): AnonymizationTechnique[] {
    return Array.from(this.techniques.values()).map(technique => technique.getInfo());
  }
}