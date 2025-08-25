import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

export interface TimeSlot {
  /** Start time in HH:MM format */
  start: string;
  /** End time in HH:MM format */
  end: string;
}

export interface OperatingHours {
  /** Monday operating hours */
  monday: TimeSlot[];
  /** Tuesday operating hours */
  tuesday: TimeSlot[];
  /** Wednesday operating hours */
  wednesday: TimeSlot[];
  /** Thursday operating hours */
  thursday: TimeSlot[];
  /** Friday operating hours */
  friday: TimeSlot[];
  /** Saturday operating hours */
  saturday: TimeSlot[];
  /** Sunday operating hours */
  sunday: TimeSlot[];
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10 })
  postalCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manager?: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ 
    name: 'operating_hours',
    type: 'jsonb',
    default: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  })
  operatingHours: OperatingHours;

  @Column({ 
    type: 'jsonb',
    default: []
  })
  services: string[];

  @Column({ 
    type: 'jsonb',
    default: []
  })
  equipment: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @OneToMany(() => Employee, employee => employee.location)
  employees: Employee[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}