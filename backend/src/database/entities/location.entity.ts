import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';

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

export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  CLOSED = 'closed'
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  code?: string; // Short identifier for the location

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10 })
  postalCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 100, default: 'Germany' })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ name: 'manager_name', type: 'varchar', length: 255, nullable: true })
  managerName?: string;

  @Column({ name: 'manager_email', type: 'varchar', length: 255, nullable: true })
  managerEmail?: string;

  @Column({ name: 'manager_phone', type: 'varchar', length: 20, nullable: true })
  managerPhone?: string;

  @Column({ name: 'max_capacity', type: 'integer' })
  maxCapacity: number;

  @Column({ name: 'current_capacity', type: 'integer', default: 0 })
  currentCapacity: number;

  @Column({
    type: 'enum',
    enum: LocationStatus,
    default: LocationStatus.ACTIVE,
  })
  status: LocationStatus;

  @Column({ name: 'floor_area', type: 'decimal', precision: 10, scale: 2, nullable: true })
  floorArea?: number; // in square meters

  @Column({ name: 'number_of_rooms', type: 'integer', nullable: true })
  numberOfRooms?: number;

  @Column({ name: 'number_of_beds', type: 'integer', nullable: true })
  numberOfBeds?: number;

  @Column({ name: 'parking_spaces', type: 'integer', nullable: true })
  parkingSpaces?: number;

  @Column({ name: 'accessibility_features', type: 'jsonb', default: [] })
  accessibilityFeatures: string[];

  @Column({ name: 'safety_features', type: 'jsonb', default: [] })
  safetyFeatures: string[];

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

  @Column({ name: 'timezone', type: 'varchar', length: 50, default: 'Europe/Berlin' })
  timezone: string;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.locations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Employee, employee => employee.location)
  employees: Employee[];

  @OneToMany(() => Shift, shift => shift.location)
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
}