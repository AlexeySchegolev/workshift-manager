import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ 
    description: 'Unique role ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Organization ID', 
    example: '123e4567-e89b-12d3-a456-426614174001' 
  })
  organizationId: string;

  @ApiProperty({ 
    description: 'Role name', 
    example: 'Dialysis Specialist' 
  })
  name: string;



  @ApiPropertyOptional({ 
    description: 'Created by (User ID)', 
    example: '123e4567-e89b-12d3-a456-426614174002' 
  })
  createdBy?: string;

  @ApiPropertyOptional({ 
    description: 'Updated by (User ID)', 
    example: '123e4567-e89b-12d3-a456-426614174003' 
  })
  updatedBy?: string;

  @ApiProperty({ 
    description: 'Created at', 
    example: '2024-01-01T12:00:00Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Updated at', 
    example: '2024-02-01T12:00:00Z' 
  })
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'Deleted at', 
    example: null 
  })
  deletedAt?: Date;

  @ApiProperty({ 
    description: 'Role is available (computed)', 
    example: true 
  })
  isAvailable: boolean;

  @ApiProperty({ 
    description: 'Display name of the role (computed)', 
    example: 'Dialysis Specialist (specialist)' 
  })
  displayName: string;
}