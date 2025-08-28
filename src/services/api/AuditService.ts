import type { 
  AuditLog, 
  AuditFilters, 
  AuditSearchResult, 
  AuditExportConfig, 
  AuditReport, 
  AuditStatistics, 
  AuditAlert, 
  AuditDashboardData,
  AuditAction,
  AuditModule,
  AuditSeverity
} from '../../types/audit.types';
import { mockAuditLogs} from '../../data/mockAuditData';

export class AuditService {
  private static instance: AuditService;
  private auditLogs: AuditLog[] = [];
  private alerts: AuditAlert[] = [];
  private reports: AuditReport[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private initializeMockData(): void {
    // Cargar datos mock iniciales
    this.auditLogs = [...mockAuditLogs];
  }

  /**
   * Buscar registros de auditoría con filtros
   */
  public async searchAuditLogs(filters: AuditFilters): Promise<AuditSearchResult> {
    try {
      let filteredLogs = [...this.auditLogs];

      // Aplicar filtros
      if (filters.startDate || filters.dateFrom) {
        const startDate = filters.startDate || filters.dateFrom;
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= startDate!
        );
      }

      if (filters.endDate || filters.dateTo) {
        const endDate = filters.endDate || filters.dateTo;
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= endDate!
        );
      }

      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => 
          log.userId.includes(filters.userId!)
        );
      }

      if (filters.userName) {
        filteredLogs = filteredLogs.filter(log => 
          log.userName.toLowerCase().includes(filters.userName!.toLowerCase())
        );
      }

      if (filters.userRole) {
        filteredLogs = filteredLogs.filter(log => 
          log.userRole === filters.userRole
        );
      }

      if (filters.actions && filters.actions.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filters.actions!.includes(log.action)
        );
      }

      if (filters.modules && filters.modules.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filters.modules!.includes(log.module)
        );
      }

      if (filters.severity && filters.severity.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filters.severity!.includes(log.severity)
        );
      }

      if (filters.status && filters.status.length > 0) {
        filteredLogs = filteredLogs.filter(log => 
          filters.status!.includes(log.status)
        );
      }

      if (filters.resourceType) {
        filteredLogs = filteredLogs.filter(log => 
          log.resourceType.toLowerCase().includes(filters.resourceType!.toLowerCase())
        );
      }

      if (filters.resourceId) {
        filteredLogs = filteredLogs.filter(log => 
          log.resourceId?.includes(filters.resourceId!)
        );
      }

      if (filters.ipAddress) {
        filteredLogs = filteredLogs.filter(log => 
          log.ipAddress.includes(filters.ipAddress!)
        );
      }

      if (filters.searchText) {
        const searchTerm = filters.searchText.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.details.toLowerCase().includes(searchTerm) ||
          log.userName.toLowerCase().includes(searchTerm) ||
          log.resourceName?.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.module.toLowerCase().includes(searchTerm)
        );
      }

      // Ordenamiento
      if (filters.sortBy) {
        filteredLogs.sort((a, b) => {
          const aValue = a[filters.sortBy!];
          const bValue = b[filters.sortBy!];
          
          if (aValue !== undefined && bValue !== undefined && aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
          if (aValue !== undefined && bValue !== undefined && aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      } else {
        // Ordenamiento por defecto: más recientes primero
        filteredLogs.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }

      // Paginación
      const total = filteredLogs.length;
      const pageSize = filters.limit || 50;
      const offset = filters.offset || 0;
      const page = Math.floor(offset / pageSize) + 1;
      const totalPages = Math.ceil(total / pageSize);
      
      const paginatedLogs = filteredLogs.slice(offset, offset + pageSize);

      return {
        logs: paginatedLogs,
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      };
    } catch (error) {
      console.error('Error searching audit logs:', error);
      throw new Error('Error al buscar registros de auditoría');
    }
  }

  /**
   * Obtener un registro de auditoría por ID
   */
  public async getAuditLogById(id: string): Promise<AuditLog | null> {
    try {
      return this.auditLogs.find(log => log.id === id) || null;
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      throw new Error('Error al obtener registro de auditoría');
    }
  }

  /**
   * Crear un nuevo registro de auditoría
   */
  public async createAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    try {
      const newLog: AuditLog = {
        id: this.generateId(),
        timestamp: new Date(),
        ...logData
      };

      this.auditLogs.unshift(newLog); // Agregar al inicio para mantener orden cronológico
      
      // Verificar alertas
      await this.checkAlerts(newLog);
      
      return newLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw new Error('Error al crear registro de auditoría');
    }
  }

  /**
   * Exportar registros de auditoría
   */
  public async exportAuditLogs(config: AuditExportConfig): Promise<AuditReport> {
    try {
      const searchResult = await this.searchAuditLogs(config.filters);
      
      const report: AuditReport = {
        id: this.generateId(),
        name: config.fileName || `audit_export_${new Date().toISOString().split('T')[0]}`,
        description: `Exportación de ${searchResult.total} registros de auditoría`,
        filters: config.filters,
        generatedAt: new Date(),
        generatedBy: 'current_user', // En producción, obtener del contexto de autenticación
        totalRecords: searchResult.total,
        format: config.format,
        status: 'generating'
      };

      this.reports.push(report);

      // Simular procesamiento asíncrono
      setTimeout(() => {
        const updatedReport = this.reports.find(r => r.id === report.id);
        if (updatedReport) {
          updatedReport.status = 'completed';
          updatedReport.downloadUrl = `/api/reports/${report.id}/download`;
          updatedReport.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        }
      }, 2000);

      return report;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw new Error('Error al exportar registros de auditoría');
    }
  }

  /**
   * Obtener estadísticas de auditoría
   */
  public async getAuditStatistics(): Promise<AuditStatistics> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const totalLogs = this.auditLogs.length;
      const logsToday = this.auditLogs.filter(log => 
        new Date(log.timestamp) >= today
      ).length;
      const logsThisWeek = this.auditLogs.filter(log => 
        new Date(log.timestamp) >= thisWeek
      ).length;
      const logsThisMonth = this.auditLogs.filter(log => 
        new Date(log.timestamp) >= thisMonth
      ).length;

      // Breakdown por acción
      const actionBreakdown = this.auditLogs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<AuditAction, number>);

      // Breakdown por módulo
      const moduleBreakdown = this.auditLogs.reduce((acc, log) => {
        acc[log.module] = (acc[log.module] || 0) + 1;
        return acc;
      }, {} as Record<AuditModule, number>);

      // Breakdown por severidad
      const severityBreakdown = this.auditLogs.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1;
        return acc;
      }, {} as Record<AuditSeverity, number>);

      // Breakdown por estado
      const statusBreakdown = this.auditLogs.reduce((acc, log) => {
        acc[log.status] = (acc[log.status] || 0) + 1;
        return acc;
      }, {} as Record<'success' | 'failure' | 'warning', number>);

      // Top usuarios
      const userCounts = this.auditLogs.reduce((acc, log) => {
        const key = `${log.userId}:${log.userName}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topUsers = Object.entries(userCounts)
        .map(([key, count]) => {
          const [userId, userName] = key.split(':');
          return { userId, userName, actionCount: count };
        })
        .sort((a, b) => b.actionCount - a.actionCount)
        .slice(0, 10);

      // Actividad reciente
      const recentActivity = this.auditLogs
        .slice(0, 20)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Tendencias de errores
      const errorTrends = this.calculateErrorTrends();

      return {
        totalLogs,
        logsToday,
        logsThisWeek,
        logsThisMonth,
        actionBreakdown,
        moduleBreakdown,
        severityBreakdown,
        statusBreakdown,
        topUsers,
        recentActivity,
        errorTrends
      };
    } catch (error) {
      console.error('Error getting audit statistics:', error);
      throw new Error('Error al obtener estadísticas de auditoría');
    }
  }

  /**
   * Obtener datos del dashboard de auditoría
   */
  public async getAuditDashboardData(): Promise<AuditDashboardData> {
    try {
      const statistics = await this.getAuditStatistics();
      const recentAlerts = this.alerts
        .filter(alert => alert.isActive)
        .sort((a, b) => new Date(b.lastTriggered || 0).getTime() - new Date(a.lastTriggered || 0).getTime())
        .slice(0, 5);

      return {
        statistics,
        recentAlerts,
        systemHealth: {
          auditingStatus: this.calculateAuditingStatus(),
          storageUsage: this.calculateStorageUsage(),
          retentionCompliance: this.checkRetentionCompliance(),
          lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000) // Simulado
        },
        complianceMetrics: {
          dataRetentionDays: 2555, // 7 años según normativas chilenas
          gdprCompliance: true,
          iso27001Compliance: true,
          localLawCompliance: true // Ley 21.719 y 19.628
        }
      };
    } catch (error) {
      console.error('Error getting audit dashboard data:', error);
      throw new Error('Error al obtener datos del dashboard de auditoría');
    }
  }

  /**
   * Gestión de alertas
   */
  public async createAlert(alert: Omit<AuditAlert, 'id' | 'createdAt' | 'triggerCount'>): Promise<AuditAlert> {
    try {
      const newAlert: AuditAlert = {
        id: this.generateId(),
        createdAt: new Date(),
        triggerCount: 0,
        ...alert
      };

      this.alerts.push(newAlert);
      return newAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw new Error('Error al crear alerta');
    }
  }

  public async getAlerts(): Promise<AuditAlert[]> {
    return [...this.alerts];
  }

  public async updateAlert(id: string, updates: Partial<AuditAlert>): Promise<AuditAlert> {
    try {
      const alertIndex = this.alerts.findIndex(alert => alert.id === id);
      if (alertIndex === -1) {
        throw new Error('Alerta no encontrada');
      }

      this.alerts[alertIndex] = { ...this.alerts[alertIndex], ...updates };
      return this.alerts[alertIndex];
    } catch (error) {
      console.error('Error updating alert:', error);
      throw new Error('Error al actualizar alerta');
    }
  }

  public async deleteAlert(id: string): Promise<void> {
    try {
      const alertIndex = this.alerts.findIndex(alert => alert.id === id);
      if (alertIndex === -1) {
        throw new Error('Alerta no encontrada');
      }

      this.alerts.splice(alertIndex, 1);
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw new Error('Error al eliminar alerta');
    }
  }

  /**
   * Gestión de reportes
   */
  public async getReports(): Promise<AuditReport[]> {
    return [...this.reports].sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  public async getReportById(id: string): Promise<AuditReport | null> {
    return this.reports.find(report => report.id === id) || null;
  }

  public async deleteReport(id: string): Promise<void> {
    try {
      const reportIndex = this.reports.findIndex(report => report.id === id);
      if (reportIndex === -1) {
        throw new Error('Reporte no encontrado');
      }

      this.reports.splice(reportIndex, 1);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Error al eliminar reporte');
    }
  }

  /**
   * Limpieza de registros antiguos
   */
  public async cleanupOldLogs(retentionDays: number = 2555): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
      const initialCount = this.auditLogs.length;
      
      this.auditLogs = this.auditLogs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      );
      
      const deletedCount = initialCount - this.auditLogs.length;
      
      if (deletedCount > 0) {
        await this.createAuditLog({
          userId: 'system',
          userName: 'Sistema',
          userRole: 'system',
          action: 'audit_log_delete',
          module: 'system',
          resourceType: 'audit_logs',
          details: `Limpieza automática: ${deletedCount} registros eliminados`,
          ipAddress: '127.0.0.1',
          userAgent: 'System',
          sessionId: 'system',
          severity: 'low',
          status: 'success',
          metadata: {
            deletedCount,
            retentionDays,
            cutoffDate: cutoffDate.toISOString()
          }
        });
      }
      
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
      throw new Error('Error al limpiar registros antiguos');
    }
  }

  // Métodos privados auxiliares
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async checkAlerts(log: AuditLog): Promise<void> {
    for (const alert of this.alerts.filter(a => a.isActive)) {
      if (this.evaluateAlertConditions(log, alert.conditions)) {
        alert.lastTriggered = new Date();
        alert.triggerCount++;
        
        // Ejecutar acciones de la alerta
        await this.executeAlertActions(alert, log);
      }
    }
  }

  private evaluateAlertConditions(log: AuditLog, conditions: any[]): boolean {
    // Implementación simplificada de evaluación de condiciones
    return conditions.some(condition => {
      const logValue = log[condition.field as keyof AuditLog];
      
      switch (condition.operator) {
        case 'equals':
          return logValue === condition.value;
        case 'not_equals':
          return logValue !== condition.value;
        case 'contains':
          return String(logValue).includes(condition.value);
        case 'not_contains':
          return !String(logValue).includes(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(logValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(logValue);
        default:
          return false;
      }
    });
  }

  private async executeAlertActions(alert: AuditAlert, log: AuditLog): Promise<void> {
    for (const action of alert.actions) {
      try {
        switch (action.type) {
          case 'email':
            console.log(`Enviando email de alerta: ${alert.name}`);
            break;
          case 'webhook':
            console.log(`Ejecutando webhook: ${action.configuration.webhookUrl}`);
            break;
          case 'notification':
            console.log(`Mostrando notificación: ${alert.name}`);
            break;
        }
      } catch (error) {
        console.error(`Error ejecutando acción de alerta ${action.type}:`, error);
      }
    }
  }

  private calculateErrorTrends(): Array<{date: string; errorCount: number; totalCount: number; errorRate: number}> {
    const trends: Array<{date: string; errorCount: number; totalCount: number; errorRate: number}> = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = this.auditLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === dateStr;
      });
      
      const errorCount = dayLogs.filter(log => log.status === 'failure').length;
      const totalCount = dayLogs.length;
      const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;
      
      trends.push({
        date: dateStr,
        errorCount,
        totalCount,
        errorRate: Math.round(errorRate * 100) / 100
      });
    }
    
    return trends;
  }

  private calculateAuditingStatus(): 'healthy' | 'warning' | 'critical' {
    const recentLogs = this.auditLogs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Última hora
    );
    
    const errorRate = recentLogs.length > 0 
      ? recentLogs.filter(log => log.status === 'failure').length / recentLogs.length 
      : 0;
    
    if (errorRate > 0.1) return 'critical'; // Más del 10% de errores
    if (errorRate > 0.05) return 'warning'; // Más del 5% de errores
    return 'healthy';
  }

  private calculateStorageUsage(): number {
    // Simulación del uso de almacenamiento (en MB)
    const avgLogSize = 2; // KB por log
    const totalSize = this.auditLogs.length * avgLogSize;
    return Math.round(totalSize / 1024 * 100) / 100; // Convertir a MB
  }

  private checkRetentionCompliance(): boolean {
    const oldestLog = this.auditLogs.reduce((oldest, log) => 
      new Date(log.timestamp) < new Date(oldest.timestamp) ? log : oldest
    , this.auditLogs[0]);
    
    if (!oldestLog) return true;
    
    const daysSinceOldest = (Date.now() - new Date(oldestLog.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceOldest <= 2555; // 7 años
  }
}

// Exportar instancia singleton
export const auditService = AuditService.getInstance();
export default auditService;