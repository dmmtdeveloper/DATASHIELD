import type { AnonymizationTechnique } from '../../../types/anonymization';
import { Hash } from 'lucide-react';
import crypto from 'crypto';


export class HashingService {
  public async anonymize(data: string | string[], parameters: Record<string, any> = {}): Promise<string | string[]> {
    const { salt = '', preserveLength = false, algorithm = 'SHA256' } = parameters;
    
    const hashSingle = (value: string): string => {
      const saltedValue = value + salt;
      let hash: string;
      
      switch (algorithm) {
        case 'SHA256':
          hash = crypto.createHash('sha256').update(saltedValue).digest('hex');
          break;
        case 'SHA1':
          hash = crypto.createHash('sha1').update(saltedValue).digest('hex');
          break;
        case 'MD5':
          hash = crypto.createHash('md5').update(saltedValue).digest('hex');
          break;
        default:
          hash = crypto.createHash('sha256').update(saltedValue).digest('hex');
      }
      
      if (preserveLength && hash.length > value.length) {
        return hash.substring(0, value.length);
      }
      
      return hash;
    };

    if (Array.isArray(data)) {
      return data.map(hashSingle);
    }
    
    return hashSingle(data);
  }

  public validateParameters(parameters: Record<string, any>): boolean {
    const { algorithm } = parameters;
    if (algorithm && !['SHA256', 'SHA1', 'MD5'].includes(algorithm)) {
      return false;
    }
    return true;
  }

  public getInfo(): AnonymizationTechnique {
    return {
      id: 'hash-sha256',
      name: 'Hash SHA-256',
      category: 'Hashing',
      description: 'Convierte datos en un hash irreversible usando algoritmos criptográficos',
      icon: Hash,
      parameters: [
        {
          name: 'salt',
          type: 'string',
          required: false,
          defaultValue: '',
          description: 'Salt adicional para mayor seguridad'
        },
        {
          name: 'preserveLength',
          type: 'boolean',
          required: false,
          defaultValue: false,
          description: 'Preservar longitud original'
        },
        {
          name: 'algorithm',
          type: 'select',
          required: false,
          defaultValue: 'SHA256',
          options: ['SHA256', 'SHA1', 'MD5'],
          description: 'Algoritmo de hash'
        }
      ],
      examples: [
        { original: 'juan.perez@email.com', anonymized: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' },
        { original: '12345678-9', anonymized: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f' }
      ],
      riskLevel: 'low',
      reversible: false,
      compliance: ['GDPR', 'Ley 19.628', 'Ley 21.719']
    };
  }
}