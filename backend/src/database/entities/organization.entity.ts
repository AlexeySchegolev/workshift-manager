import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Employee } from './employee.entity';
import { Location } from './location.entity';
import { ShiftPlan } from './shift-plan.entity';
import { Role } from './role.entity';


@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 255, nullable: true })
  legalName?: string;

  @Column({ name: 'tax_id', type: 'varchar', length: 50, nullable: true })
  taxId?: string;

  @Column({ name: 'registration_number', type: 'varchar', length: 100, nullable: true })
  registrationNumber?: string;


  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ name: 'primary_email', type: 'varchar', length: 255, nullable: true })
  primaryEmail?: string;

  @Column({ name: 'primary_phone', type: 'varchar', length: 20, nullable: true })
  primaryPhone?: string;

  @Column({ name: 'headquarters_address', type: 'varchar', length: 500, nullable: true })
  headquartersAddress?: string;

  @Column({ name: 'headquarters_city', type: 'varchar', length: 100, nullable: true })
  headquartersCity?: string;

  @Column({ name: 'headquarters_postal_code', type: 'varchar', length: 10, nullable: true })
  headquartersPostalCode?: string;

  @Column({ name: 'headquarters_country', type: 'varchar', length: 100, nullable: true })
  headquartersCountry?: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({ name: 'subscription_plan', type: 'varchar', length: 50, default: 'basic' })
  subscriptionPlan: string;

  @Column({ name: 'subscription_expires_at', type: 'timestamp', nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({ name: 'max_employees', type: 'integer', default: 50 })
  maxEmployees: number;

  @Column({ name: 'max_locations', type: 'integer', default: 5 })
  maxLocations: number;

  @Column({ 
    type: 'jsonb',
    default: {}
  })
  settings: Record<string, any>;

  @Column({ 
    type: 'jsonb',
    default: []
  })
  features: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToMany(() => Employee, employee => employee.organization)
  employees: Employee[];

  @OneToMany(() => Location, location => location.organization)
  locations: Location[];

  @OneToMany(() => ShiftPlan, shiftPlan => shiftPlan.organization)
  shiftPlans: ShiftPlan[];

  @OneToMany(() => Role, role => role.organization)
  roles: Role[];

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
    get employeeCount(): number {
    return this.employees?.length || 0;
  }
}