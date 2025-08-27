import { ApiProperty } from '@nestjs/swagger';

export class LocationStatsDto {
  @ApiProperty({
    description: 'Total number of clients at this location',
    example: 25,
    minimum: 0
  })
  totalClients: number;

  @ApiProperty({
    description: 'Average utilization percentage of the location',
    example: 85.5,
    minimum: 0,
    maximum: 100
  })
  averageUtilization: number;

  @ApiProperty({
    description: 'Number of employees assigned to this location',
    example: 8,
    minimum: 0
  })
  employeeCount: number;

  @ApiProperty({
    description: 'Monthly revenue generated at this location',
    example: 15000.00,
    minimum: 0,
    required: false
  })
  monthlyRevenue?: number;

  @ApiProperty({
    description: 'Client satisfaction rating (1-5 stars)',
    example: 4.2,
    minimum: 1,
    maximum: 5,
    required: false
  })
  clientSatisfaction?: number;

  @ApiProperty({
    description: 'Number of active shifts at this location',
    example: 12,
    minimum: 0
  })
  activeShifts: number;

  @ApiProperty({
    description: 'Average staffing percentage across all shifts',
    example: 92.3,
    minimum: 0
  })
  averageStaffing: number;

  @ApiProperty({
    description: 'Current occupancy rate as percentage of max capacity',
    example: 78.5,
    minimum: 0,
    maximum: 100
  })
  occupancyRate: number;
}