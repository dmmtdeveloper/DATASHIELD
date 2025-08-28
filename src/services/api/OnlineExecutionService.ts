import type { OnlineSession, OnlineProcessingMetrics, DataInputSource, DataOutputTarget } from '../../types/online.types';
import { TechniqueService } from '../anonymization/TechniqueService';

export class OnlineExecutionService {
  private static instance: OnlineExecutionService;
  private activeSessions: Map<string, OnlineSession> = new Map();
  private sessionMetrics: Map<string, OnlineProcessingMetrics> = new Map();
  private techniqueService: TechniqueService;
  private processingIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.techniqueService = TechniqueService.getInstance();
  }

  public static getInstance(): OnlineExecutionService {
    if (!OnlineExecutionService.instance) {
      OnlineExecutionService.instance = new OnlineExecutionService();
    }
    return OnlineExecutionService.instance;
  }

  // Gestión de sesiones
  public async createSession(sessionConfig: Partial<OnlineSession>): Promise<OnlineSession> {
    const session: OnlineSession = {
      id: this.generateSessionId(),
      name: sessionConfig.name || 'Nueva Sesión',
      description: sessionConfig.description || '',
      technique: sessionConfig.technique || 'hashing',
      inputSource: sessionConfig.inputSource!,
      outputTarget: sessionConfig.outputTarget!,
      status: 'stopped',
      startTime: new Date(),
      recordsProcessed: 0,
      recordsPerSecond: 0,
      errorCount: 0,
      createdBy: sessionConfig.createdBy || 'system',
      parameters: sessionConfig.parameters || {},
      isActive: false
    };

    this.activeSessions.set(session.id, session);
    this.initializeMetrics(session.id);
    
    return session;
  }

  public async startSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Sesión no encontrada: ${sessionId}`);
    }

    // Validar conexión a fuente de datos
    await this.validateDataSource(session.inputSource);
    
    // Actualizar estado de sesión
    session.status = 'running';
    session.isActive = true;
    session.startTime = new Date();
    
    // Iniciar procesamiento
    this.startProcessing(sessionId);
    
    this.activeSessions.set(sessionId, session);
  }

  public async pauseSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Sesión no encontrada: ${sessionId}`);
    }

    session.status = 'paused';
    session.isActive = false;
    
    // Detener procesamiento
    this.stopProcessing(sessionId);
    
    this.activeSessions.set(sessionId, session);
  }

  public async stopSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Sesión no encontrada: ${sessionId}`);
    }

    session.status = 'stopped';
    session.isActive = false;
    session.endTime = new Date();
    
    // Detener procesamiento
    this.stopProcessing(sessionId);
    
    this.activeSessions.set(sessionId, session);
  }

  public getSession(sessionId: string): OnlineSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  public getAllSessions(): OnlineSession[] {
    return Array.from(this.activeSessions.values());
  }

  public getActiveSessions(): OnlineSession[] {
    return Array.from(this.activeSessions.values()).filter(session => session.isActive);
  }

  // Procesamiento en tiempo real
  private startProcessing(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const interval = setInterval(async () => {
      try {
        await this.processDataBatch(sessionId);
      } catch (error) {
        console.error(`Error en procesamiento de sesión ${sessionId}:`, error);
        await this.handleProcessingError(sessionId, error);
      }
    }, session.inputSource.configuration.pollInterval || 5000);

    this.processingIntervals.set(sessionId, interval);
  }

  private stopProcessing(sessionId: string): void {
    const interval = this.processingIntervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.processingIntervals.delete(sessionId);
    }
  }

  private async processDataBatch(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) return;

    const startTime = Date.now();
    
    try {
      // Simular obtención de datos de la fuente
      const rawData = await this.fetchDataFromSource(session.inputSource);
      
      if (rawData.length === 0) return;

      // Aplicar anonimización
      const anonymizedData = await this.anonymizeDataBatch(rawData, session);
      
      // Enviar datos al destino
      await this.sendDataToTarget(anonymizedData, session.outputTarget);
      
      // Actualizar métricas
      const processingTime = Date.now() - startTime;
      this.updateMetrics(sessionId, rawData.length, processingTime);
      
      // Actualizar sesión
      session.recordsProcessed += rawData.length;
      this.activeSessions.set(sessionId, session);
      
    } catch (error) {
      await this.handleProcessingError(sessionId, error);
    }
  }

  private async anonymizeDataBatch(data: any[], session: OnlineSession): Promise<any[]> {
    const anonymizedData = [];
    
    for (const record of data) {
      const anonymizedRecord = { ...record };
      
      // Aplicar anonimización a campos sensibles
      for (const field of session.inputSource.schema) {
        if (field.isSensitive && record[field.fieldName] !== undefined) {
          const result = await this.techniqueService.applyTechnique(
            field.anonymizationTechnique || session.technique,
            record[field.fieldName],
            session.parameters
          );
          
          if (result.success) {
            anonymizedRecord[field.fieldName] = result.anonymizedData[0];
          } else {
            throw new Error(`Error anonimizando campo ${field.fieldName}: ${result.error}`);
          }
        }
      }
      
      anonymizedData.push(anonymizedRecord);
    }
    
    return anonymizedData;
  }

  // Métricas y monitoreo
  private initializeMetrics(sessionId: string): void {
    const metrics: OnlineProcessingMetrics = {
      sessionId,
      throughput: 0,
      latency: 0,
      errorRate: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      timestamp: new Date(),
      recordsProcessed: 0,
      recordsPerSecond: 0,
      errorCount: 0,
    };
    
    this.sessionMetrics.set(sessionId, metrics);
  }

  private updateMetrics(sessionId: string, recordsProcessed: number, processingTime: number): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (!metrics) return;

    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Calcular throughput (registros por segundo)
    const throughput = recordsProcessed / (processingTime / 1000);
    
    // Actualizar métricas
    metrics.throughput = throughput;
    metrics.latency = processingTime;
    metrics.timestamp = new Date();
    
    // Simular métricas de sistema
    metrics.cpuUsage = Math.random() * 100;
    metrics.memoryUsage = Math.random() * 100;
    
    // Actualizar velocidad en sesión
    session.recordsPerSecond = Math.round(throughput);
    
    this.sessionMetrics.set(sessionId, metrics);
    this.activeSessions.set(sessionId, session);
  }

  public getSessionMetrics(sessionId: string): OnlineProcessingMetrics | undefined {
    return this.sessionMetrics.get(sessionId);
  }

  public getAllMetrics(): OnlineProcessingMetrics[] {
    return Array.from(this.sessionMetrics.values());
  }

  // Validación y conexiones
  private async validateDataSource(source: DataInputSource): Promise<boolean> {
    // Simular validación de conexión
    switch (source.type) {
      case 'api':
        return this.validateApiConnection(source.configuration.endpoint || '');
      case 'database':
        return this.validateDatabaseConnection(source.configuration.connectionString || '');
      case 'stream':
        return this.validateStreamConnection(source.configuration.endpoint || '');
      case 'file':
        return this.validateFileAccess(source.configuration.filePath || '');
      default:
        return false;
    }
  }

  private async validateApiConnection(endpoint: string): Promise<boolean> {
    try {
      // Simular validación de API
      console.log(`Validando conexión API: ${endpoint}`);
      return true;
    } catch {
      return false;
    }
  }

  private async validateDatabaseConnection(connectionString: string): Promise<boolean> {
    try {
      // Simular validación de base de datos
      console.log(`Validando conexión BD: ${connectionString}`);
      return true;
    } catch {
      return false;
    }
  }

  private async validateStreamConnection(endpoint: string): Promise<boolean> {
    try {
      // Simular validación de stream
      console.log(`Validando conexión Stream: ${endpoint}`);
      return true;
    } catch {
      return false;
    }
  }

  private async validateFileAccess(filePath: string): Promise<boolean> {
    try {
      // Simular validación de archivo
      console.log(`Validando acceso archivo: ${filePath}`);
      return true;
    } catch {
      return false;
    }
  }

  // Simulación de datos
  private async fetchDataFromSource(source: DataInputSource): Promise<any[]> {
    // Simular obtención de datos según el tipo de fuente
    const mockData = [];
    const batchSize = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < batchSize; i++) {
      const record: any = {};
      
      source.schema.forEach(field => {
        switch (field.dataType) {
          case 'string':
            record[field.fieldName] = `valor_${Math.random().toString(36).substr(2, 9)}`;
            break;
          case 'number':
            record[field.fieldName] = Math.floor(Math.random() * 1000);
            break;
          case 'string': // Handle email as string type
            record[field.fieldName] = `usuario${i}@ejemplo.com`;
            break;
          case 'date':
            record[field.fieldName] = new Date().toISOString();
            break;
          default:
            record[field.fieldName] = `dato_${i}`;
        }
      });
      
      mockData.push(record);
    }
    
    return mockData;
  }

  private async sendDataToTarget(data: any[], target: DataOutputTarget): Promise<void> {
    // Simular envío de datos al destino
    console.log(`Enviando ${data.length} registros a ${target.type}: ${target.name}`);
  }

  private async handleProcessingError(sessionId: string, error: any): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.errorCount++;
    
    // Si hay muchos errores, pausar la sesión
    if (session.errorCount > 10) {
      session.status = 'error';
      session.isActive = false;
      this.stopProcessing(sessionId);
    }
    
    this.activeSessions.set(sessionId, session);
    
    console.error(`Error en sesión ${sessionId}:`, error);
  }

  // Utilidades
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  public cleanup(): void {
    // Detener todos los procesamientos
    this.processingIntervals.forEach((interval, sessionId) => {
      clearInterval(interval);
    });
    
    this.processingIntervals.clear();
    this.activeSessions.clear();
    this.sessionMetrics.clear();
  }
}