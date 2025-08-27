import type { AnonymizationTechnique } from '../../../types/anonymization';
import { Key } from 'lucide-react';

export class TokenizationService {
  private tokenMap: Map<string, string> = new Map();
  private reverseTokenMap: Map<string, string> = new Map();
  private tokenCounter: number = 1;

  public async anonymize(data: string | string[], parameters: Record<string, any> = {}): Promise<string | string[]> {
    const { 
      tokenFormat = 'alphanumeric', 
      preserveFormat = true, 
      tokenPrefix = 'TKN',
      consistent = true 
    } = parameters;
    
    const tokenizeSingle = (value: string): string => {
      if (consistent && this.tokenMap.has(value)) {
        return this.tokenMap.get(value)!;
      }
      
      let token: string;
      
      switch (tokenFormat) {
        case 'numeric':
          token = this.generateNumericToken(value, preserveFormat);
          break;
        case 'uuid':
          token = this.generateUUIDToken();
          break;
        case 'alphanumeric':
        default:
          token = this.generateAlphanumericToken(value, preserveFormat, tokenPrefix);
          break;
      }
      
      if (consistent) {
        this.tokenMap.set(value, token);
        this.reverseTokenMap.set(token, value);
      }
      
      return token;
    };

    if (Array.isArray(data)) {
      return data.map(tokenizeSingle);
    }
    
    return tokenizeSingle(data);
  }

  private generateNumericToken(originalValue: string, preserveFormat: boolean): string {
    const tokenNumber = this.tokenCounter++;
    
    if (preserveFormat) {
      const numericPart = originalValue.replace(/\D/g, '');
      if (numericPart.length > 0) {
        const tokenStr = tokenNumber.toString().padStart(numericPart.length, '0');
        return originalValue.replace(/\d/g, (match, index) => {
          const numericIndex = originalValue.substring(0, index).replace(/\D/g, '').length;
          return tokenStr[numericIndex] || match;
        });
      }
    }
    
    return tokenNumber.toString();
  }

  private generateUUIDToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateAlphanumericToken(originalValue: string, preserveFormat: boolean, prefix: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const tokenId = this.tokenCounter++;
    
    if (preserveFormat) {
      let token = '';
      let charIndex = 0;
      const tokenBase = `${prefix}${tokenId}`;
      
      for (const char of originalValue) {
        if (/[a-zA-Z0-9]/.test(char)) {
          token += tokenBase[charIndex % tokenBase.length] || chars[Math.floor(Math.random() * chars.length)];
          charIndex++;
        } else {
          token += char;
        }
      }
      
      return token;
    }
    
    return `${prefix}_${tokenId.toString().padStart(6, '0')}`;
  }

  public async detokenize(token: string): Promise<string | null> {
    return this.reverseTokenMap.get(token) || null;
  }

  public clearTokenMap(): void {
    this.tokenMap.clear();
    this.reverseTokenMap.clear();
    this.tokenCounter = 1;
  }

  public validateParameters(parameters: Record<string, any>): boolean {
    const { tokenFormat } = parameters;
    if (tokenFormat && !['alphanumeric', 'numeric', 'uuid'].includes(tokenFormat)) {
      return false;
    }
    return true;
  }

  public getInfo(): AnonymizationTechnique {
    return {
      id: 'tokenization',
      name: 'Tokenización',
      category: 'Tokenization',
      description: 'Reemplaza datos sensibles con tokens únicos reversibles',
      icon: Key,
      parameters: [
        {
          name: 'tokenFormat',
          type: 'select',
          required: true,
          defaultValue: 'alphanumeric',
          options: ['alphanumeric', 'numeric', 'uuid'],
          description: 'Formato del token'
        },
        {
          name: 'preserveFormat',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Preservar formato original'
        },
        {
          name: 'tokenPrefix',
          type: 'string',
          required: false,
          defaultValue: 'TKN',
          description: 'Prefijo para tokens'
        },
        {
          name: 'consistent',
          type: 'boolean',
          required: false,
          defaultValue: true,
          description: 'Tokens consistentes para mismo valor'
        }
      ],
      examples: [
        { original: '4532-1234-5678-9012', anonymized: 'TKN-8765-4321-0987' },
        { original: 'juan.perez@email.com', anonymized: 'token.abc123@domain.tkn' }
      ],
      riskLevel: 'low',
      reversible: true,
      compliance: ['PCI-DSS', 'GDPR', 'Ley 21.719']
    };
  }
}