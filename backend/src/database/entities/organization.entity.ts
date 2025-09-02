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