import { AnonymizationTechnique } from '../../../types/anonymization';
import { EyeOff } from 'lucide-react';

export class MaskingService {
  public async anonymize(data: string | string[], parameters: Record<string, any> = {}): Promise<string | string[]> {
    const { 
      maskChar = '*', 
      visibleStart = 2, 
      visibleEnd = 2, 
      preserveFormat = true,
      maskType = 'partial'
    } = parameters;
    
    const maskSingle = (value: string): string => {
      if (!value || value.length === 0) return value;
      
      switch (maskType) {
        case 'full':
          return preserveFormat ? 
            value.replace(/[a-zA-Z0-9]/g, maskChar) : 
            maskChar.repeat(value.length);
            
        case 'partial':
          if (value.length <= visibleStart + visibleEnd) {
            return maskChar.repeat(value.length);
          }
          
          const start = value.substring(0, visibleStart);
          const end = value.substring(value.length - visibleEnd);
          const middle = maskChar.repeat(value.length - visibleStart - visibleEnd);
          
          return start + middle + end;
          
        case 'email':
          const emailMatch = value.match(/^([^@]+)@(.+)$/);
          if (emailMatch) {
            const [, localPart, domain] = emailMatch;
            const maskedLocal = this.maskEmailLocal(localPart, maskChar, visibleStart);
            const maskedDomain = this.maskEmailDomain(domain, maskChar);
            return `${maskedLocal}@${maskedDomain}`;
          }
          return this.maskSingle(value);
          
        case 'phone':
          return this.maskPhone(value, maskChar, parameters);
          
        case 'credit-card':
          return this.maskCreditCard(value, maskChar, parameters);
          
        default:
          return this.maskSingle(value);
      }
    };

    if (Array.isArray(data)) {
      return data.map(maskSingle);
    }
    
    return maskSingle(data);
  }

  private maskEmailLocal(localPart: string, maskChar: string, visibleStart: number): string {
    if (localPart.length <= visibleStart) {
      return maskChar.repeat(localPart.length);
    }
    return localPart.substring(0, visibleStart) + maskChar.repeat(localPart.length - visibleStart);
  }

  private maskEmailDomain(domain: string, maskChar: string): string {
    const parts = domain.split('.');
    if (parts.length > 1) {
      const maskedParts = parts.map((part, index) => {
        if (index === parts.length - 1) return part; // Preserve TLD
        return part.length > 2 ? part.substring(0, 2) + maskChar.repeat(part.length - 2) : part;
      });
      return maskedParts.join('.');
    }
    return domain;
  }

  private maskPhone(value: string, maskChar: string, parameters: Record<string, any>): string {
    const { preserveCountryCode = true, preserveAreaCode = false } = parameters;
    
    // Simple phone masking logic
    let masked = value;
    if (!preserveCountryCode) {
      masked = masked.replace(/^\+\d{1,3}/, `+${maskChar.repeat(2)}`);
    }
    if (!preserveAreaCode) {
      masked = masked.replace(/\((\d+)\)/, `(${maskChar.repeat(2)})`);
    }
    
    return masked.replace(/\d{4,}/g, (match) => {
      return maskChar.repeat(match.length);
    });
  }

  private maskCreditCard(value: string, maskChar: string, parameters: Record<string, any>): string {
    const { showLast = 4 } = parameters;
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length < showLast) {
      return maskChar.repeat(value.length);
    }
    
    const masked = maskChar.repeat(cleanValue.length - showLast) + cleanValue.slice(-showLast);
    
    // Restore original formatting
    let result = '';
    let maskedIndex = 0;
    
    for (const char of value) {
      if (/\d/.test(char)) {
        result += masked[maskedIndex++];
      } else {
        result += char;
      }
    }
    
    return result;
  }

  public validateParameters(parameters: Record<string, any>): boolean {
    const { visibleStart, visibleEnd, maskType } = parameters;
    
    if (visibleStart !== undefined && (visibleStart < 0 || !Number.isInteger(visibleStart))) {
      return false;
    }
    
    if (visibleEnd !== undefined && (visibleEnd < 0 || !Number.isInteger(visibleEnd))) {
      return false;
    }
    
    if (maskType && !['partial', 'full', 'email', 'phone', 'credit-card'].includes(maskType)) {
      return false;
    }
    
    return true;
  }

  public getInfo(): AnonymizationTechnique {
    return {
      id: 'masking-partial',
      name: 'Enmascaramiento',
      category: 'Masking',
      description: 'Oculta parcial o totalmente los datos manteniendo formato',
      icon: EyeOff,
      parameters: [
        {
          name: 'maskChar',
          type: 'string',
          required: false,
          defaultValue: '*',
          description: 'Carácter para enmascarar'
        },
        {
          name: 'visibleStart',
          type: 'number',
          required: false,
          defaultValue: 2,
          description: 'Caracteres visibles al inicio'
        },
        {
          name: 'visibleEnd',
          type: 'number',
          required: false,
          defaultValue: 2,
          description: 'Caracteres visibles al final'
        },
        {
          name: 'maskType',
          type: 'select',
          required: false,
          defaultValue: 'partial',
          options: ['partial', 'full', 'email', 'phone', 'credit-card'],
          description: 'Tipo de enmascaramiento'
        }
      ],
      examples: [
        { original: 'juan.perez@email.com', anonymized: 'ju*********@em***.com' },
        { original: '12345678-9', anonymized: '12*****8-9' }
      ],
      riskLevel: 'medium',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628']
    };
  }
}