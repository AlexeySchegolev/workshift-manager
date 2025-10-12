import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CalculateShiftPlanDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Location ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  locationId: string;

  @ApiProperty({
    description: 'Year for shift plan calculation',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({
    description: 'Month for shift plan calculation (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
}