export interface DatabaseTable {
  name: string;
  schema: string;
  rowCount: number;
  columns: TableColumn[];
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isSensitive: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  sampleValues?: string[];
}

export interface ColumnMapping {
  sourceColumn: string;
  technique: string;
  parameters: Record<string, any>;
  targetColumn?: string;
  preserveNull: boolean;
}

export interface BatchJobConfig {
  name: string;
  description: string;
  sourceTable: string;
  targetTable: string;
  columnMappings: ColumnMapping[];
  technique: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledTime?: Date;
  parameters: Record<string, any>;
}