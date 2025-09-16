import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from './shift.entity';
import { Role } from './role.entity';

@Entity('shift_roles')
export class ShiftRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @Column({ type: 'int', default: 1 })
  count: number;

  // Relationships
  @ManyToOne(() => Shift, shift => shift.shiftRoles)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @ManyToOne(() => Role, role => role.shiftRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}