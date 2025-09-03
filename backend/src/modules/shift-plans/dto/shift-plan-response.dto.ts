import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class ShiftPlanResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift plan',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030,
  })
  year: number;

  @ApiProperty({
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  month: number;



  @ApiPropertyOptional({
    description: 'User ID who created this shift plan',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  createdBy?: string;


  @ApiProperty({
    description: 'Date when the shift plan was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the shift plan was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}