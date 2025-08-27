import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class ShiftRoleRequirementDto {
  @ApiProperty({
    description: 'Role ID for this requirement',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @IsString()
  roleId: string;

  @ApiProperty({
    description: 'Required number of employees with this role',
    example: 2,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  requiredCount: number;

  @ApiProperty({
    description: 'Minimum number of employees with this role',
    example: 1,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  minCount: number;

  @ApiProperty({
    description: 'Maximum number of employees with this role',
    example: 3,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  maxCount: number;

  @ApiProperty({
    description: 'Priority level for this role requirement (1 = lowest, 5 = highest)',
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  priority: number;
}