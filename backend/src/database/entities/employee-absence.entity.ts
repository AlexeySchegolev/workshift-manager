import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Employee } from './employee.entity';

export enum AbsenceType {
    VACATION = 'vacation',
    SICK_LEAVE = 'sick_leave',
    PERSONAL_LEAVE = 'personal_leave',
    MATERNITY_LEAVE = 'maternity_leave',
    PATERNITY_LEAVE = 'paternity_leave',
    UNPAID_LEAVE = 'unpaid_leave',
    TRAINING = 'training',
    CONFERENCE = 'conference',
    BEREAVEMENT = 'bereavement',
    JURY_DUTY = 'jury_duty',
    MILITARY_LEAVE = 'military_leave',
    OTHER = 'other'
}


@Entity('employee_absences')
export class EmployeeAbsence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'employee_id', type: 'uuid' })
    employeeId: string;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @Column({
        name: 'absence_type',
        type: 'enum',
        enum: AbsenceType
    })
    absenceType: AbsenceType;


    @Column({ name: 'reason', type: 'text', nullable: true })
    reason?: string;

    @Column({ name: 'notes', type: 'text', nullable: true })
    notes?: string;

    @Column({ name: 'days_count', type: 'integer' })
    daysCount: number;

    @Column({ name: 'hours_count', type: 'decimal', precision: 5, scale: 2, nullable: true, transformer: { to: (value) => value, from: (value) => value ? parseFloat(value) : value } })
    hoursCount?: number;

    @Column({ name: 'is_paid', type: 'boolean', default: true })
    isPaid: boolean;


    // Relationships
    @ManyToOne(() => Employee, employee => employee.absences)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;


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
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
    }

    get isActive(): boolean {
        const now = new Date();
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        return now >= start && now <= end;
    }
}