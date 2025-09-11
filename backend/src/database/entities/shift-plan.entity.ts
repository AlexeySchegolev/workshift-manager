import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Location } from './location.entity';
import { User } from './user.entity';
import { Shift } from './shift.entity';



@Entity('shift_plans')
export class ShiftPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'location_id', type: 'uuid' })
  locationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'integer' })
  month: number;

  @Column({ name: 'planning_period_start', type: 'date' })
  planningPeriodStart: Date;

  @Column({ name: 'planning_period_end', type: 'date' })
  planningPeriodEnd: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.shiftPlans)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Location, location => location.shiftPlans)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => User, user => user.createdShiftPlans, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;


  @OneToMany(() => Shift, shift => shift.shiftPlan)
  shifts: Shift[];


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  get isActive(): boolean {
    return !this.deletedAt;
  }
}