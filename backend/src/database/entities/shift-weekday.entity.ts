import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from './shift.entity';

@Entity('shift_weekdays')
export class ShiftWeekday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @Column({ type: 'int' })
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Relationships
  @ManyToOne(() => Shift, shift => shift.shiftWeekdays)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

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
}