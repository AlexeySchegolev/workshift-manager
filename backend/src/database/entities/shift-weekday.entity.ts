import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from './shift.entity';

@Entity('shift_weekdays')
export class ShiftWeekday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @Column({ type: 'int' })
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (JavaScript convention)

  // Relationships
  @ManyToOne(() => Shift, shift => shift.shiftWeekdays)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}