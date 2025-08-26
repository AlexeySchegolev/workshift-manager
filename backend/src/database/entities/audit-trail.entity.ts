import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SOFT_DELETE = 'soft_delete',
  RESTORE = 'restore',
  LOGIN = 'login',
  LOGOUT = 'logout',
  APPROVE = 'approve',
  REJECT = 'reject',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  OVERRIDE = 'override',
  EXPORT = 'export',
  IMPORT = 'import',
  BULK_UPDATE = 'bulk_update',
  BULK_DELETE = 'bulk_delete',
  SYSTEM_ACTION = 'system_action'
}

export enum AuditEntityType {
  USER = 'user',
  ORGANIZATION = 'organization',
  EMPLOYEE = 'employee',
  ROLE = 'role',
  LOCATION = 'location',
  SHIFT = 'shift',
  SHIFT_PLAN = 'shift_plan',
  SHIFT_ASSIGNMENT = 'shift_assignment',
  EMPLOYEE_AVAILABILITY = 'employee_availability',
  SHIFT_PREFERENCE = 'shift_preference',
  WORK_TIME_CONSTRAINT = 'work_time_constraint',
  SHIFT_CONSTRAINT = 'shift_constraint',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  SHIFT_RULES = 'shift_rules',
  SYSTEM = 'system'
}

export enum AuditSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AuditSource {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  SYSTEM = 'system',
  IMPORT = 'import',
  MIGRATION = 'migration',
  SCHEDULER = 'scheduler',
  WEBHOOK = 'webhook'
}

export interface AuditMetadata {
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  requestId?: string;
  correlationId?: string;
  deviceInfo?: string;
  location?: string;
  apiVersion?: string;
  clientVersion?: string;
}

export interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
  fieldType?: string;
  isEncrypted?: boolean;
}

@Entity('audit_trails')
@Index(['entityType', 'entityId'])
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
@Index(['organizationId', 'createdAt'])
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  @Index()
  organizationId?: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  @Index()
  userId?: string;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  @Index()
  action: AuditAction;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: AuditEntityType,
  })
  @Index()
  entityType: AuditEntityType;

  @Column({ name: 'entity_id', type: 'varchar', length: 255 })
  @Index()
  entityId: string;

  @Column({ name: 'entity_name', type: 'varchar', length: 255, nullable: true })
  entityName?: string; // Human-readable name of the entity

  @Column({ name: 'parent_entity_type', type: 'varchar', length: 100, nullable: true })
  parentEntityType?: string;

  @Column({ name: 'parent_entity_id', type: 'varchar', length: 255, nullable: true })
  parentEntityId?: string;

  @Column({
    type: 'enum',
    enum: AuditSeverity,
    default: AuditSeverity.MEDIUM,
  })
  severity: AuditSeverity;

  @Column({
    name: 'source',
    type: 'enum',
    enum: AuditSource,
    default: AuditSource.WEB_APP,
  })
  source: AuditSource;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'detailed_description', type: 'text', nullable: true })
  detailedDescription?: string;

  @Column({ 
    name: 'old_values',
    type: 'jsonb',
    nullable: true
  })
  oldValues?: Record<string, any>; // Previous state of the entity

  @Column({ 
    name: 'new_values',
    type: 'jsonb',
    nullable: true
  })
  newValues?: Record<string, any>; // New state of the entity

  @Column({ 
    name: 'field_changes',
    type: 'jsonb',
    default: []
  })
  fieldChanges: FieldChange[]; // Detailed field-by-field changes

  @Column({ 
    name: 'metadata',
    type: 'jsonb',
    default: {}
  })
  metadata: AuditMetadata; // Additional context information

  @Column({ 
    name: 'tags',
    type: 'jsonb',
    default: []
  })
  tags: string[]; // Tags for categorization and filtering

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress?: string; // IPv4 or IPv6

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  @Column({ name: 'request_id', type: 'varchar', length: 255, nullable: true })
  requestId?: string;

  @Column({ name: 'correlation_id', type: 'varchar', length: 255, nullable: true })
  correlationId?: string; // For tracking related operations

  @Column({ name: 'transaction_id', type: 'varchar', length: 255, nullable: true })
  transactionId?: string; // Database transaction ID

  @Column({ name: 'batch_id', type: 'varchar', length: 255, nullable: true })
  batchId?: string; // For bulk operations

  @Column({ name: 'operation_duration', type: 'integer', nullable: true })
  operationDuration?: number; // Duration in milliseconds

  @Column({ name: 'affected_records_count', type: 'integer', default: 1 })
  affectedRecordsCount: number; // Number of records affected

  @Column({ name: 'is_sensitive', type: 'boolean', default: false })
  isSensitive: boolean; // Contains sensitive information

  @Column({ name: 'is_system_generated', type: 'boolean', default: false })
  isSystemGenerated: boolean; // Generated by system vs. user action

  @Column({ name: 'requires_retention', type: 'boolean', default: true })
  requiresRetention: boolean; // Should be kept for compliance

  @Column({ name: 'retention_period_days', type: 'integer', nullable: true })
  retentionPeriodDays?: number; // How long to keep this record

  @Column({ name: 'compliance_flags', type: 'jsonb', default: [] })
  complianceFlags: string[]; // GDPR, HIPAA, SOX, etc.

  @Column({ name: 'risk_level', type: 'integer', default: 1 })
  riskLevel: number; // 1-5 scale for security risk

  @Column({ name: 'success', type: 'boolean', default: true })
  success: boolean; // Whether the operation succeeded

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string; // Error message if operation failed

  @Column({ name: 'error_code', type: 'varchar', length: 100, nullable: true })
  errorCode?: string; // Error code if operation failed

  @Column({ 
    name: 'validation_errors',
    type: 'jsonb',
    default: []
  })
  validationErrors: string[]; // Validation errors that occurred

  @Column({ 
    name: 'warnings',
    type: 'jsonb',
    default: []
  })
  warnings: string[]; // Warnings generated during operation

  @Column({ name: 'performance_metrics', type: 'jsonb', default: {} })
  performanceMetrics: Record<string, any>; // Performance data

  @Column({ name: 'business_impact', type: 'varchar', length: 500, nullable: true })
  businessImpact?: string; // Description of business impact

  @Column({ name: 'rollback_data', type: 'jsonb', nullable: true })
  rollbackData?: Record<string, any>; // Data needed to rollback the change

  @Column({ name: 'approval_required', type: 'boolean', default: false })
  approvalRequired: boolean;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'notification_sent', type: 'boolean', default: false })
  notificationSent: boolean;

  @Column({ name: 'archived', type: 'boolean', default: false })
  archived: boolean;

  @Column({ name: 'archived_at', type: 'timestamp', nullable: true })
  archivedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  // Virtual fields
  get isRecent(): boolean {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt > oneDayAgo;
  }

  get isHighRisk(): boolean {
    return this.riskLevel >= 4 || this.severity === AuditSeverity.CRITICAL;
  }

  get shouldBeRetained(): boolean {
    if (!this.requiresRetention) return false;
    if (!this.retentionPeriodDays) return true;
    
    const retentionDate = new Date(this.createdAt);
    retentionDate.setDate(retentionDate.getDate() + this.retentionPeriodDays);
    
    return new Date() < retentionDate;
  }

  get displayAction(): string {
    return this.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get displayEntityType(): string {
    return this.entityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get displaySeverity(): string {
    return this.severity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get displaySource(): string {
    return this.source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get hasChanges(): boolean {
    return this.fieldChanges.length > 0 || 
           (this.oldValues && Object.keys(this.oldValues).length > 0) ||
           (this.newValues && Object.keys(this.newValues).length > 0);
  }

  get changesSummary(): string {
    if (this.fieldChanges.length === 0) return 'No changes recorded';
    
    const changedFields = this.fieldChanges.map(change => change.field);
    if (changedFields.length <= 3) {
      return `Changed: ${changedFields.join(', ')}`;
    }
    
    return `Changed: ${changedFields.slice(0, 3).join(', ')} and ${changedFields.length - 3} more`;
  }

  get durationDisplay(): string {
    if (!this.operationDuration) return 'Unknown';
    
    if (this.operationDuration < 1000) {
      return `${this.operationDuration}ms`;
    } else if (this.operationDuration < 60000) {
      return `${(this.operationDuration / 1000).toFixed(1)}s`;
    } else {
      return `${(this.operationDuration / 60000).toFixed(1)}m`;
    }
  }

  // Helper methods
  addFieldChange(field: string, oldValue: any, newValue: any, fieldType?: string): void {
    this.fieldChanges.push({
      field,
      oldValue,
      newValue,
      fieldType,
      isEncrypted: false
    });
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  addComplianceFlag(flag: string): void {
    if (!this.complianceFlags.includes(flag)) {
      this.complianceFlags.push(flag);
    }
  }

  addWarning(warning: string): void {
    if (!this.warnings.includes(warning)) {
      this.warnings.push(warning);
    }
  }

  addValidationError(error: string): void {
    if (!this.validationErrors.includes(error)) {
      this.validationErrors.push(error);
    }
  }

  setMetadata(key: string, value: any): void {
    this.metadata = { ...this.metadata, [key]: value };
  }

  setPerformanceMetric(key: string, value: any): void {
    this.performanceMetrics = { ...this.performanceMetrics, [key]: value };
  }
}