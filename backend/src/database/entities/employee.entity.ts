import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Organization} from './organization.entity';
import {Location} from './location.entity';
import {Role} from './role.entity';
import {ShiftAssignment} from './shift-assignment.entity';
import {EmployeeAvailability} from './employee-availability.entity';
import {ShiftPreference} from './shift-preference.entity';
import {WorkTimeConstraint} from './work-time-constraint.entity';
import {ShiftPlanningAvailability} from './shift-planning-availability.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended'
}

export enum ContractType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  INTERN = 'intern'
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'employee_number', type: 'varchar', length: 50, unique: true })
  employeeNumber: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @Column({
    name: 'contract_type',
    type: 'enum',
    enum: ContractType,
    default: ContractType.FULL_TIME,
  })
  contractType: ContractType;

  @Column({ name: 'hours_per_month', type: 'decimal', precision: 5, scale: 2, transformer: { to: (value) => value, from: (value) => parseFloat(value) } })
  hoursPerMonth: number;

  @Column({ name: 'max_consecutive_days', type: 'integer', default: 5 })
  maxConsecutiveDays: number;

  @Column({ name: 'preferred_shift_types', type: 'jsonb', default: [] })
  preferredShiftTypes: string[];

  @Column({ name: 'saturday_availability', type: 'boolean', default: true })
  saturdayAvailability: boolean;

  @Column({ name: 'sunday_availability', type: 'boolean', default: false })
  sundayAvailability: boolean;

  @Column({ name: 'hours_per_week', type: 'decimal', precision: 5, scale: 2, nullable: true, transformer: { to: (value) => value, from: (value) => value ? parseFloat(value) : value } })
  hoursPerWeek?: number;

  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: { to: (value) => value, from: (value) => value ? parseFloat(value) : value } })
  hourlyRate?: number;

  @Column({ name: 'overtime_rate', type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: { to: (value) => value, from: (value) => value ? parseFloat(value) : value } })
  overtimeRate?: number;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string;

  @Column({ name: 'primary_role_id', type: 'uuid', nullable: true })
  primaryRoleId?: string;

  @Column({ name: 'supervisor_id', type: 'uuid', nullable: true })
  supervisorId?: string;

  @Column({ name: 'emergency_contact_name', type: 'varchar', length: 255, nullable: true })
  emergencyContactName?: string;

  @Column({ name: 'emergency_contact_phone', type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone?: string;

  @Column({ name: 'address', type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode?: string;

  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({
    name: 'certifications',
    type: 'jsonb',
    default: []
  })
  certifications: string[];

  @Column({
    name: 'skills',
    type: 'jsonb',
    default: []
  })
  skills: string[];

  @Column({
    name: 'languages',
    type: 'jsonb',
    default: []
  })
  languages: string[];

  @Column({ name: 'profile_picture_url', type: 'varchar', length: 500, nullable: true })
  profilePictureUrl?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.employees)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Location, location => location.employees, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'primary_role_id' })
  primaryRole?: Role;

  @ManyToMany(() => Role, role => role.employees)
  @JoinTable({
    name: 'employee_roles',
    joinColumn: { name: 'employee_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: Employee;

  @OneToMany(() => Employee, employee => employee.supervisor)
  subordinates: Employee[];

  @OneToMany(() => ShiftAssignment, assignment => assignment.employee)
  shiftAssignments: ShiftAssignment[];

  @OneToMany(() => EmployeeAvailability, availability => availability.employee)
  availabilities: EmployeeAvailability[];

  @OneToMany(() => ShiftPreference, preference => preference.employee)
  shiftPreferences: ShiftPreference[];

  @OneToMany(() => WorkTimeConstraint, constraint => constraint.employee)
  workTimeConstraints: WorkTimeConstraint[];

  @OneToMany(() => ShiftPlanningAvailability, availability => availability.employee)
  shiftPlanningAvailabilities: ShiftPlanningAvailability[];

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
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get displayName(): string {
    return this.fullName;
  }

  get isAvailable(): boolean {
    return this.isActive && this.status === EmployeeStatus.ACTIVE;
  }

  get yearsOfService(): number {
    const now = new Date();
    const hireDate = new Date(this.hireDate);
    const diffTime = Math.abs(now.getTime() - hireDate.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }
}