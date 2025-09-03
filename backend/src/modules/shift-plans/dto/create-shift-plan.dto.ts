import { IsInt, IsOptional, IsString, Min, Max, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShiftPlanDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Shift plan name',
    example: 'December 2024 Shift Plan',
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Shift plan description',
    example: 'Christmas period shift plan with increased staffing requirements',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Start date of planning period',
    example: '2024-12-01'
  })
  @IsDateString()
  planningPeriodStart: string;

  @ApiProperty({
    description: 'End date of planning period',
    example: '2024-12-31'
  })
  @IsDateString()
  planningPeriodEnd: string;




  @ApiPropertyOptional({
    description: 'ID of user who created this shift plan',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
