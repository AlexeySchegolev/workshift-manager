import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Organization } from './organization.entity';
import { Location } from './location.entity';
import { Role } from './role.entity';
import { ShiftPlan } from './shift-plan.entity';
import { ShiftPlanDetail } from './shift-plan-detail.entity';

export enum ShiftType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night',
  FULL_DAY = 'full_day',
  SPLIT = 'split',
  ON_CALL = 'on_call',
  OVERTIME = 'overtime'
}


@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'location_id', type: 'uuid' })
  locationId: string;

  @Column({ name: 'shift_plan_id', type: 'uuid', nullable: true })
  shiftPlanId?: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'short_name', type: 'varchar', length: 10 })
  shortName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.MORNING,
  })
  type: ShiftType;


  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;



  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Location, location => location.shifts)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.shifts, { nullable: true })
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan?: ShiftPlan;

  @ManyToMany(() => Role, role => role.shifts)
  @JoinTable({
    name: 'shift_required_roles',
    joinColumn: { name: 'shift_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  requiredRoles: Role[];

  @OneToMany(() => ShiftPlanDetail, shiftPlanDetail => shiftPlanDetail.shift)
  shiftPlanDetails: ShiftPlanDetail[];

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
  get duration(): number {
    // Calculate duration in hours
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  get isAvailable(): boolean {
    return this.isActive && !this.deletedAt;
  }
}