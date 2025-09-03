import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;


  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.roles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToMany(() => Employee, employee => employee.roles)
  employees: Employee[];

  @ManyToMany(() => Shift, shift => shift.requiredRoles)
  shifts: Shift[];

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
  get isAvailable(): boolean {
    return this.isActive && !this.deletedAt;
  }

  get displayName(): string {
    return this.name;
  }
}