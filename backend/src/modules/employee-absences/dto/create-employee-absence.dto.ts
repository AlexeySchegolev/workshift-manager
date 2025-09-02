import { IsDateString, IsEnum, IsOptional, IsString, IsBoolean, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbsenceType } from '@/database/entities/employee-absence.entity';

export class CreateEmployeeAbsenceDto {
    @ApiProperty({ description: 'Employee UUID', format: 'uuid' })
    @IsUUID()
    employeeId: string;

    @ApiProperty({ description: 'Start date of absence', format: 'date', example: '2025-09-15' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ description: 'End date of absence', format: 'date', example: '2025-09-17' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ description: 'Type of absence', enum: AbsenceType, example: AbsenceType.VACATION })
    @IsEnum(AbsenceType)
    absenceType: AbsenceType;

    @ApiPropertyOptional({ description: 'Reason for absence', example: 'Family vacation' })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ description: 'Additional notes', example: 'Emergency contact available' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'Number of days for absence', example: 3 })
    @IsNumber()
    daysCount: number;

    @ApiPropertyOptional({ description: 'Number of hours for absence', example: 24 })
    @IsOptional()
    @IsNumber()
    hoursCount?: number;

    @ApiPropertyOptional({ description: 'Whether absence is paid', default: true })
    @IsOptional()
    @IsBoolean()
    isPaid?: boolean;
}