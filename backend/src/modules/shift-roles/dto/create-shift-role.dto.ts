import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsUUID, IsOptional } from 'class-validator';

export class CreateShiftRoleDto {
  @ApiProperty({
    description: 'Shift ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @IsString()
  @IsUUID()
  shiftId: string;

  @ApiProperty({
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  @IsString()
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'Number of employees needed for this role',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({
    description: 'User ID who created this record',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  createdBy?: string;
}