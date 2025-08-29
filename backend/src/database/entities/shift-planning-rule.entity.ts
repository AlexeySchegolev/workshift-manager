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
    get displayName(): string {
    return `${this.ruleCode}: ${this.ruleName}`;
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
}