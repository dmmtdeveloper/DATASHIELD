import type { AnonymizationTechnique } from '../../../types/anonymization';
import { Calendar } from 'lucide-react';

export class DateShiftingService {
  private shiftMap: Map<string, number> = new Map();

  public async anonymize(data: string | string[], parameters: Record<string, any> = {}): Promise<string | string[]> {
    const { 
      shiftRange = 365, 
      preserveWeekday = false, 
      consistent = true,
      shiftDirection = 'both' // 'forward', 'backward', 'both'
    } = parameters;
    
    const shiftSingle = (value: string): string => {
      const date = this.parseDate(value);
      if (!date) return value;
      
      let shiftDays: number;
      
      if (consistent && this.shiftMap.has(value)) {
        shiftDays = this.shiftMap.get(value)!;
      } else {
        shiftDays = this.generateShift(shiftRange, shiftDirection);
        if (consistent) {
          this.shiftMap.set(value, shiftDays);
        }
      }
      
      const shiftedDate = new Date(date);
      shiftedDate.setDate(shiftedDate.getDate() + shiftDays);
      
      if (preserveWeekday) {
        const originalWeekday = date.getDay();
        const shiftedWeekday = shiftedDate.getDay();
        const weekdayDiff = originalWeekday - shiftedWeekday;
        shiftedDate.setDate(shiftedDate.getDate() + weekdayDiff);
      }
      
      return this.formatDate(shiftedDate, value);
    };

    if (Array.isArray(data)) {
      return data.map(shiftSingle);
    }
    
    return shiftSingle(data);
  }

  private parseDate(dateString: string): Date | null {
    // Try multiple date formats
    const formats = [
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{2})\/(\d{2})\/(\d{4})$/, // MM/DD/YYYY
      /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
      /^(\d{4})\/(\d{2})\/(\d{2})$/, // YYYY/MM/DD
    ];
    
    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    
    return null;
  }

  private generateShift(range: number, direction: string): number {
    const maxShift = Math.floor(range / 2);
    
    switch (direction) {
      case 'forward':
        return Math.floor(Math.random() * range);
      case 'backward':
        return -Math.floor(Math.random() * range);
      case 'both':
      default:
        return Math.floor(Math.random() * range * 2) - range;
    }
  }

  private formatDate(date: Date, originalFormat: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Detect original format and maintain it
    if (originalFormat.includes('/')) {
      if (originalFormat.startsWith(year.toString())) {
        return `${year}/${month}/${day}`;
      } else {
        return `${month}/${day}/${year}`;
      }
    } else if (originalFormat.includes('-')) {
      if (originalFormat.startsWith(year.toString())) {
        return `${year}-${month}-${day}`;
      } else {
        return `${day}-${month}-${year}`;
      }
    }
    
    return `${year}-${month}-${day}`;
  }

  public clearShiftMap(): void {
    this.shiftMap.clear();
  }

  public validateParameters(parameters: Record<string, any>): boolean {
    const { shiftRange, shiftDirection } = parameters;
    
    if (shiftRange !== undefined && (shiftRange <= 0 || !Number.isInteger(shiftRange))) {
      return false;
    }
    
    if (shiftDirection && !['forward', 'backward', 'both'].includes(shiftDirection)) {
      return false;
    }
    
    return true;
  }

  public getInfo(): AnonymizationTechnique {
    return {
      id: 'date-shifting',
      name: 'Desplazamiento de Fechas',
      category: 'Date Anonymization',
      description: 'Modifica fechas manteniendo intervalos relativos',
      icon: Calendar,
      parameters: [
        {
          name: 'shiftRange',
          type: 'number',
          required: true,
          defaultValue: 365,
          description: 'Rango de desplazamiento en días'
        },
        {
          name: 'preserveWeekday',
          type: 'boolean',
          required: false,
          defaultValue: false,
          description: 'Preservar día de la semana'
        },
        {
          name: 'shiftDirection',
          type: 'select',
          required: false,
          defaultValue: 'both',
          options: ['forward', 'backward', 'both'],
          description: 'Dirección del desplazamiento'
        },
        {
          name: 'consistent',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Desplazamiento consistente para misma fecha'
        }
      ],
      examples: [
        { original: '1985-03-15', anonymized: '1986-07-22' },
        { original: '2020-12-25', anonymized: '2021-04-18' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['HIPAA', 'GDPR']
    };
  }
}