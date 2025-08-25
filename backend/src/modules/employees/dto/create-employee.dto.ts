import { IsString, IsEnum, IsInt, IsOptional, Min, Max, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeRole } from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ 
    description: 'Employee name', 
    example: 'Max Mustermann',
    minLength: 2,
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Employee role',
    enum: EmployeeRole,
    example: EmployeeRole.ASSISTANT
  })
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @ApiProperty({ 
    description: 'Hours per month the employee should work',
    example: 160,
    minimum: 1,
    maximum: 300
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(300)
  hoursPerMonth: number;

  @ApiPropertyOptional({ 
    description: 'Hours per week (optional)',
    example: 40,
    minimum: 1,
    maximum: 60
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(60)
  hoursPerWeek?: number;

  @ApiPropertyOptional({ 
    description: 'Location ID where employee is assigned',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  locationId?: number;
}