import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbsenceType } from '@/database/entities/employee-absence.entity';

export class EmployeeAbsenceResponseDto {
    @ApiProperty({ description: 'Absence UUID', format: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Employee UUID', format: 'uuid' })
    employeeId: string;

    @ApiProperty({ description: 'Start date of absence', format: 'date-time' })
    startDate: Date;

    @ApiProperty({ description: 'End date of absence', format: 'date-time' })
    endDate: Date;

    @ApiProperty({ description: 'Type of absence', enum: AbsenceType })
    absenceType: AbsenceType;

    @ApiPropertyOptional({ description: 'Reason for absence' })
    reason?: string;

    @ApiPropertyOptional({ description: 'Additional notes' })
    notes?: string;

    @ApiProperty({ description: 'Number of days for absence' })
    daysCount: number;

    @ApiPropertyOptional({ description: 'Number of hours for absence' })
    hoursCount?: number;

    @ApiProperty({ description: 'Whether absence is paid' })
    isPaid: boolean;

    @ApiPropertyOptional({ description: 'UUID of creator', format: 'uuid' })
    createdBy?: string;

    @ApiPropertyOptional({ description: 'UUID of last updater', format: 'uuid' })
    updatedBy?: string;

    @ApiProperty({ description: 'Creation timestamp', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', format: 'date-time' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Deletion timestamp', format: 'date-time' })
    deletedAt?: Date;

    // Virtual fields
    @ApiProperty({ description: 'Duration in days (calculated)' })
    duration: number;

    @ApiProperty({ description: 'Whether absence is currently active' })
    isActive: boolean;

    // Related data
    @ApiPropertyOptional({
        description: 'Employee information',
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            employeeNumber: { type: 'string' },
            email: { type: 'string', format: 'email' },
            primaryRole: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    displayName: { type: 'string' }
                }
            }
        }
    })
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        employeeNumber: string;
        email: string;
        primaryRole?: {
            id: string;
            name: string;
            displayName: string;
        };
    };
}