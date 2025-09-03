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
import {EmployeeAbsence} from './employee-absence.entity';


export enum ContractType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;


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
    name: 'contract_type',
    type: 'enum',
    enum: ContractType,
    default: ContractType.FULL_TIME,
  })
  contractType: ContractType;








  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string;

  @Column({ name: 'primary_role_id', type: 'uuid', nullable: true })
  primaryRoleId?: string;

  @Column({ name: 'address', type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode?: string;

  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country?: string;

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

  @OneToMany(() => EmployeeAbsence, absence => absence.employee)
  absences: EmployeeAbsence[];

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
    return this.isActive;
  }

  get yearsOfService(): number {
    const now = new Date();
    const hireDate = new Date(this.hireDate);
    const diffTime = Math.abs(now.getTime() - hireDate.getTime());
      return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }
}