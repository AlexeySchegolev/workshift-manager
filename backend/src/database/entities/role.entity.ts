import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';
import { ShiftRole } from './shift-role.entity';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'short_name', type: 'varchar', length: 10 })
  shortName: string;


  // Relationships
  @ManyToOne(() => Organization, organization => organization.roles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToMany(() => Employee, employee => employee.roles)
  employees: Employee[];

  @ManyToMany(() => Shift, shift => shift.requiredRoles)
  shifts: Shift[];

  @OneToMany(() => ShiftRole, shiftRole => shiftRole.role)
  shiftRoles: ShiftRole[];

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
    return !this.deletedAt;
  }

  get displayName(): string {
    return this.name;
  }
}