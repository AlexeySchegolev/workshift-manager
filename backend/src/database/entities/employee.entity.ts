import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Location } from './location.entity';
import { ShiftAssignment } from './shift-assignment.entity';

export enum EmployeeRole {
  SPECIALIST = 'Specialist',
  ASSISTANT = 'Assistant',
  SHIFT_LEADER = 'ShiftLeader',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.ASSISTANT,
  })
  role: EmployeeRole;

  @Column({ name: 'hours_per_month', type: 'integer' })
  hoursPerMonth: number;

  @Column({ name: 'hours_per_week', type: 'integer', nullable: true })
  hoursPerWeek?: number;

  @Column({ name: 'location_id', type: 'integer', nullable: true })
  locationId?: number;

  // Relationships
  @ManyToOne(() => Location, location => location.employees, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @OneToMany(() => ShiftAssignment, assignment => assignment.employee)
  shiftAssignments: ShiftAssignment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}