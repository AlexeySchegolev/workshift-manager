import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ConstraintCategory, ViolationType } from './constraint-violation.entity';

/**
 * Entity for managing shift planning rules and constraints.
 * These rules define how the shift planning algorithms should behave
 * and what constraints should be enforced during planning.
 */
@Entity('shift_planning_rules')
export class ShiftPlanningRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rule_code', type: 'varchar', length: 100, unique: true })
  ruleCode: string;

  @Column({ name: 'rule_name', type: 'varchar', length: 255 })
  ruleName: string;

  @Column({ name: 'rule_description', type: 'text', nullable: true })
  ruleDescription?: string;

  @Column({
    name: 'rule_category',
    type: 'enum',
    enum: ConstraintCategory,
    default: ConstraintCategory.OTHER,
  })
  ruleCategory: ConstraintCategory;

  @Column({
    name: 'rule_type',
    type: 'enum',
    enum: ViolationType,
    default: ViolationType.SOFT,
  })
  ruleType: ViolationType;

  @Column({
    name: 'rule_configuration',
    type: 'jsonb',
    default: {}
  })
  ruleConfiguration: Record<string, any>;

  @Column({ name: 'weight', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  weight: number;

  @Column({ name: 'priority', type: 'integer', default: 100 })
  priority: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'applies_to_roles', type: 'jsonb', default: [] })
  appliesToRoles: string[];

  @Column({ name: 'applies_to_locations', type: 'jsonb', default: [] })
  appliesToLocations: string[];

  @Column({ name: 'applies_to_shift_types', type: 'jsonb', default: [] })
  appliesToShiftTypes: string[];

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom?: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo?: Date;

  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string;

  @Column({ name: 'validation_function', type: 'varchar', length: 255, nullable: true })
  validationFunction?: string;

  @Column({ name: 'error_message_template', type: 'varchar', length: 500, nullable: true })
  errorMessageTemplate?: string;

  @Column({ name: 'suggested_action_template', type: 'varchar', length: 500, nullable: true })
  suggestedActionTemplate?: string;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: {}
  })
  metadata: Record<string, any>;

  // Audit fields
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Virtual fields
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const isWithinDateRange = (!this.effectiveFrom || this.effectiveFrom <= now) &&
                              (!this.effectiveTo || this.effectiveTo >= now);
    return this.isActive && isWithinDateRange && !this.deletedAt;
  }

  get isHardConstraint(): boolean {
    return this.ruleType === ViolationType.HARD;
  }

  get isSoftConstraint(): boolean {
    return this.ruleType === ViolationType.SOFT;
  }

  get displayName(): string {
    return `${this.ruleCode}: ${this.ruleName}`;
  }

  get weightedPriority(): number {
    return this.priority * Number(this.weight);
  }

  /**
   * Check if this rule applies to a specific role
   */
  appliesToRole(roleId: string): boolean {
    return this.appliesToRoles.length === 0 || this.appliesToRoles.includes(roleId);
  }

  /**
   * Check if this rule applies to a specific location
   */
  appliesToLocation(locationId: string): boolean {
    return this.appliesToLocations.length === 0 || this.appliesToLocations.includes(locationId);
  }

  /**
   * Check if this rule applies to a specific shift type
   */
  appliesToShiftType(shiftType: string): boolean {
    return this.appliesToShiftTypes.length === 0 || this.appliesToShiftTypes.includes(shiftType);
  }

  /**
   * Check if this rule is applicable given the context
   */
  isApplicableInContext(context: {
    roleId?: string;
    locationId?: string;
    shiftType?: string;
    organizationId?: string;
  }): boolean {
    if (!this.isCurrentlyActive) {
      return false;
    }

    if (this.organizationId && context.organizationId !== this.organizationId) {
      return false;
    }

    if (this.locationId && context.locationId !== this.locationId) {
      return false;
    }

    if (context.roleId && !this.appliesToRole(context.roleId)) {
      return false;
    }

    if (context.locationId && !this.appliesToLocation(context.locationId)) {
      return false;
    }

    if (context.shiftType && !this.appliesToShiftType(context.shiftType)) {
      return false;
    }

    return true;
  }

  /**
   * Generate an error message using the template and context
   */
  generateErrorMessage(context: Record<string, any>): string {
    if (!this.errorMessageTemplate) {
      return `Rule violation: ${this.ruleName}`;
    }

    let message = this.errorMessageTemplate;
    Object.keys(context).forEach(key => {
      message = message.replace(`{{${key}}}`, String(context[key]));
    });

    return message;
  }

  /**
   * Generate a suggested action using the template and context
   */
  generateSuggestedAction(context: Record<string, any>): string {
    if (!this.suggestedActionTemplate) {
      return `Review and adjust assignment to comply with: ${this.ruleName}`;
    }

    let action = this.suggestedActionTemplate;
    Object.keys(context).forEach(key => {
      action = action.replace(`{{${key}}}`, String(context[key]));
    });

    return action;
  }
}