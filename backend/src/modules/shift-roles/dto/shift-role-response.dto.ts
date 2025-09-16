import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@/database/entities/role.entity';
import { Shift } from '@/database/entities/shift.entity';

export class ShiftRoleResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift role',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'Shift ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  shiftId: string;

  @ApiProperty({
    description: 'Role ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid'
  })
  roleId: string;

  @ApiProperty({
    description: 'Number of employees needed for this role',
    example: 2
  })
  count: number;

  @ApiProperty({
    description: 'Associated shift details',
    type: () => Shift,
    required: false
  })
  shift?: Shift;

  @ApiProperty({
    description: 'Associated role details',
    type: () => Role,
    required: false
  })
  role?: Role;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    format: 'date-time'
  })
  updatedAt: string;
}